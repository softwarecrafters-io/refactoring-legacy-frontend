import * as React from "react";
import {IonIcon} from "@ionic/react";
import {checkmark, createOutline, trash} from "ionicons/icons";
import {Book} from "./libraryApp";

export function BookComponent(props: {
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
                    <img src={props.book.pictureUrl} alt={props.book.title} height={160} width={130}
                         className="book-cover"/>
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
                                    onClick={() => props.toggleComplete(props.index)}>
                                {props.book.completed ? 'Mark as Unread' : 'Mark as Read'}
                            </button>}
                        {!props.isEditing &&
                            <button className="book-button"
                                    data-test-id="editButton"
                                    onClick={() => props.edit(props.index, props.book.title, props.book.pictureUrl)}>
                                <IonIcon
                                    icon={createOutline}/>
                            </button>
                        }
                        {!props.isEditing &&
                            <button className="book-button book-delete-button"
                                    data-test-id="deleteButton"
                                    onClick={() => props.deleteBook(props.index)}>
                                <IonIcon icon={trash}/>
                            </button>}
                    </div>
                </div>
        }

        {props.isEditing &&
            <div>
                <button className="library-button book-update-button"
                        data-test-id="updateButton"
                        onClick={() => props.update(props.index)}>
                    Save
                </button>
                <button className="library-button book-update-button"
                        onClick={() => props.close(props.index)}>
                    Cancel
                </button>
            </div>

        }
    </li>;
}
