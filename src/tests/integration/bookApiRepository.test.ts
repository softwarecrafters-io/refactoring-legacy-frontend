import {createBook, updateTitle} from "../../frontend/domain/book";
import {Book} from "../../backend/models/Book";

type BookRepository = {
    getAll: () => Promise<Book[]>;
    add: (book: Book) => Promise<void>;
    update: (book: Book) => Promise<void>;
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

    const update = async (book: Book) => {
        const response = await fetch(`${baseUrl}/${book.id}`, {
            method: 'PUT',
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
        update,
        remove
    }
}

describe('The Book Api Repository', ()=>{
    const baseUrl = 'http://localhost:3000/api';
    const bookApiRepository = createBookApiRepository(baseUrl);

    afterEach(async ()=>{
        const books = await bookApiRepository.getAll();
        for (const book of books) {
            await bookApiRepository.remove(book);
        }
    });

    it('gets all books', async ()=>{
        const aBook = createBook("My Book", "http://mybook.com/picture.jpg");
        await bookApiRepository.add(aBook);

        const books = await  bookApiRepository.getAll();

        expect(books).toEqual([aBook]);
    });

    it('adds a book', async ()=>{
        const aBook = createBook("My Book", "http://mybook.com/picture.jpg");

        await bookApiRepository.add(aBook);

        const books = await bookApiRepository.getAll();
        expect(books).toEqual([aBook]);
    });

    it('removes a book', async ()=>{
        const aBook = createBook("My Book", "http://mybook.com/picture.jpg");

        await bookApiRepository.add(aBook);
        await bookApiRepository.remove(aBook);

        const books = await bookApiRepository.getAll();
        expect(books).toEqual([]);
    });

    it('updates a book', async ()=>{
        const aBook = createBook("My Book", "http://mybook.com/picture.jpg");
        await bookApiRepository.add(aBook);

        const updatedBook = updateTitle(aBook, "My Updated Book");
        await bookApiRepository.update(updatedBook);

        const books = await bookApiRepository.getAll();
        expect(books).toEqual([updatedBook]);
    });
});
