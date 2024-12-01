
export class Book {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly pictureUrl: string,
        readonly completed = false,
    ) {}
}
