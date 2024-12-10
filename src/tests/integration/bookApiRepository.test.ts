import {createBook} from "../../frontend/domain/book";
import {Book} from "../../backend/models/Book";

type BookRepository = {
    getAll: () => Promise<Book[]>;
    add: (book: Book) => Promise<void>;
    remove: (book: Book) => Promise<void>;
}

function createBookApiRepository(baseUrl: string): BookRepository {
    const getAll = async () => {
        const response = await fetch(baseUrl);
        return await response.json() as Book[];
    }

    const add = async (book: Book) => {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(book),
        });
        return await response.json()
    }

    const remove = async (book: Book) => {
        await fetch(`${baseUrl}/${book.id}`, {
            method: 'DELETE'
        });
    }

    return{
        getAll,
        add,
        remove
    }
}

describe('The Book Api Repository', ()=>{
    it('gets all books', async ()=>{
        const baseUrl = 'http://localhost:3000/api';
        const bookApiRepository = createBookApiRepository(baseUrl);
        const aBook = createBook("My Book", "http://mybook.com/picture.jpg");
        await bookApiRepository.add(aBook);

        const books = await  bookApiRepository.getAll();

        expect(books).toEqual([aBook]);

        await bookApiRepository.remove(aBook);
    });
});
