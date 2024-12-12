import {Book, calculateNumberOfBooks} from "../../../domain/book";
import {filterBooks, FilterKind} from "../../../domain/services/FilterBook";
import {LibraryUseCase} from "../../../application/libraryUseCase";
import * as React from "react";

type LibraryAppState = {
    readonly bookList: Book[],
    readonly newBookTitle: string,
    readonly newBookPictureUrl: string,
    readonly currentFilter: FilterKind,
}

const initialState = (): LibraryAppState => ({
    bookList: [],
    newBookTitle: '',
    newBookPictureUrl: '',
    currentFilter: 'all',
});

export function useLibraryApp(useCase: LibraryUseCase) {
    const [state, setState] = React.useState(initialState());

    const initialize = async () => {
        const bookList = await useCase.getAllBooks();
        setState(state => ({...state, bookList}));
    }

    const add = async () => {
        try {
            const aBook = await useCase.addBook(state.bookList, state.newBookTitle, state.newBookPictureUrl);
            setState(state => ({
                ...state,
                bookList: [...state.bookList, aBook],
                newBookTitle: '',
                newBookPictureUrl: ''
            }));
        } catch (e) {
            alert(e.message);
        }
    };

    const update = async (book: Book, title: string, pictureUrl: string) => {
        try {
            const updatedBook = await useCase.updateBook(state.bookList, pictureUrl, book, title);
            const index = state.bookList.findIndex(b => b.id === updatedBook.id);
            state.bookList[index] = updatedBook;
            setState(state => ({...state, bookList: [...state.bookList]}));
        } catch (e) {
            alert(e.message);
        }
    }

    const deleteBook = async (book: Book) => {
        await useCase.removeBook(book);
        const index = state.bookList.findIndex(b => b.id === book.id);
        state.bookList.splice(index, 1);
        setState(state => ({...state, bookList: [...state.bookList]}));
    }

    const toggleComplete = async (book: Book) => {
        const updatedBook = await useCase.toggleToRead(book);
        const index = state.bookList.findIndex(b => b.id === updatedBook.id);
        state.bookList[index] = updatedBook;
        setState(state => ({...state, bookList: [...state.bookList]}));
    }

    const setFilter = (filter: FilterKind) => {
        setState(state => ({...state, currentFilter: filter}));
    }

    const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(state => ({...state, newBookTitle: event.target.value}));
    }

    const onPictureUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState(state => ({...state, newBookPictureUrl: event.target.value}));
    }

    const books = filterBooks(state.bookList, state.currentFilter);
    return {
        newBookTitle: state.newBookTitle,
        newBookPictureUrl: state.newBookPictureUrl,
        numberOfBooks: calculateNumberOfBooks(state.bookList),
        initialize,
        add,
        update,
        deleteBook,
        toggleComplete,
        setFilter,
        onTitleChange,
        onPictureUrlChange,
        books
    };
}
