import {filterBooks} from "../../../../frontend/domain/services/FilterBook";
import {createBook, toggleCompleted} from "../../../../frontend/domain/book";

describe('The Filter Book', ()=>{
    it('retrieves all books when the filter is all', ()=>{
        const aBook = createBook('The Book', 'http://www.example.com/book.jpg');
        const completedBook = toggleCompleted(aBook);
        const anotherBook = createBook('Another Book', 'http://www.example.com/another-book.jpg');
        const books = [completedBook, anotherBook];

        const filteredBooks = filterBooks(books, 'all');

        expect(filteredBooks).toEqual(books);
    });
});
