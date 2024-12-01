import { Request, Response } from 'express';
import {Book} from "../core/book";
import {BookRepository} from "../core/bookRepository";

export class LibraryController {
    constructor(private repository: BookRepository) {}

    getAll = (req: Request, res: Response): void => {
        res.json(this.repository.getAll());
    };

    create = (req: Request, res: Response): void => {
        const { id, title, pictureUrl, completed } = req.body;
        const book = new Book(id, title, pictureUrl, completed);
        this.repository.add(book);
        res.status(201).json(book)
    };

    delete = (req: Request, res: Response): void => {
        this.repository.delete(req.params.id);
        res.status(204).end();
    };

    update = (req: Request, res: Response): void => {
        try{
            this.repository.update(req.params.id, req.body);
            res.json(req.body);
        }
        catch(e){
            res.status(404).json({ error: 'Book not found' });
        }
    };
}
