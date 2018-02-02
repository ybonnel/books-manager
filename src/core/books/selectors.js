import {createSelector} from 'reselect';
import * as filters from './variables';


export function getBooks(state) {
    return state.books;
}

export function getBookList(state) {
    return getBooks(state).list;
}

export function getBookFilter(state) {
    return getBooks(state).filter;
}

export function getBookSearch(state) {
    return getBooks(state).search
}

export function getBookDeleted(state) {
    return getBooks(state).deleted;
}

export function getSelectedBook(state) {
    return state.books.selected
}

export function getMobileSelection(state) {
    return getBooks(state).mobileSelection
}


//=====================================
//  MEMORIZED SELECTORS
//-------------------------------------

export const getVisibleBooks = createSelector(
    getBookList,
    getBookFilter,
    getBookSearch,
    (books, filter) => {
        switch (filter) {
            case filters.OUT:
            return books.filter(book => !!book.location);

        case filters.IN:
            return books.filter(book => !book.location);

        case filters.ALL:
        default:
            return books;
        }
    }
);
