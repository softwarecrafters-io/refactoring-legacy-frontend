import {BookDTO} from "./BookDTO";
import {Book} from "../models/Book";

export class BookView {
    static toDTO(book: Book): BookDTO {
        return {
            id: book.id,
            title: book.title,
            pictureUrl: book.pictureUrl,
            completed: book.completed
        };
    }

    static toDTOList(books: Book[]): BookDTO[] {
        return books.map(book => this.toDTO(book));
    }

    static toModel(dto: BookDTO): Book {
        return new Book(
            dto.id,
            dto.title,
            dto.pictureUrl,
            dto.completed
        );
    }

    static errorResponse(message: string) {
        return {
            error: message,
            timestamp: new Date().toISOString()
        };
    }
}
