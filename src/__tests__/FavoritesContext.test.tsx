import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useFavorites } from '../contexts/FavoritesContext';
import { FavoritesProvider } from '../contexts/FavoritesProvider';
import type { Book } from '../types/book';

// Mock book data
const mockBook1: Book = {
    id: 'book1',
    volumeInfo: {
        title: 'Test Book 1',
        authors: ['Author 1']
    }
};

const mockBook2: Book = {
    id: 'book2',
    volumeInfo: {
        title: 'Test Book 2',
        authors: ['Author 2']
    }
};

// Mock component to test the context
const TestComponent = () => {
    const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

    return (
        <div>
            <span data-testid="favorites-count">{favorites.length}</span>
            <button
                data-testid="add-book1"
                onClick={() => addFavorite(mockBook1)}
            >
                Add Book 1
            </button>
            <button
                data-testid="add-book2"
                onClick={() => addFavorite(mockBook2)}
            >
                Add Book 2
            </button>
            <button
                data-testid="remove-book1"
                onClick={() => removeFavorite(mockBook1.id)}
            >
                Remove Book 1
            </button>
            <span data-testid="is-book1-favorite">
                {isFavorite(mockBook1.id).toString()}
            </span>
        </div>
    );
};

// Mock localStorage
const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

describe('FavoritesContext', () => {
    beforeEach(() => {
        mockLocalStorage.clear();
        vi.clearAllMocks();
    });

    it('provides an empty favorites array initially', () => {
        render(
            <FavoritesProvider>
                <TestComponent />
            </FavoritesProvider>
        );

        expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
        expect(screen.getByTestId('is-book1-favorite')).toHaveTextContent('false');
    });

    it('adds a book to favorites', async () => {
        render(
            <FavoritesProvider>
                <TestComponent />
            </FavoritesProvider>
        );

        const addButton = screen.getByTestId('add-book1');

        await act(async () => {
            addButton.click();
        });

        expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
        expect(screen.getByTestId('is-book1-favorite')).toHaveTextContent('true');
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'bookExplorerFavorites',
            expect.any(String)
        );
    });

    it('does not add duplicate books', async () => {
        render(
            <FavoritesProvider>
                <TestComponent />
            </FavoritesProvider>
        );

        const addButton = screen.getByTestId('add-book1');

        await act(async () => {
            addButton.click();
            addButton.click();
        });

        expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    });

    it('removes a book from favorites', async () => {
        render(
            <FavoritesProvider>
                <TestComponent />
            </FavoritesProvider>
        );

        const addButton = screen.getByTestId('add-book1');
        const removeButton = screen.getByTestId('remove-book1');

        await act(async () => {
            addButton.click();
        });

        expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');

        await act(async () => {
            removeButton.click();
        });

        expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
        expect(screen.getByTestId('is-book1-favorite')).toHaveTextContent('false');
    });

    it('loads favorites from localStorage on mount', async () => {
        // Setup localStorage with saved favorites
        const savedFavorites = JSON.stringify([mockBook1]);
        mockLocalStorage.getItem.mockReturnValueOnce(savedFavorites);

        render(
            <FavoritesProvider>
                <TestComponent />
            </FavoritesProvider>
        );

        // Check if favorites were loaded from localStorage
        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('bookExplorerFavorites');
        expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
        expect(screen.getByTestId('is-book1-favorite')).toHaveTextContent('true');
    });
});
