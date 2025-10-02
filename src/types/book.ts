export interface Book {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        description?: string;
        publishedDate?: string;
        publisher?: string;
        categories?: string[];
        imageLinks?: {
            smallThumbnail?: string;
            thumbnail?: string;
            small?: string;
            medium?: string;
            large?: string;
            extraLarge?: string;
        };
        pageCount?: number;
        language?: string;
        averageRating?: number;
        ratingsCount?: number;
        previewLink?: string;
        infoLink?: string;
    };
}

export interface SearchParams {
    title?: string;
    author?: string;
    keyword?: string;
    startIndex?: number;
    maxResults?: number;
}

export interface SearchResponse {
    books: Book[];
    totalItems: number;
}
