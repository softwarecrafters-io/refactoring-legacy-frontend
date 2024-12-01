import {Server} from "./infrastructure/server";
import {LibraryController} from "./infrastructure/controller";
import {InMemoryBookRepository} from "./core/bookRepository";

const repo = new InMemoryBookRepository();
const controller = new LibraryController(repo);
const server = new Server(controller);
const PORT = 3000;

server.listen(PORT);
