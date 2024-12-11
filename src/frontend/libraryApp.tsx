import * as React from "react";
import {BookComponent} from "./bookComponent";
import {Book} from "./domain/book";
import {filterBooks, FilterKind} from "./domain/services/FilterBook";
import {LibraryUseCase} from "./application/libraryUseCase";

type LibraryAppState = {
    bookList: Book[],
    newBookTitle: string,
    newBookPictureUrl: string,
    numberOfBooks: number,
    currentFilter: FilterKind,
}

export class LibraryApp extends React.Component<{useCase:LibraryUseCase}, LibraryAppState> {
    bookList: Book[] = [];
    newBookTitle = '';
    newBookPictureUrl = '';
    numberOfBooks = 0;
    currentFilter: FilterKind = 'all';

    constructor(props) {
        super(props);
        this.initialize();
    }

    private async initialize() {
        const books = await this.props.useCase.getAllBooks();
        this.onGetBooks(books);
    }

    private onGetBooks = (data: Book[]) => {
        this.bookList = data;
        this.forceUpdate();
    };

    add = async () => {
        try{
            const aBook = await this.props.useCase.addBook(this.bookList, this.newBookTitle, this.newBookPictureUrl);
            this.onAddBook(aBook);
        }
        catch (e) {
            alert(e.message);
        }
    };

    private onAddBook = (aBook: Book) => {
        this.bookList.push(aBook);
        this.newBookTitle = '';
        this.newBookPictureUrl = '';
        this.forceUpdate();
    };

    update = async (book:Book, title:string, pictureUrl:string) => {
        try{
            const updatedBook = await this.props.useCase.updateBook(this.bookList, pictureUrl, book, title);
            this.onUpdateBook(updatedBook);
        }
        catch (e) {
            alert(e.message);
        }
    };

    private onUpdateBook = (updatedBook: Book) => {
        const index = this.bookList.findIndex(b => b.id === updatedBook.id);
        this.bookList[index] = updatedBook;
        this.forceUpdate();
    };

    delete = async (book:Book) => {
        await this.props.useCase.removeBook(book);
        this.onDeleteBook(book);
    };

    private onDeleteBook = (book:Book) => {
        const index = this.bookList.findIndex(b => b.id === book.id);
        if (this.bookList[index].completed) {
            this.numberOfBooks--;
        }
        this.bookList.splice(index, 1);
        this.forceUpdate();
    };

    toggleComplete = async (book:Book) => {
        const updatedBook = await this.props.useCase.toggleToRead(book);
        this.onToggleBook(updatedBook)
    };

    private onToggleBook = (updatedBook: Book) => {
        const index = this.bookList.findIndex(b => b.id === updatedBook.id);
        this.bookList[index] = updatedBook;
        updatedBook.completed ? this.numberOfBooks++ : this.numberOfBooks--;
        this.forceUpdate();
    };

    setFilter = (filter: FilterKind) => {
        this.currentFilter = filter;
        this.forceUpdate();
    };

    onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.newBookTitle = event.target.value;
        this.forceUpdate();
    };

    onPictureUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.newBookPictureUrl = event.target.value;
        this.forceUpdate();
    };

    render() {
        const books = filterBooks(this.bookList, this.currentFilter);

        return (
            <div className="app-container">
                <h1 data-test-id={"titleHeader"}>LIBRARY APP</h1>
                <div>
                    <input
                        data-test-id={"titleInput"}
                        className="library-input"
                        value={this.newBookTitle}
                        placeholder={'Book Title'}
                        onChange={this.onTitleChange}
                    />
                    <input
                        data-test-id={"coverInput"}
                        className="library-input"
                        value={this.newBookPictureUrl}
                        placeholder={'Cover Url'}
                        onChange={this.onPictureUrlChange}
                    />
                </div>
                <button
                    data-test-id={"addButton"}
                    className="library-button add-book-button"
                    onClick={this.add}>
                    Add Book
                </button>
                <h2>Books Read: {this.numberOfBooks}</h2>
                <div>
                    <button data-test-id={"allFilterButton"} className="library-button all-filter" onClick={()=>this.setFilter('all')}>All</button>
                    <button data-test-id={"readFilterButton"} className="library-button completed-filter" onClick={()=>this.setFilter('completed')}>Read</button>
                    <button data-test-id={"unreadFilterButton"} className="library-button incomplete-filter" onClick={()=>this.setFilter('incomplete')}>Unread</button>
                </div>
                <ul className="book-list" data-test-id={"bookList"}>
                    {books.map((b, index) =>
                        <BookComponent
                            book={b}
                            index={index}
                            toggleComplete={this.toggleComplete}
                            deleteBook={this.delete}
                            update={this.update}
                        />)}
                </ul>
            </div>
        );
    }
}

