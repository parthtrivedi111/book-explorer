import { createContext, useContext } from 'react';
import type { Book } from '../types/book';

export interface FavoritesContextType {
    favorites: Book[];
    addFavorite: (book: Book) => void;
    removeFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};