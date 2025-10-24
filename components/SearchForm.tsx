import React, { useState } from 'react';
import { RADIUS_OPTIONS } from '../constants';
import { LocationIcon, SearchIcon } from './Icons';
import { Spinner } from './Spinner';

interface SearchFormProps {
  onSearch: (location: string | GeolocationCoordinates, radius: number, openNow: boolean, cuisine: string) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [location, setLocation] = useState<string>('');
  const [radius, setRadius] = useState<number>(2);
  const [openNow, setOpenNow] = useState<boolean>(true);
  const [cuisine, setCuisine] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseMyLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        setLocation('My Current Location');
        onSearch(position.coords, radius, openNow, cuisine);
      },
      (error) => {
        setIsLocating(false);
        setLocationError(`Error: ${error.message}. Please enable location services.`);
        console.error("Geolocation error:", error);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && location !== 'My Current Location') {
      onSearch(location, radius, openNow, cuisine);
    } else if (location === 'My Current Location') {
        handleUseMyLocation();
    } else if (!location) {
      setLocationError('Please enter a location or use your current location.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (locationError) setLocationError(null);
            }}
            placeholder="Enter an address, city, or landmark"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
            disabled={isLoading || isLocating}
          />
          <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
           <input
            type="text"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            placeholder="Cuisine (e.g., Pizza)"
            className="w-full sm:w-32 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400"
            disabled={isLoading || isLocating}
          />
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-auto px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-500 focus:border-rose-500 dark:bg-slate-700 dark:border-slate-600"
            disabled={isLoading || isLocating}
          >
            {RADIUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="p-2 border border-slate-300 rounded-md hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isLocating}
            title="Use my location"
          >
            {isLocating ? <Spinner className="w-5 h-5" /> : <LocationIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
                type="checkbox"
                checked={openNow}
                onChange={(e) => setOpenNow(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                disabled={isLoading || isLocating}
            />
            Open Now
        </label>
        <button
          type="submit"
          className="bg-rose-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-slate-900 disabled:bg-rose-400 disabled:cursor-wait flex items-center justify-center gap-2 grow sm:grow-0"
          disabled={isLoading || isLocating}
        >
          {isLoading ? <Spinner className="w-5 h-5"/> : 'Search'}
        </button>
      </div>
      {locationError && <p className="text-sm text-red-500 mt-1">{locationError}</p>}
    </form>
  );
};