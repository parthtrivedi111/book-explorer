import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock the lazy-loaded components
vi.mock('react', async () => {
    const actual = await vi.importActual<typeof import('react')>('react');
    return {
        ...actual,
        lazy: (factory: () => Promise<{ default: React.ComponentType<unknown> }>) => {
            const Component = (props: Record<string, unknown>) => {
                const [C, setC] = actual.useState<React.ComponentType<unknown> | null>(null);

                actual.useEffect(() => {
                    factory().then((module) => {
                        setC(() => module.default);
                    });
                }, []);

                return C ? <C {...props} /> : null;
            };
            return Component;
        }
    };
});

// Mock the page components
vi.mock('../pages/HomePage', () => ({
    default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../pages/BookDetailsPage', () => ({
    default: () => <div data-testid="book-details-page">Book Details Page</div>
}));

vi.mock('../pages/FavoritesPage', () => ({
    default: () => <div data-testid="favorites-page">Favorites Page</div>
}));

// Tests
describe('App Routing', () => {
    it('renders HomePage at the root route', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                {/* <AppWithoutRouter /> */}
                <App />
            </MemoryRouter>
        );

        // Wait for lazy loading
        expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    });

    it('renders BookDetailsPage at /book/:id route', async () => {
        render(
            <MemoryRouter initialEntries={['/book/abc123']}>
                {/* <AppWithoutRouter /> */}
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByTestId('book-details-page')).toBeInTheDocument();
    });

    it('renders FavoritesPage at /favorites route', async () => {
        render(
            <MemoryRouter initialEntries={['/favorites']}>
                {/* <AppWithoutRouter /> */}
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByTestId('favorites-page')).toBeInTheDocument();
    });

    it('redirects to HomePage for unknown routes', async () => {
        render(
            <MemoryRouter initialEntries={['/unknown-route']}>
                {/* <AppWithoutRouter /> */}
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByTestId('home-page')).toBeInTheDocument();
    });
});