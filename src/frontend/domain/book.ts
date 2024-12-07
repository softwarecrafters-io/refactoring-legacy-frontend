import {v4 as uuid} from "uuid";

export type Book = {
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    readonly completed: boolean
}

export function createBook(title: string, picture: string) {
    if(title.length < 3 || title.length > 100){
        throw new Error(`Error: The title must be between 3 and 100 characters long.`);
    }
    if(/[^a-zA-Z0-9\s]/.test(title)){
        throw new Error('Error: The title can only contain letters, numbers, and spaces.');
    }
    return {
        id: uuid(),
        title: title,
        pictureUrl: picture,
        completed: false
    }
}
