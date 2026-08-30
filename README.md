# Weather App

A modern weather application built with Next.js 16, React 19, and TypeScript, showcasing advanced React hooks and server-side rendering capabilities.

## 🌐 Live Preview

**[View Live App →](https://weather-app-six-dun-62.vercel.app)**

Deployed on [Vercel](https://vercel.com)

## Features

- **Real-time Weather Data**: Current conditions, hourly forecast, and 7-day outlook
- **Location Search**: Smart search with keyboard navigation and debouncing
- **Favorites**: Save and manage favorite locations with optimistic updates
- **Weather Analytics**: Statistical insights including temperature trends and precipitation probability
- **City Explorer**: Filter and explore 1000+ cities with responsive filtering
- **Unit Toggle**: Switch between Celsius and Fahrenheit

## Tech Stack

- **Next.js 16** - App Router with Server Components
- **React 19** - Latest hooks including useActionState and useOptimistic
- **TypeScript** - Full type safety
- **GraphQL** - Type-safe data fetching with graphql-yoga
- **Apollo Client** - Client-side GraphQL integration
- **Tailwind CSS 4** - Modern styling
- **Open-Meteo API** - Weather data source

## React 19 Hooks

This project demonstrates modern React patterns:

- `useActionState` - Form submissions with automatic pending states
- `useOptimistic` - Instant UI updates before server confirmation
- `useReducer` - Complex state management
- `useMemo` - Performance optimization for expensive calculations
- `useCallback` - Memoized event handlers
- `useTransition` - Non-blocking UI updates

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Docker Setup

Run the app using Docker for a consistent environment:

### Using Docker Compose (Recommended)

```bash
# Build and run the container
docker-compose up

# Run in detached mode
docker-compose up -d

# Stop the container
docker-compose down
```

### Using Docker directly

```bash
# Build the image
docker build -t weather-app .

# Run the container
docker run -p 3000:3000 weather-app
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Docker Notes

- The Dockerfile uses a multi-stage build for optimal image size
- Runs as a non-root user for security
- Includes only production dependencies in the final image

## Project Structure

```
src/
├── app/              # Next.js App Router pages and API routes
│   ├── actions.ts    # Server Actions for favorites
│   └── page.tsx      # Main weather page
├── components/       # React components
│   ├── Favorites.tsx      # Favorite locations with useActionState
│   ├── WeatherStats.tsx   # Weather analytics with useMemo
│   ├── CityFilter.tsx     # Advanced filtering with all hooks
│   ├── LocationSearch.tsx # Search with useReducer & useCallback
│   ├── HourlyStrip.tsx    # Hourly forecast
│   ├── DailyGrid.tsx      # Daily forecast
│   └── CurrentPanel.tsx   # Current conditions
├── bff/              # Backend-for-Frontend (GraphQL layer)
│   ├── schema.ts     # GraphQL schema
│   ├── resolvers.ts  # GraphQL resolvers
│   └── openMeteo.ts  # Weather API client
└── lib/              # Utilities and context providers
```

## Key Components

### Favorites
Manages favorite locations using React 19's `useActionState` for form handling and `useOptimistic` for instant UI feedback.

### WeatherStats
Displays statistical insights using `useMemo` to optimize expensive calculations on weather data.

### CityFilter
Advanced filtering component demonstrating all major React hooks with a dataset of 1000 cities.

### LocationSearch
Intelligent search with keyboard navigation, debouncing, and complex state managed by `useReducer`.

## API Integration

The app uses a GraphQL BFF (Backend-for-Frontend) pattern:
- Client components use Apollo Client for queries
- Server components use direct GraphQL execution
- Data fetched from Open-Meteo API

## Performance

- Server-side rendering for fast initial load
- Optimistic updates for instant user feedback
- Memoization for expensive calculations
- Non-blocking transitions for responsive UI
- Debounced search to reduce API calls

## License

MIT
