import {Record} from 'immutable';

export const Book = new Record({
    key: null,
    title: null,
    tome: null,
    authors: [],
    artists: undefined,
    serie: undefined,
    editor: undefined,
    collection: undefined,
    location: undefined,
    style: undefined,
    isbn: null,
    comment: null,
    date: null,
    cover: null,
    price: null
});
