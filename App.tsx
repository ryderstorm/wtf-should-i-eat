import React, { useState, useCallback, useRef } from 'react';
import { SearchForm } from './components/SearchForm';
import { RestaurantList } from './components/RestaurantList';
import { findRestaurants } from './services/mapsService';
import type { Restaurant, StreamResult } from './types';
import { ForkKnifeIcon } from './components/Icons';
import { sortRestaurants } from './utils/sortUtils';

const App: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  
  // Use refs to accumulate results without triggering re-renders
  const accumulatedRestaurantsRef = useRef<Restaurant[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (location: string | GeolocationCoordinates, radius: number, openNow: boolean, cuisine: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setRestaurants([]);
    accumulatedRestaurantsRef.current = [];
    
    // Clear any pending batch updates
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchTimeoutRef.current = null;
    }

    try {
      const stream = findRestaurants(location, radius, openNow, cuisine);
      let foundRestaurants = false;
      
      for await (const result of stream) {
        if (result.type === 'restaurant') {
            foundRestaurants = true;
            const restaurantData = result.data;

            // Add to accumulated array instead of immediately updating state
            accumulatedRestaurantsRef.current.push(restaurantData);
            
            // Batch updates: update state every 3 restaurants or every 200ms
            // Don't sort during streaming - just show unsorted results for better UX
            if (accumulatedRestaurantsRef.current.length % 3 === 0) {
              // Clear any pending timeout
              if (batchTimeoutRef.current) {
                clearTimeout(batchTimeoutRef.current);
              }
              // Update state with unsorted accumulated restaurants (sorting happens at the end)
              setRestaurants([...accumulatedRestaurantsRef.current]);
            } else {
              // Schedule a batched update if not already scheduled
              if (!batchTimeoutRef.current) {
                batchTimeoutRef.current = setTimeout(() => {
                  setRestaurants([...accumulatedRestaurantsRef.current]);
                  batchTimeoutRef.current = null;
                }, 200);
              }
            }
        }
      }
      
      // Process any remaining restaurants and sort once at the end
      if (accumulatedRestaurantsRef.current.length > 0) {
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }
        // Only sort once at the very end for optimal performance
        setRestaurants(sortRestaurants([...accumulatedRestaurantsRef.current]));
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
          sources={[]}
          isLoading={isLoading}
          error={error}
          hasSearched={hasSearched}
        />
      </main>
       <footer className="text-center py-4 text-xs text-slate-500 dark:text-slate-400">
        <p>Powered by Google Maps. Find your next favorite local eatery.</p>
      </footer>
    </div>
  );
};

export default App;