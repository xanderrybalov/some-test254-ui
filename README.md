# Movie Finder App aka some-test254-ui

A modern React application for searching movies built with the latest technologies.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router 7** - Routing
- **Styled Components** - CSS-in-JS styling
- **React Hook Form** - Form management
- **Ant Design** - UI components
- **OMDB API** - Movie data source

## Features

- 🎬 Search movies by title
- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- ⚡ Fast search with debouncing
- 📋 Movie results with posters and details
- 🎨 Modern UI inspired by the design system

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. **Important**: Make sure your backend API server is running on `http://localhost:8080/api`
   - The movie search functionality requires the backend to be running
   - Start your backend server with `npm run dev` in your backend directory

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit `http://localhost:3000` (opens automatically)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # App header with theme toggle
│   ├── HomePage.tsx    # Main page layout
│   ├── MovieList.tsx   # Movie results list
│   └── MovieSearch.tsx # Search form component
├── hooks/              # Custom hooks
│   └── redux.ts        # Typed Redux hooks
├── store/              # Redux store
│   ├── index.ts        # Store configuration
│   └── movieSlice.ts   # Movies state management
├── styles/             # Styling and themes
│   ├── GlobalStyles.tsx # Global styled components
│   ├── ThemeContext.tsx # Theme provider
│   └── themes.ts       # Light/dark theme definitions
├── types/              # TypeScript types
│   ├── movie.ts        # Movie-related types
│   └── theme.ts        # Theme types
└── utils/              # Utility functions
```

## API

This application uses a custom backend API for movie data. The backend integrates with OMDB API and provides the following endpoints:

- `POST /api/movies/search` - Search movies (JSON body: `{"query": "movie title"}`)
- `POST /api/movies/by-ids` - Fetch movies by IDs  
- `POST /api/users/ensure` - Create or get user

Make sure your backend server is running on `http://localhost:8080` before using the application.

## Theme System

The app supports both light and dark themes with:
- Automatic Ant Design theme integration
- Styled Components theme provider
- Persistent theme switching
- Smooth transitions between themes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).