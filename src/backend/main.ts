import {LibraryController} from "./controller/LibraryController";
import {Server} from "./server/server";

const controller = new LibraryController();
const server = new Server(controller);
const PORT = 3000;

server.listen(PORT);
