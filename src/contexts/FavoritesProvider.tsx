import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/book';
import { FavoritesContext } from './FavoritesContext';

interface FavoritesProviderProps {
    children: ReactNode;
}

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    // Initialize state from localStorage using lazy initialization
    const [favorites, setFavorites] = useState<Book[]>(() => {
        try {
            const savedFavorites = localStorage.getItem('bookExplorerFavorites');
            if (savedFavorites) {
                return JSON.parse(savedFavorites);
            }
        } catch (error) {
            console.error('Error parsing favorites from localStorage:', error);
        }
        return [];
    });

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('bookExplorerFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (book: Book) => {
        setFavorites((prev) => {
            // Check if book already exists in favorites
            if (prev.some((fav) => fav.id === book.id)) {
                return prev;
            }
            return [...prev, book];
        });
    };

    const removeFavorite = (id: string) => {
        setFavorites((prev) => prev.filter((book) => book.id !== id));
    };

    const isFavorite = (id: string) => {
        return favorites.some((book) => book.id === id);
    };

    const value = {
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
