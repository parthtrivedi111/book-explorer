# Book Explorer

A modern, responsive web application for discovering and managing your favorite books using the Google Books API. Built with React, TypeScript, and Vite.

## Project Overview

Book Explorer is a single-page application (SPA) that allows users to:
- Search for books by title, author, and keyword
- View detailed information about individual books
- Save favorite books to a personal collection
- Browse their favorites in a dedicated page

The application features a clean, modern UI with smooth animations and responsive design, providing an excellent user experience across all devices.

## Technologies Used

- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better developer experience
- **React Router DOM v7** - Client-side routing
- **Vite** - Fast build tool and development server
- **Vitest** - Unit testing framework
- **Google Books API** - Book data source

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd book-explorer
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure API Key:
   - The app works without an API key but has rate limits
   - To increase rate limits, add your Google Books API key:
   - Open `src/services/bookService.ts`
   - Replace the `API_KEY` constant with your key from [Google Cloud Console](https://console.cloud.google.com/)

## Running the Application

### Development Mode

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## Testing the Application

### Run Tests

Execute all tests:

```bash
npm test
```

### Run Tests with Coverage

Generate a coverage report:

```bash
npm run test:coverage
```

The test suite includes:
- Component tests for `BookCard`, `SearchForm`
- Context tests for `FavoritesContext`
- Routing tests for `App` component

## Architecture & Design Decisions

### Routing Approach

**Implementation:** React Router DOM v7 with declarative routing and lazy loading

**Key Features:**
- **Code Splitting:** Pages are lazy-loaded using `React.lazy()` to reduce initial bundle size
- **Suspense Boundaries:** Loading states handled gracefully with `Suspense` component
- **Catch-all Route:** Invalid routes redirect to home page using `Navigate` component
- **URL Parameters:** Book details pages use dynamic routing (`/book/:id`)
- **BrowserRouter:** Used at the root level in `main.tsx` for clean URLs without hash

**Trade-offs:**
- ✅ Better performance with code splitting
- ✅ Improved user experience with smooth transitions
- ⚠️ Requires proper server configuration for SPA routing in production (handled by Vite's preview server)

### Form Handling

**Implementation:** Controlled components with React state and custom validation

**Key Features:**
- **Controlled Inputs:** Form state managed via `useState` hook
- **Real-time Validation:** Errors clear as user types
- **Submit Validation:** At least one search field required
- **Loading States:** Button disabled and shows spinner during API calls
- **URL Persistence:** Search parameters saved to URL query strings for shareability

**Code Example:**
```typescript
const [formData, setFormData] = useState<SearchParams>({
    title: '', author: '', keyword: ''
});

const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
        onSearch(formData);
    }
};
```

**Trade-offs:**
- ✅ Simple and lightweight - no external form library needed
- ✅ Type-safe with TypeScript interfaces
- ⚠️ Manual validation logic (could use a library like React Hook Form for more complex forms)

### State Management

**Implementation:** React Context API with localStorage persistence

**Architecture:**
- **FavoritesContext:** Provides favorites state and operations
- **FavoritesProvider:** Manages state and syncs with localStorage
- **Custom Hook:** `useFavorites()` for easy consumption in components

**Features:**
1. **Local Persistence:** Favorites saved to localStorage automatically
2. **Lazy Initialization:** State initialized from localStorage on mount
3. **Efficient Updates:** Immutable state updates prevent unnecessary re-renders
4. **Type Safety:** Fully typed context with TypeScript

**Code Structure:**
```typescript
// Context definition
export const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Provider with localStorage sync
const [favorites, setFavorites] = useState<Book[]>(() => {
    const saved = localStorage.getItem('bookExplorerFavorites');
    return saved ? JSON.parse(saved) : [];
});

useEffect(() => {
    localStorage.setItem('bookExplorerFavorites', JSON.stringify(favorites));
}, [favorites]);
```

**Trade-offs:**
- ✅ No external dependencies (Redux, Zustand, etc.)
- ✅ Simple to understand and maintain
- ✅ Perfect for this scale of application
- ✅ Automatic persistence without extra code
- ⚠️ Context causes re-renders for all consumers (acceptable with only one context)
- ⚠️ Not suitable for very large-scale state management

### API Service Layer

**Implementation:** Centralized service with caching and retry logic

**Features:**
- **Request Caching:** 5-minute cache to prevent duplicate API calls
- **Retry Logic:** Automatic retry with exponential backoff for failed requests
- **Rate Limit Handling:** Graceful handling of API rate limits (429 errors)
- **Error Handling:** Comprehensive error messages for debugging

**Trade-offs:**
- ✅ Reduced API calls and improved performance
- ✅ Better user experience during network issues
- ✅ Handles Google Books API rate limits gracefully
- ⚠️ In-memory cache cleared on page refresh (could use IndexedDB for persistence)

### Styling Approach

**Implementation:** CSS Modules with separate style files per component

**Structure:**
- Component-specific styles (e.g., `BookCard.css`)
- Global styles organized by purpose:
  - `theme.css` - Colors, spacing, shadows
  - `typography.css` - Font styles
  - `animations.css` - Reusable animations
  - `utils.css` - Utility classes

**Trade-offs:**
- ✅ No additional dependencies (no CSS-in-JS or Tailwind)
- ✅ Good separation of concerns
- ✅ CSS is native and performant
- ⚠️ Manual management of class names (could use CSS Modules for scoping)

### Testing Strategy

**Implementation:** Vitest with React Testing Library

**Coverage:**
- Component rendering and interaction tests
- Context provider functionality
- Routing and navigation
- Mock API services for isolated testing

**Trade-offs:**
- ✅ Fast test execution with Vitest
- ✅ Good integration with Vite
- ✅ React Testing Library promotes best practices (testing behavior over implementation)
- ⚠️ Limited E2E testing (could add Playwright/Cypress for full user flows)

## Performance Optimizations

1. **Code Splitting:** Lazy loading of routes
2. **API Caching:** Reduces network requests
3. **Image Optimization:** Placeholder images for missing book covers
4. **Debouncing:** Could be added for search input (not implemented to keep it simple)

## Future Enhancements

- Add pagination for search results (currently loads 40 books)
- Implement advanced filters (publication date, language, ratings)
- Add user authentication for cloud-synced favorites
- Implement server-side rendering (SSR) with Next.js
- Add dark mode toggle
- Improve accessibility (ARIA labels, keyboard navigation)

## Project Structure

```
book-explorer/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React Context providers
│   ├── pages/           # Route pages
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   ├── styles/          # Global styles
│   └── __tests__/       # Test files
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## License

This project is open source and available under the MIT License.
