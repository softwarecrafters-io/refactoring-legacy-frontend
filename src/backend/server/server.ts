import express, { Express } from 'express';
import cors from 'cors';
import { setupRoutes } from './routes';
import {LibraryController} from "../controller/LibraryController";

export class Server {
    private app: Express;

    constructor(controller: LibraryController) {
        this.app = express();
        this.setupMiddleware();
        this.setupApiRoutes(controller);
    }

    private setupMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private setupApiRoutes(controller: LibraryController): void {
        const router = setupRoutes(controller);
        this.app.use('/api/', router);
    }

    listen(port: number): void {
        this.app.listen(port, () => console.log(`Server running on port ${port}`));
    }
}
