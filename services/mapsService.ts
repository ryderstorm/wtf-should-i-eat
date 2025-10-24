import type { Restaurant, StreamResult } from '../types';

// Google Maps Places API endpoint
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

interface MapsPlace {
  id: string;
  displayName: {
    text: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: 'PRICE_LEVEL_FREE' | 'PRICE_LEVEL_INEXPENSIVE' | 'PRICE_LEVEL_MODERATE' | 'PRICE_LEVEL_EXPENSIVE' | 'PRICE_LEVEL_VERY_EXPENSIVE';
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: {
    weekdayDescriptions: string[];
  };
  types: string[];
  businessStatus: string;
}

interface MapsResponse {
  places: MapsPlace[];
}

// Convert Google Maps price level to dollar signs
const priceLevelToDollars = (level?: string): string => {
  switch (level) {
    case 'PRICE_LEVEL_FREE':
    case 'PRICE_LEVEL_INEXPENSIVE':
      return '$';
    case 'PRICE_LEVEL_MODERATE':
      return '$$';
    case 'PRICE_LEVEL_EXPENSIVE':
      return '$$$';
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return '$$$$';
    default:
      return '$$';
  }
};

// Parse hours from weekday descriptions
const parseHours = (weekdayDescriptions: string[]): Record<string, string> => {
  const hours: Record<string, string> = {};
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  weekdayDescriptions.forEach((desc, index) => {
    if (desc && desc !== 'Closed') {
      hours[days[index]] = desc;
    } else {
      hours[days[index]] = 'Closed';
    }
  });
  
  return hours;
};

// Calculate distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): string => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  if (distance < 0.1) return '< 0.1 miles';
  if (distance < 1) return `${distance.toFixed(1)} miles`;
  return `${Math.round(distance)} miles`;
};

// Check if place is currently open
const isOpenNow = (place: MapsPlace): boolean => {
  // Google Maps API doesn't provide real-time open status in searchNearby
  // We'll need to make a separate call or use businessStatus
  return place.businessStatus === 'OPERATIONAL';
};

// Geocode a string location to coordinates
async function geocodeLocation(location: string): Promise<{ lat: number; lng: number }> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GEMINI_API_KEY}`;
  
  const response = await fetch(geocodeUrl);
  const data = await response.json();
  
  if (data.status !== 'OK' || !data.results || data.results.length === 0) {
    throw new Error(`Could not geocode location: ${location}`);
  }
  
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function* findRestaurants(
  location: string | GeolocationCoordinates,
  radius: number,
  openNow: boolean,
  cuisine: string,
): AsyncGenerator<StreamResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }

  // Convert location to coordinates
  let lat: number, lng: number;
  
  if (typeof location === 'string') {
    const coords = await geocodeLocation(location);
    lat = coords.lat;
    lng = coords.lng;
  } else {
    lat = location.latitude;
    lng = location.longitude;
  }

  try {
    // Convert miles to meters
    const radiusMeters = radius * 1609.34;

    // Build the request
    const requestBody: any = {
      includedTypes: ['restaurant'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: radiusMeters,
        },
      },
    };

    // Add cuisine filter if specified
    if (cuisine) {
      requestBody.keyword = cuisine;
    }

    const response = await fetch(PLACES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GEMINI_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.rating,places.userRatingCount,places.priceLevel,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.types,places.businessStatus',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Maps API error: ${response.status} - ${errorText}`);
    }

    const data: MapsResponse = await response.json();

    // Filter out chains (simple heuristic - can be improved)
    const chainKeywords = ['mcdonald', 'starbucks', 'subway', 'burger king', 'pizza hut', 'domino', 'kfc', 'taco bell', 'wendy', 'dunkin'];
    
    const localRestaurants = data.places.filter(place => {
      const nameLower = place.displayName.text.toLowerCase();
      return !chainKeywords.some(keyword => nameLower.includes(keyword));
    });

    // Stream results
    for (const place of localRestaurants) {
      // Skip if filtering for open now and place is closed
      if (openNow && !isOpenNow(place)) {
        continue;
      }

      const restaurant: Restaurant = {
        name: place.displayName.text,
        price: priceLevelToDollars(place.priceLevel),
        distance: calculateDistance(lat, lng, place.location.latitude, place.location.longitude),
        address: place.formattedAddress || 'Address not available',
        phone: place.nationalPhoneNumber || '',
        website: place.websiteUri || '',
        hours: place.regularOpeningHours 
          ? parseHours(place.regularOpeningHours.weekdayDescriptions)
          : {},
        rating: {
          stars: place.rating || 0,
          count: place.userRatingCount || 0,
        },
        cuisine: place.types.find(t => t.includes('restaurant'))?.replace('_', ' ') || 'Restaurant',
        status: isOpenNow(place) ? 'Open now' : 'Closed',
        mapsUri: `https://www.google.com/maps/place/?q=place_id:${place.id}`,
      };

      yield { type: 'restaurant', data: restaurant };
    }

  } catch (error) {
    console.error('Error calling Google Maps API:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Could not fetch data from Google Maps API.');
  }
}
