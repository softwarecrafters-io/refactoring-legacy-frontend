import * as React from "react";
import {v4 as uuid} from 'uuid';
import {BookComponent} from "./bookComponent";
import {Book, createBook, updatePicture, updateTitle} from "./domain/book";

type FilterKind = 'all' | 'completed' | 'incomplete';

function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function filterBooks(books: Book[], filter: FilterKind) {
    const filteredBooks = [];
    books.forEach(book => {
        if (
            filter === 'all' ||
            (filter === 'completed' && book.completed) ||
            (filter === 'incomplete' && !book.completed)
        ) {
            filteredBooks.push(book);
        }
    });
    return filteredBooks;
}

export class LibraryApp extends React.Component {
    bookList: Book[] = [];
    newBookTitle = '';
    newBookPictureUrl = '';
    numberOfBooks = 0;
    currentFilter: FilterKind = 'all';

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        fetch('http://localhost:3000/api/')
            .then(response => response.json())
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
            fetch('http://localhost:3000/api/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(aBook),
            })
                .then(response => response.json())
                .then(data => {
                    this.bookList.push(data);
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
            fetch(`http://localhost:3000/api/${updatedBook.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedBook),
            })
                .then(response => response.json())
                .then(data => {
                    this.bookList[index] = data;
                    this.forceUpdate();
                });
        }
        catch (e) {
            alert(e.message);
        }
    });

    delete = (index:number) => {
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, { method: 'DELETE' })
            .then(() => {
                if (this.bookList[index].completed) {
                    this.numberOfBooks--;
                }
                this.bookList.splice(index, 1);
                this.forceUpdate();
            })
    };

    toggleComplete = (index:number) => {
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !this.bookList[index].completed }),
        })
            .then(response => response.json())
            .then(data => {
                this.bookList[index] = data;
                this.bookList[index].completed ? this.numberOfBooks++ : this.numberOfBooks--;
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

