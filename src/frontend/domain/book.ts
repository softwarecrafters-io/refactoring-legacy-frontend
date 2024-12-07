import {v4 as uuid} from "uuid";

export type Book = {
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    readonly completed: boolean
}

export function createBook(title: string, picture: string) {
    return {
        id: uuid(),
        title: title,
        pictureUrl: picture,
        completed: false
    }
}
