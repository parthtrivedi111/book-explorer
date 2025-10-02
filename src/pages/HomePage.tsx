import { useState, useRef, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import BookList from '../components/BookList';
import type { Book, SearchParams } from '../types/book';
import { searchBooks } from '../services/bookService';

const DEBOUNCE_DELAY = 500; // 500ms debounce
const SEARCH_STATE_KEY = 'bookExplorer_searchState';

interface SearchState {
    params: SearchParams;
    books: Book[];
    totalItems: number;
    hasSearched: boolean;
}

const HomePage = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [initialParams, setInitialParams] = useState<SearchParams | null>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastSearchRef = useRef<string>('');
    const isRestoredRef = useRef(false);

    // Restore search state on mount
    useEffect(() => {
        const savedState = sessionStorage.getItem(SEARCH_STATE_KEY);
        if (savedState && !isRestoredRef.current) {
            try {
                const state: SearchState = JSON.parse(savedState);
                setBooks(state.books);
                setTotalItems(state.totalItems);
                setHasSearched(state.hasSearched);
                setInitialParams(state.params);
                isRestoredRef.current = true;
            } catch (err) {
                console.error('Failed to restore search state:', err);
            }
        }
    }, []);

    const handleSearch = async (params: SearchParams) => {
        // Create a unique search identifier
        const searchKey = `${params.title}-${params.author}-${params.keyword}`;

        // Prevent duplicate searches
        if (searchKey === lastSearchRef.current && loading) {
            console.log('Duplicate search prevented');
            return;
        }

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        setLoading(true);
        setError(null);

        // Debounce the actual API call
        debounceTimerRef.current = setTimeout(async () => {
            try {
                lastSearchRef.current = searchKey;
                const response = await searchBooks({ ...params, startIndex: 0, maxResults: 40 });
                console.log(response);
                setBooks(response.books);
                setTotalItems(response.totalItems);
                setHasSearched(true);

                // Save search state to sessionStorage
                const searchState: SearchState = {
                    params,
                    books: response.books,
                    totalItems: response.totalItems,
                    hasSearched: true,
                };
                sessionStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(searchState));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while searching books');
                setBooks([]);
                setTotalItems(0);
            } finally {
                setLoading(false);
            }
        }, DEBOUNCE_DELAY);
    };

    return (
        <div className="home-page">
            {/* <div className="page-header">
                <h1 className="page-title">Book Explorer</h1>
                <p className="page-description">
                    Search for books by title, author, or keyword/genre
                </p>
            </div> */}

            <SearchForm onSearch={handleSearch} isLoading={loading} initialParams={initialParams} />

            {hasSearched && (
                <BookList
                    books={books}
                    loading={loading}
                    error={error}
                    totalItems={totalItems}
                />
            )}
        </div>
    );
};

export default HomePage;
