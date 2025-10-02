import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from '../components/SearchForm';

describe('SearchForm', () => {
    const mockOnSearch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

        expect(screen.getByPlaceholderText(/search by book title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/author name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/genre or keyword/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('updates input values on change', async () => {
        render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

        const titleInput = screen.getByPlaceholderText(/search by book title/i);
        const authorInput = screen.getByPlaceholderText(/author name/i);
        const keywordInput = screen.getByPlaceholderText(/genre or keyword/i);

        await userEvent.type(titleInput, 'React');
        await userEvent.type(authorInput, 'Smith');
        await userEvent.type(keywordInput, 'Programming');

        expect(titleInput).toHaveValue('React');
        expect(authorInput).toHaveValue('Smith');
        expect(keywordInput).toHaveValue('Programming');
    });

    it('shows error message when no fields are filled', async () => {
        render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

        const searchButton = screen.getByRole('button', { name: /search/i });
        await userEvent.click(searchButton);

        expect(screen.getByText(/please enter at least one search term/i)).toBeInTheDocument();
        expect(mockOnSearch).not.toHaveBeenCalled();
    });

    it('calls onSearch with form data when submitted with valid data', async () => {
        render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

        const titleInput = screen.getByPlaceholderText(/search by book title/i);
        await userEvent.type(titleInput, 'JavaScript');

        const searchButton = screen.getByRole('button', { name: /search/i });
        await userEvent.click(searchButton);

        expect(mockOnSearch).toHaveBeenCalledWith({
            title: 'JavaScript',
            author: '',
            keyword: ''
        });
    });

    it('disables search button when isLoading is true', () => {
        render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);

        const searchButton = screen.getByRole('button');
        expect(searchButton).toBeDisabled();
        expect(searchButton).toHaveTextContent(/searching/i);
    });
});
