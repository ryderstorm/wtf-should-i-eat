# Architecture Overview

## System Architecture

WTF Should I Eat? is a React-based single-page application that helps users discover locally-owned restaurants using Google's Gemini AI and Google Maps integration.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Application (SPA)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   App.tsx    │  │  Components  │  │  Services │ │   │
│  │  │              │  │              │  │           │ │   │
│  │  │ - State Mgmt │  │ - SearchForm │  │ - Gemini  │ │   │
│  │  │ - Streaming  │  │ - Restaurant │  │   Service │ │   │
│  │  │ - Batching   │  │   Card/List  │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Google Gemini API  │
                    │  (with Maps Tools)   │
                    └─────────────────────┘
```

## Component Hierarchy

```
App
├── SearchForm
│   ├── Location Input
│   ├── Cuisine Filter
│   ├── Radius Selector
│   └── Open Now Toggle
└── RestaurantList
    ├── RestaurantCard (memoized)
    │   ├── Restaurant Info
    │   ├── Hours Display
    │   └── Contact Links
    └── Sources Footer
```

## Data Flow

### Search Flow

1. **User Input** → SearchForm captures location, radius, cuisine, and openNow filter
2. **API Call** → geminiService streams results from Gemini API with Google Maps grounding
3. **Streaming** → Results arrive incrementally as JSON objects
4. **Batching** → App batches updates every 3 restaurants or 200ms
5. **Sorting** → Results sorted once at end of stream
6. **Rendering** → RestaurantList displays cards with React.memo optimization

### State Management

- **Local State**: React useState hooks for restaurants, sources, loading, error
- **Refs**: useRef for accumulating results without triggering re-renders
- **No Global State**: No Redux/Zustand needed for current scope

## Key Technologies

- **React 19**: UI framework with latest features
- **TypeScript**: Type safety throughout
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Google Gemini API**: AI-powered restaurant discovery
- **Google Maps**: Location data and grounding

## Performance Optimizations

See [PERFORMANCE.md](./performance.md) for detailed information on:
- Batched state updates
- React.memo usage
- Efficient source matching
- Deferred sorting

## File Structure

```
app/
├── App.tsx                 # Main application component
├── index.tsx              # React entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies
├── types.ts              # TypeScript type definitions
├── constants.ts           # App constants
│
├── components/            # React components
│   ├── SearchForm.tsx    # Search input form
│   ├── RestaurantList.tsx # Results container
│   ├── RestaurantCard.tsx # Individual restaurant card
│   ├── Spinner.tsx       # Loading indicator
│   └── Icons.tsx         # SVG icon components
│
├── services/             # External service integrations
│   └── geminiService.ts  # Gemini API client
│
└── utils/                # Utility functions
    └── sortUtils.ts      # Restaurant sorting logic
```

## Environment Variables

- `GEMINI_API_KEY`: Required API key for Google Gemini
- Loaded via Vite's environment variable system
- Configured in `.env.local` file

## Build & Deployment

- **Development**: `npm run dev` (port 3000)
- **Production**: `npm run build` → static files in `dist/`
- **Preview**: `npm run preview` to test production build

## Future Considerations

- Add caching layer for repeated searches
- Implement user preferences storage
- Add favorites/bookmarks functionality
- Consider service worker for offline support
- Add analytics integration
