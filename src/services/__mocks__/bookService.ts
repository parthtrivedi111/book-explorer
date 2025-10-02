import { vi } from 'vitest';
import type { Book, SearchParams } from '../../types/book';

// Mock book data for testing
const mockBooks: Book[] = [
    {
        id: 'book1',
        volumeInfo: {
            title: 'JavaScript: The Good Parts',
            authors: ['Douglas Crockford'],
            description: 'Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined.',
            publishedDate: '2008-05-01',
            publisher: 'O\'Reilly Media',
            categories: ['Computers', 'Programming', 'JavaScript'],
            imageLinks: {
                thumbnail: 'http://books.google.com/books/content?id=PXa2bby0oQ0C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
            }
        }
    },
    {
        id: 'book2',
        volumeInfo: {
            title: 'Eloquent JavaScript',
            authors: ['Marijn Haverbeke'],
            description: 'JavaScript lies at the heart of almost every modern web application, from social apps like Twitter to browser-based game frameworks like Phaser and Babylon.',
            publishedDate: '2018-12-04',
            publisher: 'No Starch Press',
            categories: ['Computers', 'Web Programming', 'JavaScript'],
            imageLinks: {
                thumbnail: 'http://books.google.com/books/content?id=p1v6DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
            }
        }
    },
    {
        id: 'book3',
        volumeInfo: {
            title: 'Learning React',
            authors: ['Alex Banks', 'Eve Porcello'],
            description: 'If you want to learn how to build efficient React applications, this is your book.',
            publishedDate: '2017-04-27',
            publisher: 'O\'Reilly Media',
            categories: ['Computers', 'Web Development', 'React'],
            imageLinks: {
                thumbnail: 'http://books.google.com/books/content?id=iYk6DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api'
            }
        }
    }
];

// Mock functions
export const searchBooks = vi.fn(async (params: SearchParams): Promise<Book[]> => {
    const { title, author, keyword } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // If no search parameters, throw error (simulating the real function's behavior)
    if (!title && !author && !keyword) {
        throw new Error('At least one search parameter is required');
    }

    // Simple filtering for tests
    return mockBooks.filter(book => {
        const matchesTitle = title ? book.volumeInfo.title.toLowerCase().includes(title.toLowerCase()) : true;
        const matchesAuthor = author && book.volumeInfo.authors ?
            book.volumeInfo.authors.some(a => a.toLowerCase().includes(author.toLowerCase())) :
            true;
        const matchesKeyword = keyword ?
            (book.volumeInfo.description?.toLowerCase().includes(keyword.toLowerCase()) ||
                book.volumeInfo.categories?.some(c => c.toLowerCase().includes(keyword.toLowerCase()))) :
            true;

        return matchesTitle && matchesAuthor && matchesKeyword;
    });
});

export const getBookById = vi.fn(async (id: string): Promise<Book | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const book = mockBooks.find(book => book.id === id);
    return book || null;
});
