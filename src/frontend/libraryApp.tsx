import * as React from "react";
import {IonIcon} from '@ionic/react';
import {checkmark, createOutline, trash} from 'ionicons/icons';
import {v4 as uuid} from 'uuid';

class Book{
    constructor(
        readonly id: string,
        readonly title: string,
        readonly pictureUrl: string,
        public completed = false)
    {}
}

type FilterKind = 'all' | 'completed' | 'incomplete';

export class LibraryApp extends React.Component {
    bookList: Book[] = [];
    newBookTitle = '';
    updatedBookTitle = '';
    newBookPictureUrl = '';
    updatedBooKPictureUrl = '';
    numberOfBooks = 0;
    currentFilter: FilterKind = 'all';
    isEditing:boolean[] = [];

    constructor(props) {
        super(props);
        this.initialize();
    }

    private initialize() {
        fetch('http://localhost:3000/api/')
            .then(response => response.json())
            .then(data => {
                this.bookList = data;
                for (let i = 0; i < this.bookList.length; i++) {
                    this.isEditing.push(false);
                }
                this.forceUpdate();
            })
            .catch(error => console.log(error));
    }

    add() {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const forbidden = ['prohibited', 'forbidden', 'banned'];
        let temp = false;
        try {
            new URL(this.newBookPictureUrl);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.newBookTitle.length < min || this.newBookTitle.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.newBookTitle)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            const words = this.newBookTitle.split(/\s+/);
            let foundForbiddenWord = false;
            for (let word of words) {
                if (forbidden.includes(word)) {
                    alert(`Error: The title cannot include the prohibited word "${word}"`);
                    foundForbiddenWord = true;
                    break;
                }
            }

            if (!foundForbiddenWord) {
                // Validación de texto repetido
                let isRepeated = false;
                for (let i = 0; i < this.bookList.length; i++) {
                    if (this.bookList[i].title === this.newBookTitle) {
                        isRepeated = true;
                        break;
                    }
                }

                if (isRepeated) {
                    alert('Error: The title is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, agregar el "libro"
                    fetch('http://localhost:3000/api/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({id:uuid(), title: this.newBookTitle, pictureUrl: this.newBookPictureUrl, completed: false }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.bookList.push(data);
                            this.newBookTitle = '';
                            this.newBookPictureUrl = '';
                            this.forceUpdate();
                        });
                }
            }
        }
    }

    update = index => {
        const min = 3; // Longitud mínima del texto
        const max = 100; // Longitud máxima del texto
        const words = ['prohibited', 'forbidden', 'banned'];
        let temp = false;
        try {
            new URL(this.updatedBooKPictureUrl);
            temp = true;
        }
        catch (e) {
            temp = false;
        }
        if (!temp) {
            alert('Error: The cover url is not valid');
        }
        // Validación de longitud mínima y máxima
        else if (this.updatedBookTitle.length < min || this.updatedBookTitle.length > max) {
            alert(`Error: The title must be between ${min} and ${max} characters long.`);
        } else if (/[^a-zA-Z0-9\s]/.test(this.updatedBookTitle)) {
            // Validación de caracteres especiales
            alert('Error: The title can only contain letters, numbers, and spaces.');
        } else {
            // Validación de palabras prohibidas
            let temp1 = false;
            for (let word of this.updatedBookTitle.split(/\s+/)) {
                if (words.includes(word)) {
                    alert(`Error: The title cannot include the prohibited word "${word}"`);
                    temp1 = true;
                    break;
                }
            }

            if (!temp1) {
                // Validación de texto repetido (excluyendo el índice actual)
                let temp2 = false;
                for (let i = 0; i < this.bookList.length; i++) {
                    if (i !== index && this.bookList[i].title === this.updatedBookTitle) {
                        temp2 = true;
                        break;
                    }
                }

                if (temp2) {
                    alert('Error: The title is already in the collection.');
                } else {
                    // Si pasa todas las validaciones, actualizar el libro
                    fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: this.updatedBookTitle, pictureUrl:this.updatedBooKPictureUrl, completed: this.bookList[index].completed }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            this.bookList[index] = data;
                            this.close(index);
                            this.forceUpdate();
                        });
                }
            }
        }
    };

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
        this.bookList[index].completed = !this.bookList[index].completed;
        fetch(`http://localhost:3000/api/${this.bookList[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: this.bookList[index].completed }),
        })
            .then(response => response.json())
            .then(data => {
                // this.collection[index] = data;
                this.bookList[index].completed ? this.numberOfBooks++ : this.numberOfBooks--;
                this.forceUpdate();
            })
    };


    setFilter(filter) {
        this.currentFilter = filter;
        this.forceUpdate();
    }

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

    edit = (index:number, text:string, url:string) => {
        this.updatedBookTitle = text;
        this.updatedBooKPictureUrl = url
        this.isEditing[index] = true;
        this.forceUpdate();
    };

    close = index => {
        this.isEditing[index] = false;
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

    onUpdatedTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.updatedBookTitle = event.target.value;
        this.forceUpdate();
    };

    onUpdatedPictureUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.updatedBooKPictureUrl = event.target.value;
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
                    onClick={this.add.bind(this)}>
                    Add Book
                </button>
                <h2>Books Read: {this.numberOfBooks}</h2>
                <div>
                    <button data-test-id={"allFilterButton"} className="library-button all-filter" onClick={this.setFilter.bind(this, 'all')}>All</button>
                    <button data-test-id={"readFilterButton"} className="library-button completed-filter" onClick={this.setFilter.bind(this, 'completed')}>Read</button>
                    <button data-test-id={"unreadFilterButton"} className="library-button incomplete-filter" onClick={this.setFilter.bind(this, 'incomplete')}>Unread</button>
                </div>
                <ul className="book-list" data-test-id={"bookList"}>
                    {books.map((b, index) =>
                        <BookComponent
                            book={b}
                            index={index}
                            isEditing={this.isEditing[index]}
                            onUpdatedTitleChange={this.onUpdatedTitleChange}
                            onUpdatedPictureUrlChange={this.onUpdatedPictureUrlChange}
                            toggleComplete={this.toggleComplete}
                            edit={this.edit}
                            deleteBook={this.delete}
                            update={this.update}
                            close={this.close}
                        />)}
                </ul>
            </div>
        );
    }
}

function BookComponent(props: {
    book: Book,
    index: number,
    isEditing: boolean,
    onUpdatedTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onUpdatedPictureUrlChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    toggleComplete: (index: number) => void,
    edit: (index: number, text: string, url: string) => void,
    deleteBook: (index: number) => void,
    update: (index: number) => void,
    close: (index: number) => void
}) {
    return <li className="book" data-test-id={"bookElement"}>
        {
            props.isEditing
                ? <div>
                    <input
                        data-test-id={"editTitleInput"}
                        className="book-edit-input"
                        defaultValue={props.book.title} // Asumiendo que inputData se usa para la edición
                        onChange={props.onUpdatedTitleChange}
                    />
                    <input
                        data-test-id={"editCoverInput"}
                        className="book-edit-input"
                        defaultValue={props.book.pictureUrl} //
                        onChange={props.onUpdatedPictureUrlChange}
                    />
                </div>
                : <div className={"book-item"}>
                    <img src={props.book.pictureUrl} alt={props.book.title} height={160} width={130} className="book-cover"/>
                    <div>

                        <p className="title">
                            {props.book.title} {props.book.completed &&
                            <IonIcon
                                data-test-id="markAsReadIcon"
                                className={"complete-icon"} icon={checkmark}></IonIcon>}
                        </p>
                        {!props.isEditing &&
                            <button className="book-button"
                                    data-test-id="markAsReadButton"
                                    onClick={()=> props.toggleComplete(props.index)}>
                                {props.book.completed ? 'Mark as Unread' : 'Mark as Read'}
                            </button>}
                        {!props.isEditing &&
                            <button className="book-button"
                                    data-test-id="editButton"
                                    onClick={() => props.edit(props.index, props.book.title, props.book.pictureUrl)}><IonIcon
                                icon={createOutline}/>
                            </button>
                        }
                        {!props.isEditing &&
                            <button className="book-button book-delete-button"
                                    data-test-id="deleteButton"
                                    onClick={()=> props.deleteBook(props.index)}>
                                <IonIcon icon={trash}/>
                            </button>}
                    </div>
                </div>
        }

        {props.isEditing &&
            <div>
                <button className="library-button book-update-button"
                        data-test-id="updateButton"
                        onClick={()=> props.update(props.index)}>
                    Save
                </button>
                <button className="library-button book-update-button"
                        onClick={()=> props.close(props.index)}>
                    Cancel
                </button>
            </div>

        }
    </li>;
}
