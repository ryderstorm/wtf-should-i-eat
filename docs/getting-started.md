# Getting Started Guide

Welcome to WTF Should I Eat?! This guide will help you get up and running quickly.

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API Key** - [Get one here](https://makersuite.google.com/app/apikey)

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd wtf-should-i-eat/app
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React 19
- TypeScript
- Vite
- Google GenAI SDK
- Tailwind CSS (via CDN)

### Step 3: Configure Environment Variables

Create a `.env.local` file in the app directory:

```bash
touch .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

**Important**: Never commit this file to version control!

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see output like:

```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Navigate to `http://localhost:3000` in your browser.

## First Search

Try these searches to get familiar with the app:

### Example 1: Search by City

1. Enter "San Francisco, CA" in the location field
2. Select "2 miles" radius
3. Leave cuisine empty
4. Check "Open Now"
5. Click "Search"

### Example 2: Use Your Location

1. Click the location icon
2. Allow location access when prompted
3. Select "5 miles" radius
4. Enter "Pizza" in cuisine field
5. Click "Search"

### Example 3: Explore Different Cuisines

Try searching for:
- "Italian"
- "Sushi"
- "Mexican"
- "Thai"
- "Vegetarian"

## Understanding the UI

### Search Form

- **Location Input**: Enter any address, city, or landmark
- **Cuisine Filter**: Optional filter for specific cuisine types
- **Radius Selector**: Choose search radius (0.5 to 10 miles)
- **Location Button**: Use your current GPS location
- **Open Now Toggle**: Filter to only currently open restaurants
- **Search Button**: Execute the search

### Restaurant Cards

Each card displays:
- Restaurant name and cuisine type
- Current status badge (Open now / Closed)
- Closing time (if open)
- Star rating and review count
- Price indicator ($ to $$$$)
- Distance from search point
- Address with Google Maps link
- Phone number (clickable)
- Website link
- Expandable hours of operation

### Results Sorting

Results are automatically sorted by:
1. Open status (open restaurants first)
2. Closing time (later closing times first)
3. Rating (higher ratings first)
4. Review count (more reviews first)

## Development Tips

### Hot Module Replacement

The app uses Vite's HMR (Hot Module Replacement). Changes to your code will automatically update in the browser without a full page reload.

### TypeScript

The project uses TypeScript for type safety. If you see type errors, fix them before running the app.

### Console Logging

Open browser DevTools (F12) to see:
- API responses
- Parsing warnings
- Error messages

### Performance Monitoring

Use browser DevTools Performance tab to:
- Monitor render times
- Check re-render counts
- Identify performance bottlenecks

## Common Issues

### Issue: "API_KEY environment variable is not set"

**Solution**: Make sure `.env.local` exists and contains `GEMINI_API_KEY=your_key`

### Issue: Port 3000 already in use

**Solution**: Kill the process using port 3000 or change the port in `vite.config.ts`

### Issue: No restaurants found

**Possible causes**:
- Location is too specific or invalid
- Radius is too small
- Cuisine filter is too restrictive
- No restaurants match the criteria

**Solution**: Try a broader search (larger radius, no cuisine filter)

### Issue: Location permission denied

**Solution**: 
1. Check browser settings
2. Use HTTPS (required for geolocation)
3. Try entering location manually instead

## Next Steps

Now that you're up and running:

1. **Read the Architecture**: [docs/architecture.md](./architecture.md)
2. **Explore the API**: [docs/api.md](./api.md)
3. **Understand Performance**: [docs/performance.md](./performance.md)
4. **Start Contributing**: [docs/contributing.md](./contributing.md)

## Building for Production

When you're ready to deploy:

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

To preview the production build:

```bash
npm run preview
```

## Getting Help

- Check the [documentation](./)
- Review [existing issues](https://github.com/your-repo/issues)
- Open a [new issue](https://github.com/your-repo/issues/new)

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

Happy coding! 🚀
