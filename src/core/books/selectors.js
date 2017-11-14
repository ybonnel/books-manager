import {createSelector} from 'reselect';


export function getBooks(state) {
    return state.books;
}

export function getBookList(state) {
    return getBooks(state).list;
}

export function getBookFilter(state) {
    return getBooks(state).filter;
}

export function getBookDeleted(state) {
    return getBooks(state).deleted;
}

export function getSelectedBook(state) {
    return state.books.selected
}


//=====================================
//  MEMORIZED SELECTORS
//-------------------------------------

//todo: ça sert un peu a rien vu qu'un livre pau pas etre completed...mais un peu faire des filtre au cas où
export const getVisibleBooks = createSelector(
    getBookList,
    getBookFilter,
    (books, filter) => {
        switch (filter) {
            case 'active':
                return books.filter(book => !book.completed);

            case 'completed':
                return books.filter(book => book.completed);

            default:
                return books;
        }
    }
);
