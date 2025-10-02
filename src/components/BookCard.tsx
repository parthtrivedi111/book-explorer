import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../types/book';
import { useFavorites } from '../contexts/FavoritesContext';
import './BookCard.css';

interface BookCardProps {
    book: Book;
    showActions?: boolean;
}

const BookCard = ({ book, showActions = true }: BookCardProps) => {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const { volumeInfo, id } = book;
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleFavoriteToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent triggering the Link
        e.stopPropagation();

        if (isFavorite(id)) {
            removeFavorite(id);
        } else {
            addFavorite(book);
        }
    };

    // Helper function to convert HTTP to HTTPS for Google Books images
    const getSecureImageUrl = (url?: string) => {
        if (!url) return '/placeholder-book.png';
        // Convert http:// to https:// for Google Books images to avoid mixed content issues
        return url.replace(/^http:\/\//i, 'https://');
    };

    // Default image if none is available - use medium quality for cards
    const coverImage = getSecureImageUrl(
        volumeInfo.imageLinks?.medium ||
        volumeInfo.imageLinks?.small ||
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail
    );

    // Rating display
    const rating = volumeInfo.averageRating || 0;
    const ratingCount = volumeInfo.ratingsCount || 0;

    // Book categories
    const category = volumeInfo.categories?.[0] || '';

    return (
        <Link to={`/book/${id}`} className="book-card">
            <div className="book-card-image-wrapper">
                <div className={`book-card-image ${imageLoaded ? 'loaded' : 'loading'}`}>
                    {!imageLoaded && <div className="image-placeholder shimmer"></div>}
                    <img
                        src={coverImage}
                        alt={`${volumeInfo.title} cover`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        className={imageLoaded ? 'visible' : ''}
                    />
                </div>
                {category && <span className="book-category">{category}</span>}
            </div>

            <div className="book-card-content">
                <div className="book-meta">
                    {rating > 0 && (
                        <div className="book-rating">
                            <div className="stars" style={{ '--rating': rating } as React.CSSProperties}>
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                                <span className="star">★</span>
                            </div>
                            <span className="rating-count">({ratingCount})</span>
                        </div>
                    )}
                    {volumeInfo.publishedDate && (
                        <span className="book-date">
                            {new Date(volumeInfo.publishedDate).getFullYear()}
                        </span>
                    )}
                </div>

                <h3 className="book-title line-clamp-2">{volumeInfo.title}</h3>

                {volumeInfo.authors && (
                    <p className="book-authors">
                        by <span>{volumeInfo.authors.join(', ')}</span>
                    </p>
                )}

                {volumeInfo.description && (
                    <p className="book-description line-clamp-1">
                        {volumeInfo.description}
                    </p>
                )}

                <div className="book-footer">
                    {volumeInfo.pageCount && (
                        <span className="book-pages">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {volumeInfo.pageCount} pages
                        </span>
                    )}

                    <span className="read-more">Read more</span>
                </div>
            </div>

            {showActions && (
                <button
                    className={`favorite-button ${isFavorite(id) ? 'is-favorite' : ''}`}
                    onClick={handleFavoriteToggle}
                    aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill={isFavorite(id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="favorite-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </Link>
    );
};

// Memoize to prevent unnecessary re-renders in lists
export default memo(BookCard);
