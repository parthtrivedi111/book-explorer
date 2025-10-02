import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Book } from '../types/book';
import { getBookById } from '../services/bookService';
import { useFavorites } from '../contexts/FavoritesContext';
import './BookDetailsPage.css';

const BookDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Use ref to prevent duplicate API calls
    const isLoadingRef = useRef(false);
    const loadedIdRef = useRef<string | null>(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!id) {
                setError('Book ID is missing');
                setLoading(false);
                return;
            }

            // Prevent duplicate calls for the same ID
            if (isLoadingRef.current || loadedIdRef.current === id) {
                return;
            }

            try {
                isLoadingRef.current = true;
                setLoading(true);
                const bookData = await getBookById(id);
                setBook(bookData);
                setError(null);
                loadedIdRef.current = id;
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load book details');
                setBook(null);
                loadedIdRef.current = null;
            } finally {
                setLoading(false);
                isLoadingRef.current = false;
            }
        };

        fetchBookDetails();
    }, [id]);

    const handleFavoriteToggle = () => {
        if (!book) return;

        if (isFavorite(book.id)) {
            removeFavorite(book.id);
        } else {
            addFavorite(book);
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="book-details-page">
                <div className="book-details-loading">
                    <div className="loading-spinner-modern">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    <p>Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="book-details-page">
                <div className="book-details-error">
                    <div className="error-icon-wrapper">
                        <svg viewBox="0 0 24 24" className="error-icon" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h2>Oops! Something went wrong</h2>
                    <p>{error || 'Book not found'}</p>
                    <button className="btn-back" onClick={handleGoBack}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const { volumeInfo } = book;

    // Helper function to convert HTTP to HTTPS for Google Books images
    const getSecureImageUrl = (url?: string) => {
        if (!url) return '/placeholder-book.png';
        // Convert http:// to https:// for Google Books images to avoid mixed content issues
        return url.replace(/^http:\/\//i, 'https://');
    };

    const coverImage = getSecureImageUrl(
        volumeInfo.imageLinks?.extraLarge ||
        volumeInfo.imageLinks?.large ||
        volumeInfo.imageLinks?.medium ||
        volumeInfo.imageLinks?.thumbnail ||
        volumeInfo.imageLinks?.smallThumbnail
    );

    const rating = volumeInfo.averageRating || 0;
    const ratingCount = volumeInfo.ratingsCount || 0;

    return (
        <div className="book-details-page">
            {/* Navigation Bar */}
            <div className="details-nav">
                <button className="btn-back-nav" onClick={handleGoBack}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Hero Section with Backdrop */}
            <div className="book-hero">
                {/* <div className="hero-overlay"></div> */}
            </div>

            {/* Main Content */}
            <div className="book-details-wrapper">
                <div className="book-details-grid">
                    {/* Left Column - Book Cover & Actions */}
                    <aside className="book-sidebar">
                        <div className="book-cover-card">
                            <div className={`book-cover-wrapper ${imageLoaded ? 'loaded' : 'loading'}`}>
                                {!imageLoaded && <div className="cover-shimmer"></div>}
                                <img
                                    src={coverImage}
                                    alt={`${volumeInfo.title} cover`}
                                    onLoad={() => setImageLoaded(true)}
                                    className={imageLoaded ? 'visible' : ''}
                                />
                            </div>

                            <button
                                className={`btn-favorite-details ${isFavorite(book.id) ? 'is-favorite' : ''}`}
                                onClick={handleFavoriteToggle}
                                aria-label={isFavorite(book.id) ? 'Remove from favorites' : 'Add to favorites'}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill={isFavorite(book.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>

                            {/* Quick Info Stats */}
                            <div className="quick-stats">
                                {volumeInfo.pageCount && (
                                    <div className="stat-item">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <span className="stat-value">{volumeInfo.pageCount}</span>
                                            <span className="stat-label">Pages</span>
                                        </div>
                                    </div>
                                )}

                                {volumeInfo.language && (
                                    <div className="stat-item">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div>
                                            <span className="stat-value">{volumeInfo.language.toUpperCase()}</span>
                                            <span className="stat-label">Language</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Links */}
                            {(volumeInfo.previewLink || volumeInfo.infoLink) && (
                                <div className="action-links">
                                    {volumeInfo.previewLink && (
                                        <a
                                            href={volumeInfo.previewLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-action btn-primary-action"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            Preview Book
                                        </a>
                                    )}

                                    {volumeInfo.infoLink && (
                                        <a
                                            href={volumeInfo.infoLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-action btn-secondary-action"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            More Info
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Column - Book Information */}
                    <main className="book-main-content">
                        {/* Title & Author */}
                        <div className="book-header-section">
                            <h1 className="book-title-main">{volumeInfo.title}</h1>

                            {volumeInfo.authors && volumeInfo.authors.length > 0 && (
                                <div className="book-authors-main">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <span>by <strong>{volumeInfo.authors.join(', ')}</strong></span>
                                </div>
                            )}

                            {/* Rating */}
                            {rating > 0 && (
                                <div className="book-rating-section">
                                    <div className="stars-display" style={{ '--rating': rating } as React.CSSProperties}>
                                        <span className="star">★</span>
                                        <span className="star">★</span>
                                        <span className="star">★</span>
                                        <span className="star">★</span>
                                        <span className="star">★</span>
                                    </div>
                                    <span className="rating-text">
                                        <strong>{rating.toFixed(1)}</strong> out of 5
                                    </span>
                                    {ratingCount > 0 && (
                                        <span className="rating-count-text">({ratingCount.toLocaleString()} ratings)</span>
                                    )}
                                </div>
                            )}

                            {/* Categories */}
                            {volumeInfo.categories && volumeInfo.categories.length > 0 && (
                                <div className="book-categories-badges">
                                    {volumeInfo.categories.map((category, index) => (
                                        <span key={index} className="category-badge">{category}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Publishing Info */}
                        <div className="book-info-section">
                            <h3 className="section-title">Publishing Information</h3>
                            <div className="info-grid">
                                {volumeInfo.publisher && (
                                    <div className="info-item">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        <div>
                                            <span className="info-label">Publisher</span>
                                            <span className="info-value">{volumeInfo.publisher}</span>
                                        </div>
                                    </div>
                                )}

                                {volumeInfo.publishedDate && (
                                    <div className="info-item">
                                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        <div>
                                            <span className="info-label">Published</span>
                                            <span className="info-value">{volumeInfo.publishedDate}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {volumeInfo.description && (
                            <div className="book-description-section">
                                <h3 className="section-title">About This Book</h3>
                                <div className="description-content" dangerouslySetInnerHTML={{ __html: volumeInfo.description }}></div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;
