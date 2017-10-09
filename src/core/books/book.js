import {Record} from 'immutable';

export const Book = new Record({
    key: null,
    title: null,
    tome: null,
    authors: [],
    artists: [],
    serie: {},
    editor: {},
    collection: {},
    location: {},
    style: {},
    isbn: null,
    comment: null,
    date: null,
    cover: null
});
