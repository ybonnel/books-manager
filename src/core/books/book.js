import {Record} from 'immutable';
export const bookTypes = {ROMAN: 1, COMIC: 2, OTHER: 3};
Object.freeze(bookTypes);

export const Book = new Record({
    key: null,
    title: undefined,
    tome: null,
    authors: [],
    artists: undefined,
    serie: undefined,
    editor: undefined,
    collection: undefined,
    location: undefined,
    style: undefined,
    isbn: undefined,
    comment: null,
    date: null,
    cover: null,
    price: null,
    type: bookTypes.COMIC
});
