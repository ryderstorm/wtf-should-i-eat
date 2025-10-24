# API Documentation

## Gemini Service API

### `findRestaurants()`

Main function for discovering restaurants using Google Gemini AI with Google Maps integration.

#### Signature

```typescript
async function* findRestaurants(
  location: string | GeolocationCoordinates,
  radius: number,
  openNow: boolean,
  cuisine: string
): AsyncGenerator<StreamResult>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `location` | `string \| GeolocationCoordinates` | Search location (address string or GPS coordinates) |
| `radius` | `number` | Search radius in miles (0.5, 1, 2, 5, or 10) |
| `openNow` | `boolean` | Filter to only currently open restaurants |
| `cuisine` | `string` | Optional cuisine type filter (e.g., "Pizza", "Italian") |

#### Returns

An async generator that yields `StreamResult` objects:

```typescript
type StreamResult =
  | { type: 'sources'; data: GroundingChunk[] }
  | { type: 'restaurant'; data: Restaurant };
```

#### Usage Example

```typescript
const stream = findRestaurants("New York, NY", 2, true, "Pizza");

for await (const result of stream) {
  if (result.type === 'sources') {
    console.log('Sources:', result.data);
  } else if (result.type === 'restaurant') {
    console.log('Restaurant:', result.data);
  }
}
```

## Data Types

### Restaurant

```typescript
interface Restaurant {
  name: string;              // Business name
  price: string;             // Price indicator ($, $$, $$$, $$$$)
  distance: string;          // Distance from search point
  address: string;          // Full street address
  phone: string;            // Contact phone number
  website: string;          // Website URL (empty if unavailable)
  hours: {                  // Hours of operation
    Monday?: string;
    Tuesday?: string;
    Wednesday?: string;
    Thursday?: string;
    Friday?: string;
    Saturday?: string;
    Sunday?: string;
  };
  rating: {
    stars: number;          // Rating out of 5
    count: number;         // Number of reviews
  };
  cuisine: string;         // Cuisine type description
  status: string;          // Current status ("Open now", "Closed")
  mapsUri?: string;        // Google Maps URL (added by App)
}
```

### GroundingChunk

```typescript
interface GroundingChunk {
  maps: {
    title: string;         // Google Maps place title
    uri: string;          // Google Maps URL
  };
}
```

## Utility Functions

### `sortRestaurants()`

Sorts restaurants by priority: open status → closing time → rating → review count.

```typescript
function sortRestaurants(restaurants: Restaurant[]): Restaurant[]
```

**Sorting Logic:**
1. Open restaurants appear before closed ones
2. Among open restaurants, those closing later appear first
3. Among restaurants with same closing time, higher ratings first
4. Among restaurants with same rating, more reviews first

### `getClosingTime()`

Extracts the closing time for today from restaurant hours.

```typescript
function getClosingTime(restaurant: Restaurant): string | null
```

Returns the closing time string (e.g., "10:00 PM") or `null` if closed.

## Constants

### `RADIUS_OPTIONS`

Available search radius options:

```typescript
const RADIUS_OPTIONS = [
  { value: 0.5, label: '0.5 miles' },
  { value: 1, label: '1 mile' },
  { value: 2, label: '2 miles' },
  { value: 5, label: '5 miles' },
  { value: 10, label: '10 miles' }
];
```

## Error Handling

The Gemini service throws errors in the following cases:

- **Missing API Key**: `Error("API_KEY environment variable is not set.")`
- **API Failure**: `Error("Could not fetch data from Gemini API.")`
- **Network Issues**: Original error is logged and re-thrown

## Streaming Behavior

The API streams results incrementally:

1. **Sources** are yielded first (Google Maps grounding data)
2. **Restaurants** are yielded one at a time as JSON objects
3. Each restaurant is a complete JSON object on its own line
4. Parsing errors are logged but don't stop the stream

## Rate Limiting

Currently no rate limiting is implemented. Consider adding:
- Request throttling
- Result caching
- User-based rate limits

## API Configuration

The Gemini API is configured with:

- **Model**: `gemini-2.5-flash`
- **Tool**: Google Maps grounding enabled
- **Streaming**: Enabled for real-time results
