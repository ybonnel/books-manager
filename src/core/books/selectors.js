import {createSelector} from 'reselect';
import {FILTERS, SORT_OPTIONS} from './variables';


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

export function getBookSort(state) {
    return getBooks(state).sort;
}

//=====================================
//  MEMORIZED SELECTORS
//-------------------------------------
export const getVisibleBooks = createSelector(
    getBookList,
    getBookFilter,
    getBookSort,
    (books, filter, sort) => {
        const filteredBooks = books.sort((book1, book2) => {
            switch (sort) {
                case SORT_OPTIONS.TITLE:
                    return book1.title > book2.title;
                case SORT_OPTIONS.SERIE:
                    if (!book1.serie) {
                        return 1;
                    } else if (!book2.serie) {
                        return -1;
                    } else if (!book1.serie && !book2.serie) {
                        return book1.title < book2.title;
                    } else if (book1.serie.label === book2.serie.label && book1.isSpecialIssue !== book2.isSpecialIssue) {
                        return book1.isSpecialIssue > book2.isSpecialIssue;
                    } else if (book1.serie.label === book2.serie.label && book1.isSpecialIssue === book2.isSpecialIssue) {
                        return Number.parseInt(book1.tome) < Number.parseInt(book2.tome) ? -1 : 1
                    }
                    return book1.serie.label.localeCompare(book2.serie.label);
                case SORT_OPTIONS.DATE:
                default:
                    return book1.date - book2.date;
            }
        });

        switch (filter) {
            case FILTERS.OUT:
            return filteredBooks.filter(book => !!book.location);

        case FILTERS.IN:
            return filteredBooks.filter(book => !book.location);

        case FILTERS.ALL:
        default:
            return filteredBooks;
        }
    }
);
