import { useState, useEffect, type FormEvent } from 'react';
import type { SearchParams } from '../types/book';
import './SearchForm.css';

interface SearchFormProps {
    onSearch: (params: SearchParams) => void;
    isLoading: boolean;
    initialParams?: SearchParams | null;
}

const SearchForm = ({ onSearch, isLoading, initialParams }: SearchFormProps) => {
    const [formData, setFormData] = useState<SearchParams>({
        title: '',
        author: '',
        keyword: '',
    });
    const [errors, setErrors] = useState<string[]>([]);

    // Update form when initialParams are provided
    useEffect(() => {
        if (initialParams) {
            setFormData(initialParams);
        }
    }, [initialParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear errors when user starts typing
        if (errors.length) {
            setErrors([]);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: string[] = [];
        const { title, author, keyword } = formData;

        // Check if at least one field has a value
        if (!title && !author && !keyword) {
            newErrors.push('Please enter at least one search term');
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSearch(formData);
        }
    };

    return (
        <div className="search-form-container">
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="search-form-header">
                    <h2 className="search-title">Discover Books</h2>
                    <p className="search-subtitle">
                        Find your next favorite read in our extensive library
                    </p>
                </div>

                <div className="search-form-content">
                    <div className="search-input-wrapper">
                        <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="search-input"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Search by book title..."
                        />
                    </div>

                    <div className="search-filters">
                        <div className="filter-input-group">
                            <input
                                type="text"
                                id="author"
                                name="author"
                                className="filter-input"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Author name"
                            />
                        </div>

                        <div className="filter-input-group">
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                className="filter-input"
                                value={formData.keyword}
                                onChange={handleChange}
                                placeholder="Genre or keyword"
                            />
                        </div>

                        <button
                            type="submit"
                            className={`search-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Searching</span>
                                </>
                            ) : (
                                <span>Search Books</span>
                            )}
                        </button>
                    </div>
                </div>

                {errors.length > 0 && (
                    <div className="form-errors">
                        {errors.map((error, index) => (
                            <div key={index} className="error-message">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchForm;
