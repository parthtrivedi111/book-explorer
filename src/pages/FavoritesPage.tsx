import { useMemo } from 'react';
import { useFavorites } from '../contexts/FavoritesContext';
import BookCard from '../components/BookCard';
import './FavoritesPage.css';

const FavoritesPage = () => {
    const { favorites } = useFavorites();

    // Memoize to prevent unnecessary re-renders
    const hasFavorites = useMemo(() => favorites.length > 0, [favorites.length]);

    return (
        <div className="favorites-page">
            <div className="page-header">
                <h1 className="page-title">Favorite Books</h1>
                <p className="page-description">
                    {hasFavorites
                        ? 'Your collection of favorite books'
                        : 'Books you add to favorites will appear here'}
                </p>
            </div>

            {hasFavorites ? (
                <div className="favorites-grid">
                    {favorites.map((book) => (
                        <div key={book.id} className="favorites-item">
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="favorites-empty">
                    <p>You haven't added any favorite books yet.</p>
                    <p>Start searching for books and add them to your favorites!</p>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;
