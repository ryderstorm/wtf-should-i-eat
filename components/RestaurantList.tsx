
import React from 'react';
import type { Restaurant, GroundingChunk } from '../types';
import { RestaurantCard } from './RestaurantCard';
import { Spinner } from './Spinner';

interface RestaurantListProps {
  restaurants: Restaurant[];
  sources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, sources, isLoading, error, hasSearched }) => {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Spinner className="w-12 h-12 mx-auto text-rose-500" />
        <p className="mt-4 text-lg font-medium">Finding the best local spots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-lg font-semibold text-red-700 dark:text-red-300">Oops! Something went wrong.</p>
        <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (hasSearched && restaurants.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium">No locally-owned restaurants found.</p>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Try adjusting your search location or increasing the radius.</p>
      </div>
    );
  }
  
  if (!hasSearched) {
      return (
          <div className="text-center py-20">
              <h2 className="text-3xl font-bold tracking-tight">Discover Your Next Meal</h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Find and support amazing, locally-owned restaurants near you.
              </p>
          </div>
      )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={`${restaurant.name}-${restaurant.address}`} restaurant={restaurant} />
        ))}
      </div>
      {sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Data Sources from Google Maps:</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {sources.map((source, index) => (
                <li key={index}>
                  <a href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-600 dark:text-rose-400 hover:underline">
                    {source.maps.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};
