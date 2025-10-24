import React, { useState, useCallback } from 'react';
import { SearchForm } from './components/SearchForm';
import { RestaurantList } from './components/RestaurantList';
import { findRestaurants } from './services/geminiService';
import type { Restaurant, GroundingChunk, StreamResult } from './types';
import { ForkKnifeIcon } from './components/Icons';
import { sortRestaurants } from './utils/sortUtils';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = useCallback(async (location: string | GeolocationCoordinates, radius: number, openNow: boolean, cuisine: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRestaurants([]);
    setSources([]);
    let currentSources: GroundingChunk[] = [];

    try {
      const stream = findRestaurants(location, radius, openNow, cuisine);
      let foundRestaurants = false;
      for await (const result of stream) {
        if (result.type === 'sources') {
            setSources(result.data);
            currentSources = result.data;
        } else if (result.type === 'restaurant') {
            foundRestaurants = true;
            const restaurantData = result.data;

            const source = currentSources.find(s =>
                s.maps.title.toLowerCase().includes(restaurantData.name.toLowerCase()) ||
                restaurantData.name.toLowerCase().includes(s.maps.title.toLowerCase())
            );

            const augmentedRestaurant: Restaurant = {
              ...restaurantData,
              mapsUri: source?.maps.uri,
            };

            setRestaurants(prev => sortRestaurants([...prev, augmentedRestaurant]));
        }
      }
       if (!foundRestaurants) {
          setError('No restaurants found. Try expanding your search radius or changing your filters.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch restaurant data. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <ForkKnifeIcon className="w-8 h-8 text-rose-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              WTF Should I Eat?
            </h1>
          </div>
          <div className="w-full sm:max-w-xl">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        <RestaurantList
          restaurants={restaurants}
          sources={sources}
          isLoading={isLoading}
          error={error}
          hasSearched={hasSearched}
        />
      </main>
       <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Powered by Google Gemini. Find your next favorite local eatery.</p>
      </footer>
    </div>
  );
};

export default App;