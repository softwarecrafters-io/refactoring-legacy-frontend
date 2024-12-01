import express, { Express, Router } from 'express';
import cors from 'cors';
import { LibraryController } from './controller';

export class Server {
    private app: Express;
    private controller: LibraryController;

    constructor(controller: LibraryController) {
        this.controller = controller;
        this.app = express();
        this.app.use(cors());
        this.app.use(express.json());
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const router = Router();
        router.get('/', this.controller.getAll);
        router.post('/', this.controller.create);
        router.delete('/:id', this.controller.delete);
        router.put('/:id', this.controller.update);
        this.app.use('/api/', router);
    }

    listen(port: number): void {
        this.app.listen(port, () => console.log(`Server running on port ${port}`));
    }
}
