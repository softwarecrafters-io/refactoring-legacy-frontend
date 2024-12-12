import * as React from "react";
import {BookComponent} from "./bookComponent";
import {Book} from "../../../domain/book";
import {filterBooks, FilterKind} from "../../../domain/services/FilterBook";
import {LibraryUseCase} from "../../../application/libraryUseCase";
import {useEffect} from "react";

type LibraryAppState = {
    bookList: Book[],
    newBookTitle: string,
    newBookPictureUrl: string,
    numberOfBooks: number,
    currentFilter: FilterKind,
}

const initialState = (): LibraryAppState => ({
    bookList: [],
    newBookTitle: '',
    newBookPictureUrl: '',
    numberOfBooks: 0,
    currentFilter: 'all',
});

function useLibraryApp(useCase: LibraryUseCase) {
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
        if (state.bookList[index].completed) {
            state.numberOfBooks--;
        }
        state.bookList.splice(index, 1);
        setState(state => ({...state, bookList: [...state.bookList]}));
    }

    const toggleComplete = async (book: Book) => {
        const updatedBook = await useCase.toggleToRead(book);
        const index = state.bookList.findIndex(b => b.id === updatedBook.id);
        state.bookList[index] = updatedBook;
        updatedBook.completed ? state.numberOfBooks++ : state.numberOfBooks--;
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
        numberOfBooks: state.numberOfBooks,
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

export const LibraryApp = ({useCase}: {useCase: LibraryUseCase}) => {
    const hook = useLibraryApp(useCase);

    useEffect(() => {
        hook.initialize();
    }, []);

    return(
        <div className="app-container">
            <h1 data-test-id={"titleHeader"}>LIBRARY APP</h1>
            <div>
                <input
                    data-test-id={"titleInput"}
                    className="library-input"
                    value={hook.newBookTitle}
                    placeholder={'Book Title'}
                    onChange={hook.onTitleChange}
                />
                <input
                    data-test-id={"coverInput"}
                    className="library-input"
                    value={hook.newBookPictureUrl}
                    placeholder={'Cover Url'}
                    onChange={hook.onPictureUrlChange}
                />
            </div>
            <button
                data-test-id={"addButton"}
                className="library-button add-book-button"
                onClick={hook.add}>
                Add Book
            </button>
            <h2>Books Read: {hook.numberOfBooks}</h2>
            <div>
                <button data-test-id={"allFilterButton"} className="library-button all-filter" onClick={()=>hook.setFilter('all')}>All</button>
                <button data-test-id={"readFilterButton"} className="library-button completed-filter" onClick={()=>hook.setFilter('completed')}>Read</button>
                <button data-test-id={"unreadFilterButton"} className="library-button incomplete-filter" onClick={()=>hook.setFilter('incomplete')}>Unread</button>
            </div>
            <ul className="book-list" data-test-id={"bookList"}>
                {hook.books.map((b, index) =>
                    <BookComponent
                        book={b}
                        index={index}
                        toggleComplete={hook.toggleComplete}
                        deleteBook={hook.deleteBook}
                        update={hook.update}
                    />)}
            </ul>
        </div>
    );
}


