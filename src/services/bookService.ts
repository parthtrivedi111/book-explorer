import type { Book, SearchParams, SearchResponse } from '../types/book';

const API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const MAX_RESULTS = 40; // Items to fetch
const MAX_RETRIES = 1; // Reduced retries
const INITIAL_RETRY_DELAY = 2000; // Increased to 2 seconds
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// API Key support (optional - increases rate limits significantly)
// To use: Set environment variable VITE_GOOGLE_BOOKS_API_KEY
const API_KEY = 'AIzaSyDaui36LfyB_Djr25R_QbAPx3YpN0PA5tM';

// Simple in-memory cache to prevent duplicate requests
interface CacheEntry {
    data: SearchResponse;
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const bookCache = new Map<string, { data: Book; timestamp: number }>();

// Helper function to wait/delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate cache key from search params
const getCacheKey = (params: SearchParams | string): string => {
    if (typeof params === 'string') return params;
    const { title, author, keyword, startIndex } = params;
    return `${title || ''}-${author || ''}-${keyword || ''}-${startIndex || 0}`;
};

// Check if cache entry is still valid
const isCacheValid = (entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
};

// Retry logic with exponential backoff
const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<Response> => {
    for (let i = 0; i <= retries; i++) {
        try {
            const response = await fetch(url);

            // If rate limited (429), retry with exponential backoff
            if (response.status === 429 && i < retries) {
                const waitTime = INITIAL_RETRY_DELAY * Math.pow(2, i);
                console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry ${i + 1}/${retries}...`);
                await delay(waitTime);
                continue;
            }

            return response;
        } catch (error) {
            // On last retry, throw the error
            if (i === retries) {
                throw error;
            }
            // Wait before retrying on network errors
            const waitTime = INITIAL_RETRY_DELAY * Math.pow(2, i);
            await delay(waitTime);
        }
    }
    throw new Error('Max retries reached');
};

export const searchBooks = async (params: SearchParams): Promise<SearchResponse> => {
    const { title, author, keyword, startIndex = 0, maxResults = MAX_RESULTS } = params;

    // Check cache first
    const cacheKey = getCacheKey(params);
    const cachedEntry = cache.get(cacheKey);
    if (cachedEntry && isCacheValid(cachedEntry)) {
        console.log('Returning cached results');
        return cachedEntry.data;
    }

    // Construct the query string
    let query = '';
    if (title) query += `title:${title}`;
    if (author) query += query ? `+author:${author}` : `author:${author}`;
    if (keyword) query += query ? `+${keyword}` : keyword;

    // If no query parameters, throw error
    if (!query) {
        throw new Error('At least one search parameter is required');
    }

    try {
        // Build URL with pagination and optional API key
        let url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=${maxResults}`;
        if (API_KEY) {
            url += `&key=${API_KEY}`;
        }

        const response = await fetchWithRetry(url);

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait 1-2 minutes before searching again. Consider adding a Google Books API key to increase limits.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const searchResponse: SearchResponse = {
            books: data.items || [],
            totalItems: data.totalItems || 0
        };

        // Cache the results
        cache.set(cacheKey, {
            data: searchResponse,
            timestamp: Date.now()
        });

        return searchResponse;
    } catch (error) {
        console.error('Error searching books:', error);
        throw error;
    }
};

export const getBookById = async (id: string): Promise<Book | null> => {
    // Check cache first (book details have different cache structure)
    const cacheKey = `book-${id}`;
    const cachedBook = bookCache.get(cacheKey);
    if (cachedBook && Date.now() - cachedBook.timestamp < CACHE_DURATION) {
        console.log('Returning cached book details');
        return cachedBook.data;
    }

    try {
        let url = `${API_BASE_URL}/${id}`;
        if (API_KEY) {
            url += `?key=${API_KEY}`;
        }

        const response = await fetchWithRetry(url);

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limit exceeded. Please wait 1-2 minutes before trying again.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Cache the result
        bookCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        return data;
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
};
