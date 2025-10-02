import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { FavoritesProvider } from '../contexts/FavoritesProvider';

// Mock book data
const mockBook = {
    id: 'abc123',
    volumeInfo: {
        title: 'Test Book',
        authors: ['Author 1', 'Author 2'],
        description: 'This is a test book description that is long enough to be truncated in the BookCard component.',
        imageLinks: {
            thumbnail: 'https://example.com/test-thumbnail.jpg'
        }
    }
};

// Wrapper component to provide context and router
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <FavoritesProvider>
                {ui}
            </FavoritesProvider>
        </BrowserRouter>
    );
};

describe('BookCard', () => {
    it('renders book information correctly', () => {
        renderWithProviders(<BookCard book={mockBook} />);

        expect(screen.getByText('Test Book')).toBeInTheDocument();
        expect(screen.getByText('Author 1, Author 2')).toBeInTheDocument();

        // Check if description is truncated
        const description = screen.getByText(/This is a test book description/);
        expect(description).toBeInTheDocument();
        expect(description.textContent?.length).toBeLessThanOrEqual(153); // 150 chars + '...'

        // Check if the image is rendered with the correct src
        const image = screen.getByAltText('Test Book cover') as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain('https://example.com/test-thumbnail.jpg');
    });

    it('renders with placeholder image when no image links provided', () => {
        const bookWithNoImage = {
            ...mockBook,
            volumeInfo: {
                ...mockBook.volumeInfo,
                imageLinks: undefined
            }
        };

        renderWithProviders(<BookCard book={bookWithNoImage} />);

        const image = screen.getByAltText('Test Book cover') as HTMLImageElement;
        expect(image.src).toContain('/placeholder-book.png');
    });

    it('renders a link to the book details page', () => {
        renderWithProviders(<BookCard book={mockBook} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/book/abc123');
    });

    it('does not show favorite button when showActions is false', () => {
        renderWithProviders(<BookCard book={mockBook} showActions={false} />);

        const favoriteButton = screen.queryByRole('button');
        expect(favoriteButton).not.toBeInTheDocument();
    });

    it('toggles favorite status when clicking the favorite button', async () => {
        renderWithProviders(<BookCard book={mockBook} />);

        // Initially the book is not a favorite
        const favoriteButton = screen.getByRole('button');
        expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorites');

        // Click to add to favorites
        await userEvent.click(favoriteButton);
        expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites');

        // Click again to remove from favorites
        await userEvent.click(favoriteButton);
        expect(favoriteButton).toHaveAttribute('aria-label', 'Add to favorites');
    });
});
