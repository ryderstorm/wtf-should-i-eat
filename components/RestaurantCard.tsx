import React, { useMemo, memo } from 'react';
import type { Restaurant } from '../types';
import { getClosingTime } from '../utils/sortUtils';
import { PhoneIcon, GlobeAltIcon, MapPinIcon, StarIcon, ClockIcon } from './Icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const RestaurantCard: React.FC<RestaurantCardProps> = memo(({ restaurant }) => {
  const isClosed = restaurant.status.toLowerCase().includes('closed');

  const closingTime = useMemo(() => {
    if (isClosed) return null;
    return getClosingTime(restaurant);
  }, [restaurant, isClosed]);

  const mapsLink = restaurant.mapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name + ", " + restaurant.address)}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white pr-2 flex-1">{restaurant.name}</h2>
          <div className={`text-sm font-semibold px-2 py-1 rounded-full whitespace-nowrap ${isClosed ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
            {restaurant.status}
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{restaurant.cuisine}</p>

        {closingTime && (
            <div className="mb-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span>Open until {closingTime}</span>
            </div>
        )}
        
        <div className="flex items-center space-x-4 mb-4 text-sm">
            <div className="flex items-center text-amber-500">
                <StarIcon className="w-4 h-4 mr-1"/>
                <span className="font-semibold">{restaurant.rating.stars}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">({restaurant.rating.count} reviews)</span>
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{restaurant.price}</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold">{restaurant.distance}</span>
        </div>

        <div className="space-y-3 text-sm">
          <InfoLine icon={<MapPinIcon />} text={restaurant.address} href={mapsLink} />
          {restaurant.phone && <InfoLine icon={<PhoneIcon />} text={restaurant.phone} href={`tel:${restaurant.phone}`} />}
          {restaurant.website && <InfoLine icon={<GlobeAltIcon />} text={restaurant.website} href={restaurant.website} />}
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-4 border-t border-slate-200 dark:border-slate-700">
        <details>
            <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:text-rose-600 dark:hover:text-rose-400">
                <ClockIcon className="w-4 h-4" />
                <span>Hours of Operation</span>
            </summary>
            <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400 pl-6">
                {WEEK_DAYS.map(day => (
                    restaurant.hours[day as keyof typeof restaurant.hours] ? (
                        <div key={day} className="flex justify-between">
                            <span>{day}</span>
                            <span className="font-mono">{restaurant.hours[day as keyof typeof restaurant.hours]}</span>
                        </div>
                    ) : null
                ))}
            </div>
        </details>
      </div>
    </div>
  );
});

RestaurantCard.displayName = 'RestaurantCard';

interface InfoLineProps {
    icon: React.ReactNode;
    text: string;
    href?: string;
}

const InfoLine: React.FC<InfoLineProps> = ({ icon, text, href }) => {
    const content = (
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{icon}</div>
            <span className="truncate">{text}</span>
        </div>
    );

    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">{content}</a>
    }
    return content;
};