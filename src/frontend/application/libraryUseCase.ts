import {BookRepository} from "../domain/bookRepository";
import {
    Book,
    createBook,
    ensureThatBookIsNotRepeated,
    toggleCompleted,
    updatePicture,
    updateTitle
} from "../domain/book";

export const libraryUseCase = (bookRepository: BookRepository) => {
    const getAllBooks = async () => await bookRepository.getAll();

    const addBook = async (books: Book[], title: string, pictureUrl: string) => {
        const aBook = createBook(title, pictureUrl);
        ensureThatBookIsNotRepeated(aBook, books);
        await bookRepository.add(aBook)
        return aBook;
    };

    const updateBook = async (books: Book[], pictureUrl: string, book: Book, title: string) => {
        const updatedBook = updatePicture(updateTitle(book, title), pictureUrl);
        ensureThatBookIsNotRepeated(updatedBook, books);
        await bookRepository.update(updatedBook)
        return updatedBook;
    };

    const removeBook = async (book: Book) => {
        await bookRepository.remove(book)
    };

    const toggleToRead = async (book: Book) => {
        const updatedBook = toggleCompleted(book);
        await bookRepository.update(updatedBook)
        return updatedBook;
    };

    return {
        getAllBooks,
        addBook,
        updateBook,
        removeBook,
        toggleToRead,
    }
}
