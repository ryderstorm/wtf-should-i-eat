# WTF Should I Eat? 🍽️

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

A modern, AI-powered restaurant discovery app that helps you find amazing locally-owned restaurants near you. Built with React, TypeScript, and Google's Gemini AI.

## ✨ Features

- 🔍 **Smart Search**: Find restaurants by location, cuisine type, and radius
- 📍 **Location Support**: Search by address or use your current location
- ⏰ **Real-time Status**: See which restaurants are open now
- ⭐ **Smart Sorting**: Results sorted by open status, closing time, and ratings
- 🚀 **Fast Streaming**: Results appear instantly as they're discovered
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🔗 **Direct Links**: Quick access to Google Maps, phone, and websites

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wtf-should-i-eat/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the app directory:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📖 Usage

### Basic Search

1. Enter a location (address, city, or landmark) or click the location icon to use your current location
2. Optionally filter by cuisine type (e.g., "Pizza", "Italian", "Sushi")
3. Select your search radius (0.5 to 10 miles)
4. Toggle "Open Now" to filter for currently open restaurants
5. Click "Search" and watch results stream in real-time

### Understanding Results

Results are automatically sorted by:
1. **Open Status**: Open restaurants appear first
2. **Closing Time**: Restaurants closing later appear first
3. **Rating**: Higher-rated restaurants appear first
4. **Review Count**: More reviews break ties

Each restaurant card shows:
- Name and cuisine type
- Current status (Open now / Closed)
- Closing time (if open)
- Star rating and review count
- Price indicator ($ to $$$$)
- Distance from search point
- Full address with Google Maps link
- Phone number (clickable)
- Website link
- Hours of operation (expandable)

## 🏗️ Project Structure

```
app/
├── App.tsx                 # Main application component
├── index.tsx               # React entry point
├── components/            # React components
│   ├── SearchForm.tsx    # Search input form
│   ├── RestaurantList.tsx # Results container
│   ├── RestaurantCard.tsx # Individual restaurant card
│   ├── Spinner.tsx       # Loading indicator
│   └── Icons.tsx         # SVG icon components
├── services/              # External service integrations
│   └── geminiService.ts  # Gemini API client
├── utils/                # Utility functions
│   └── sortUtils.ts      # Restaurant sorting logic
├── types.ts              # TypeScript type definitions
├── constants.ts          # App constants
└── docs/                 # Documentation
    ├── architecture.md   # System architecture
    ├── api.md           # API documentation
    ├── performance.md   # Performance guide
    └── contributing.md  # Contributing guide
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎯 How It Works

1. **User Input**: You provide location, radius, cuisine filter, and open-now preference
2. **AI Processing**: Google Gemini AI searches Google Maps for matching restaurants
3. **Streaming Results**: Results stream back as JSON objects in real-time
4. **Smart Batching**: Results are batched every 3 restaurants or 200ms for optimal performance
5. **Intelligent Sorting**: Results are sorted once at the end by open status, closing time, and ratings
6. **Display**: Restaurant cards render with all relevant information and links

## ⚡ Performance

The app is optimized for speed and responsiveness:

- **Batched Updates**: Reduces re-renders by ~65%
- **Deferred Sorting**: Saves ~95% of sorting operations
- **React.memo**: Prevents unnecessary component re-renders
- **Efficient Lookups**: O(1) source matching with Maps
- **Stable Keys**: Optimized React reconciliation

See [docs/performance.md](./docs/performance.md) for detailed information.

## 📚 Documentation

- [Architecture](./docs/architecture.md) - System architecture and design decisions
- [API Reference](./docs/api.md) - API documentation and data types
- [Performance Guide](./docs/performance.md) - Performance optimizations
- [Contributing](./docs/contributing.md) - How to contribute to the project

## 🧪 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Restaurant discovery
- **Google Maps** - Location data

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./docs/contributing.md) for guidelines.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with Google AI Studio
- Powered by Google Gemini AI
- Location data from Google Maps

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for food lovers everywhere
