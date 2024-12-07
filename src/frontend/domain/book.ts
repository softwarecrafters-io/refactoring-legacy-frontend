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
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word))
    if(foundForbiddenWord){
        throw new Error(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
    }
    return {
        id: uuid(),
        title: title,
        pictureUrl: picture,
        completed: false
    }
}
