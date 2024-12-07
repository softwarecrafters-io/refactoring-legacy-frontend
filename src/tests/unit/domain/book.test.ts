import {createBook} from "../../../frontend/domain/book";

describe('The Book', ()=>{
    it('creates a book for a given valid title and picture', ()=>{
        const book = createBook('The Book', 'http://www.example.com/book.jpg');

        expect(book.title).toBe('The Book');
        expect(book.pictureUrl).toBe('http://www.example.com/book.jpg');
        expect(book.id).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/);
        expect(book.completed).toBe(false);
    });
});

