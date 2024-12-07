import {v4 as uuid} from "uuid";

export type Book = {
    readonly id: string,
    readonly title: string,
    readonly pictureUrl: string,
    readonly completed: boolean
}

export function createBook(title: string, picture: string) {
    if(!isValidUrl(picture)){
        throw new Error('Error: The cover url is not valid');
    }
    ensureThatHaveValidLength(title);
    ensureThatOnlyContainsAlphanumeric(title);
    ensureThatNotContainsForbiddenWords(title);
    return {
        id: uuid(),
        title: title,
        pictureUrl: picture,
        completed: false
    }
}

function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function ensureThatHaveValidLength(title: string) {
    if (title.length < 3 || title.length > 100) {
        throw new Error(`Error: The title must be between 3 and 100 characters long.`);
    }
}

function ensureThatOnlyContainsAlphanumeric(title: string) {
    if (/[^a-zA-Z0-9\s]/.test(title)) {
        throw new Error('Error: The title can only contain letters, numbers, and spaces.');
    }
}

function ensureThatNotContainsForbiddenWords(title: string) {
    const forbiddenWords = ['prohibited', 'forbidden', 'banned'];
    const words = title.split(/\s+/);
    let foundForbiddenWord = words.find(word => forbiddenWords.includes(word))
    if (foundForbiddenWord) {
        throw new Error(`Error: The title cannot include the prohibited word "${foundForbiddenWord}"`);
    }
}
