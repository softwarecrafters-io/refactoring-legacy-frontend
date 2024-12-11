import {BookRepository} from "../domain/bookRepository";
import {
    Book,
    createBook,
    ensureThatBookIsNotRepeated,
    toggleCompleted,
    updatePicture,
    updateTitle
} from "../domain/book";

export async function getAllBooks(bookRepository: BookRepository) {
    return await bookRepository.getAll();
}

export const addBook = async (bookRepository: BookRepository, books: Book[], title: string, pictureUrl: string) => {
    const aBook = createBook(title, pictureUrl);
    ensureThatBookIsNotRepeated(aBook, books);
    await bookRepository.add(aBook)
    return aBook;
};

export const updateBook = async (bookRepository: BookRepository, books: Book[], pictureUrl: string, book: Book, title: string) => {
    const updatedBook = updatePicture(updateTitle(book, title), pictureUrl);
    ensureThatBookIsNotRepeated(updatedBook, books);
    await bookRepository.update(updatedBook)
    return updatedBook;
};

export const removeBook = async (bookRepository: BookRepository, book: Book) => {
    await bookRepository.remove(book)
};

export const toggleToRead = async (bookRepository: BookRepository, book: Book) => {
    const updatedBook = toggleCompleted(book);
    await bookRepository.update(updatedBook)
    return updatedBook;
};

export const createLibraryUseCase = (bookRepository: BookRepository) => {
    const getAllBooks = async (bookRepository: BookRepository) => await bookRepository.getAll();

    const addBook = async (bookRepository: BookRepository, books: Book[], title: string, pictureUrl: string) => {
        const aBook = createBook(title, pictureUrl);
        ensureThatBookIsNotRepeated(aBook, books);
        await bookRepository.add(aBook)
        return aBook;
    };

    const updateBook = async (bookRepository: BookRepository, books: Book[], pictureUrl: string, book: Book, title: string) => {
        const updatedBook = updatePicture(updateTitle(book, title), pictureUrl);
        ensureThatBookIsNotRepeated(updatedBook, books);
        await bookRepository.update(updatedBook)
        return updatedBook;
    };

    const removeBook = async (bookRepository: BookRepository, book: Book) => {
        await bookRepository.remove(book)
    };

    const toggleToRead = async (bookRepository: BookRepository, book: Book) => {
        const updatedBook = toggleCompleted(book);
        await bookRepository.update(updatedBook)
        return updatedBook;
    };

    return {
        getAllBooks,
        addBook,
        updateBook,
        removeBook,
        toggleToRead
    }
}
