import { Router } from 'express';
import {LibraryController} from "../controller/LibraryController";

export function setupRoutes(controller: LibraryController): Router {
    const router = Router();

    router.get('/', controller.getAll);
    router.post('/', controller.create);
    router.delete('/:id', controller.delete);
    router.put('/:id', controller.update);

    return router;
}
