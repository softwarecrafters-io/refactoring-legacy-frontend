import * as React from "react";
import {v4 as uuid} from 'uuid';
import {BookComponent} from "./bookComponent";

export type Book ={
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    readonly completed: boolean
}

type FilterKind = 'all' | 'completed' | 'incomplete';

function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
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
        const minTitleLength = 3;
        const maxTitleLength = 100;
        const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
        if (!isValidUrl(this.newBookPictureUrl)) {
            alert('Error: The cover url is not valid');
            return;
        }
        let hasValidLength = this.newBookTitle.length < minTitleLength || this.newBookTitle.length > maxTitleLength;
        if (hasValidLength) {
            alert(`Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
            return;
        }
        let isValidTitle = /[^a-zA-Z0-9\s]/.test(this.newBookTitle);
        if (isValidTitle) {
            alert('Error: The title can only contain letters, numbers, and spaces.');
            return;
        }
        const words = this.newBookTitle.split(/\s+/);
        let foundForbiddenWord = words.find(word => forbiddenWords.includes(word))
        if(foundForbiddenWord){
            alert(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
            return;
        }
        this.bookList.forEach(book => {
            if (book.title === this.newBookTitle) {
                alert('Error: The title is already in the collection.');
                return;
            }
        });
        fetch('http://localhost:3000/api/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: uuid(),
                title: this.newBookTitle,
                pictureUrl: this.newBookPictureUrl,
                completed: false
            }),
        })
            .then(response => response.json())
            .then(data => {
                this.bookList.push(data);
                this.newBookTitle = '';
                this.newBookPictureUrl = '';
                this.forceUpdate();
            });
    };

    update = ((index:number, book:Book, title:string, pictureUrl:string) => {
        const minTitleLength = 3;
        const maxTitleLength = 100;
        const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
        if (!isValidUrl(pictureUrl)) {
            alert('Error: The cover url is not valid');
            return;
        }
        let hasValidLength = title.length < minTitleLength || title.length > maxTitleLength;
        if (hasValidLength) {
            alert(`Error: The title must be between ${minTitleLength} and ${maxTitleLength} characters long.`);
            return;
        }
        let isValidTitle = /[^a-zA-Z0-9\s]/.test(title);
        if (isValidTitle) {
            alert('Error: The title can only contain letters, numbers, and spaces.');
            return;
        }
        // Validación de palabras prohibidas
        const words = title.split(/\s+/);
        const foundForbiddenWord = words.find(word => forbiddenWords.includes(word));
        if (foundForbiddenWord) {
            alert(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
            return;
        }
         // Validación de texto repetido (excluyendo el índice actual)
        this.bookList.forEach((book, i) => {
            if (i !== index && book.title === title) {
                alert('Error: The title is already in the collection.');
                return;
            }
        });
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title,
                pictureUrl: pictureUrl,
                completed: this.bookList[index].completed
            }),
        })
            .then(response => response.json())
            .then(data => {
                this.bookList[index] = data;
                this.forceUpdate();
            });
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

    getBooks() {
        const fBooks = [];
        for (let i = 0; i < this.bookList.length; i++) {
            if (
                this.currentFilter === 'all' ||
                (this.currentFilter === 'completed' && this.bookList[i].completed) ||
                (this.currentFilter === 'incomplete' && !this.bookList[i].completed)
            ) {
                fBooks.push(this.bookList[i]);
            }
        }
        return fBooks;
    }

    onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.newBookTitle = event.target.value;
        this.forceUpdate();
    };

    onPictureUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.newBookPictureUrl = event.target.value;
        this.forceUpdate();
    };

    render() {
        const books = this.getBooks();

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

