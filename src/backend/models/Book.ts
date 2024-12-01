export class Book {
    constructor(
        public id: string,
        public title: string,
        public pictureUrl: string,
        public completed: boolean = false
    ) {}
}
