import * as React from "react";
import {BookComponent} from "./bookComponent";
import {Book, createBook, toggleCompleted, updatePicture, updateTitle} from "./domain/book";
import {filterBooks, FilterKind} from "./domain/services/FilterBook";
import {BookRepository} from "./domain/bookRepository";
import {createBookApiRepository} from "./infrastructure/bookApiRepository";

export class LibraryApp extends React.Component {
    bookList: Book[] = [];
    newBookTitle = '';
    newBookPictureUrl = '';
    numberOfBooks = 0;
    currentFilter: FilterKind = 'all';
    bookRepository: BookRepository = createBookApiRepository('http://localhost:3000/api');

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        this.bookRepository.getAll()
            .then(data => {
                this.bookList = data;
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    add = () => {
        try{
            const aBook = createBook(this.newBookTitle, this.newBookPictureUrl);
            this.bookList.forEach(book => {
                if (book.title === this.newBookTitle) {
                    alert('Error: The title is already in the collection.');
                    return;
                }
            });
            this.bookRepository.add(aBook)
                .then(_ => {
                    this.bookList.push(aBook);
                    this.newBookTitle = '';
                    this.newBookPictureUrl = '';
                    this.forceUpdate();
                });
        }
        catch (e) {
            alert(e.message);
        }
    };

    update = ((book:Book, title:string, pictureUrl:string) => {
        try{
            const updatedBook = updatePicture(updateTitle(book, title), pictureUrl);
            const index = this.bookList.findIndex(b => b.id === updatedBook.id);
            // Validación de texto repetido (excluyendo el índice actual)
            this.bookList.forEach((book, i) => {
                if (i !== index && book.title === title) {
                    alert('Error: The title is already in the collection.');
                    return;
                }
            });
            this.bookRepository.update(updatedBook)
                .then(_ => {
                    this.bookList[index] = updatedBook;
                    this.forceUpdate();
                });
        }
        catch (e) {
            alert(e.message);
        }
    });

    delete = (index:number) => {
        this.bookRepository.remove(this.bookList[index])
            .then(() => {
                if (this.bookList[index].completed) {
                    this.numberOfBooks--;
                }
                this.bookList.splice(index, 1);
                this.forceUpdate();
            })
    };

    toggleComplete = (index:number) => {
        const book = this.bookList[index];
        const updatedBook = toggleCompleted(book);
        this.bookRepository.update(updatedBook)
            .then(_ => {
                this.bookList[index] = updatedBook;
                book.completed ? this.numberOfBooks++ : this.numberOfBooks--;
                this.forceUpdate();
            })
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

