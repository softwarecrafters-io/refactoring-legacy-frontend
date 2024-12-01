import { Request, Response } from 'express';
import {BookView} from "../views/BookView";
import {BookDTO} from "../views/BookDTO";
import {Library} from "../models/Library";
import {Book} from "../models/Book";

export class LibraryController {
    private library: Library = new Library();

    private getAllBooks(): Book[] {
        return this.library.books;
    }

    private addBook(book: Book): void {
        this.library.books.push(book);
    }

    private deleteBook(id: string): void {
        this.library.books = this.library.books.filter(book => book.id !== id);
    }

    private findBookById(id: string): Book | undefined {
        return this.library.books.find(book => book.id === id);
    }

    private updateBook(id: string, bookFields: Partial<Book>): void {
        const bookIndex = this.library.books.findIndex(book => book.id === id);
        if (bookIndex === -1) {
            throw new Error('Book not found');
        }

        this.library.books[bookIndex] = {
            ...this.library.books[bookIndex],
            ...bookFields
        };
    }

    getAll = (req: Request, res: Response): void => {
        const books = this.getAllBooks();
        res.json(BookView.toDTOList(books));
    };

    create = (req: Request, res: Response): void => {
        try {
            const bookData = req.body as BookDTO;
            const book = BookView.toModel(bookData);
            this.addBook(book);
            res.status(201).json(BookView.toDTO(book));
        } catch (error) {
            res.status(400).json(BookView.errorResponse('Invalid book data'));
        }
    };

    delete = (req: Request, res: Response): void => {
        this.deleteBook(req.params.id);
        res.status(204).end();
    };

    update = (req: Request, res: Response): void => {
        try {
            const id = req.params.id;
            const bookData = req.body as Partial<BookDTO>;
            this.updateBook(id, bookData);

            const updatedBook = this.findBookById(id);
            if (updatedBook) {
                res.json(BookView.toDTO(updatedBook));
            }
        } catch (error) {
            res.status(404).json(BookView.errorResponse('Book not found'));
        }
    };
}
