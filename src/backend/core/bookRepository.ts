import {Book} from './book';

export interface BookRepository {
    getAll(): Book[];
    add(todo: Book): void;
    delete(id: string): void;
    update(id: string, bookFields: Partial<Book>): void;
}

export class InMemoryBookRepository implements BookRepository {
    constructor(private books: Book[] = []) {}

    getAll(): Book[] {
        return this.books;
    }

    add(todo: Book): void {
        this.books.push(todo);
    }

    delete(id: string): void {
        this.books = this.books.filter(todo => todo.id !== id);
    }

    update(id: string, bookFields: Partial<Book>): void {
        const index = this.books.findIndex(todo => todo.id === id);
        if (index === -1) {
            throw new Error('Book not found');
        }
        this.books[index] = {...this.books[index], ...bookFields};
    }
}
