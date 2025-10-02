import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { FavoritesProvider } from './contexts/FavoritesProvider';
import Layout from './components/Layout';
import './App.css';

// Lazy load pages for code-splitting and better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));

function App() {
  return (
    <FavoritesProvider>
      <Layout>
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book/:id" element={<BookDetailsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </FavoritesProvider>
  );
}

export default App;