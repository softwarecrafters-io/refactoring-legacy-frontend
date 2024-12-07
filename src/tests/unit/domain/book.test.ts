import {createBook} from "../../../frontend/domain/book";

describe('The Book', ()=>{
    it('creates a book for a given valid title and picture', ()=>{
        const book = createBook('The Book', 'http://www.example.com/book.jpg');

        expect(book.title).toBe('The Book');
        expect(book.pictureUrl).toBe('http://www.example.com/book.jpg');
        expect(book.id).toMatch(/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89aAbB][a-f\d]{3}-[a-f\d]{12}$/);
        expect(book.completed).toBe(false);
    });

    it('does not allow to create a book when a title length is less than the minimum', ()=>{
       const title = 'a'.repeat(2);
       const picture = 'http://www.example.com/book.jpg';

       expect(() => createBook(title, picture))
           .toThrowError('Error: The title must be between 3 and 100 characters long.');
    });

    it('does not allow to create a book when a title length is more than the maximum', ()=>{
       const title = 'a'.repeat(101);
       const picture = 'http://www.example.com/book.jpg';

       expect(() => createBook(title, picture))
           .toThrowError('Error: The title must be between 3 and 100 characters long.');
    });

    it('does not allow to create a book when a title contains special characters', ()=>{
       const title = 'The Book!';
       const picture = 'http://www.example.com/book.jpg';

       expect(() => createBook(title, picture))
           .toThrowError('Error: The title can only contain letters, numbers, and spaces.');
    });

    it('does not allow to create a book when a title contains a prohibited word', ()=>{
        const title = 'The Book is prohibited';
        const picture = 'http://www.example.com/book.jpg';

        expect(() => createBook(title, picture))
          .toThrowError('Error: The title cannot include the prohibited word "prohibited"');
    });
});

