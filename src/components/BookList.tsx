import { memo } from 'react';
import BookCard from './BookCard';
import type { Book } from '../types/book';
import './BookList.css';

interface BookListProps {
    books: Book[];
    loading: boolean;
    error: string | null;
    totalItems?: number;
}

const BookList = ({ books, loading, error }: BookListProps) => {

    if (loading) {
        return (
            <div className="book-list-message book-list-loading">
                <div className="spinner"></div>
                <p>Finding the best books for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="book-list-message book-list-error">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>
                    <h3>Something went wrong</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="no-results-card">
                <div className="no-results-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" className="no-results-icon">
                        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="no-results-pulse"></div>
                </div>
                <div className="no-results-content">
                    <h3>No Books Found</h3>
                    <p>We couldn't find any books matching your search criteria.</p>
                    <div className="no-results-suggestions">
                        <span className="suggestion-badge">Try different keywords</span>
                        <span className="suggestion-badge">Check your spelling</span>
                        <span className="suggestion-badge">Use broader terms</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="book-list-wrapper animate-fade-in">
            {/* Results count */}
            {/* <div className="results-info">
                <p>
                    Found <strong>{books.length}</strong> of <strong>{totalItems.toLocaleString()}</strong> results
                </p>
            </div> */}

            <div className="book-list stagger-items">
                {books.map((book) => (
                    <div key={book.id} className="book-list-item">
                        <BookCard book={book} />
                    </div>
                ))}
            </div>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(BookList);
