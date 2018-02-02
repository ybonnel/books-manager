import {getBookDeleted} from './selectors';
import {booklist} from './book-list';
import {
    CREATE_BOOK_ERROR,
    CREATE_BOOK_SUCCESS,
    SELECT_BOOK,
    UNSELECT_BOOK,
    LOAD_BOOK,
    DELETE_BOOK_ERROR,
    DELETE_BOOK_SUCCESS,
    FILTER_BOOKS,
    LOAD_BOOKS_SUCCESS,
    UNDELETE_BOOK_ERROR,
    UNLOAD_BOOKS_SUCCESS,
    UPDATE_BOOK_ERROR,
    UPDATE_BOOK_SUCCESS,
    TOGGLE_MOBILE_SELECTION,
    RESET_MOBILE_SELECTION,
    SEARCH_BOOKS
} from './action-types';
import {bookTypes} from './book';


export function selectBook(book) {
    return {
        type: SELECT_BOOK,
        payload: book
    }
}

export function unselectBook() {
    return {
        type: UNSELECT_BOOK
    }
}

export function toggleMobileSelection(book) {
    return {
        type: TOGGLE_MOBILE_SELECTION,
        payload: book
    }
}

export function resetMobileSelection() {
    return {
        type: RESET_MOBILE_SELECTION
    }
}

export function searchBooks(search) {
    return {
        type: SEARCH_BOOKS,
        payload: search
    }
}

export function loadBook(book) {
    return {
        type: LOAD_BOOK,
        payload: book
    }
}

export function createBook(book) {
    return dispatch => {
        booklist.push(book)
            .catch(error => dispatch(createBookError(error)));
    };
}

export function createBookError(error) {
    return {
        type: CREATE_BOOK_ERROR,
        payload: error
    };
}

export function createBookSuccess(book) {
    return {
        type: CREATE_BOOK_SUCCESS,
        payload: book
    };
}

export function deleteBook(book) {
    return dispatch => {
        booklist.remove(book.key)
            .catch(error => dispatch(deleteBookError(error)));
    };
}

export function deleteBookError(error) {
    return {
        type: DELETE_BOOK_ERROR,
        payload: error
    };
}

export function deleteBookSuccess(book) {
    return {
        type: DELETE_BOOK_SUCCESS,
        payload: book
    };
}

export function undeleteBook() {
    return (dispatch, getState) => {
        const book = getBookDeleted(getState());
        if (book) {
            booklist.set(book.key,
                {
                    title: book.title,
                    tome: book.tome || null,
                    authors: book.authors,
                    artists: book.artists || null,
                    serie: book.serie || null,
                    editor: book.editor || null,
                    collection: book.collection || null,
                    location: book.location || null,
                    style: book.style || null,
                    isbn: book.isbn || null,
                    comment: book.comment || null,
                    date: book.date || null,
                    cover: book.cover || null,
                    price: book.price || null,
                    type: book.type || bookTypes.COMIC
                })
                .catch(error => dispatch(undeleteBookError(error)));
        }
    };
}

export function undeleteBookError(error) {
    return {
        type: UNDELETE_BOOK_ERROR,
        payload: error
    };
}

export function updateBookError(error) {
    return {
        type: UPDATE_BOOK_ERROR,
        payload: error
    };
}

export function updateBook(book, changes) {
    return dispatch => {
        booklist.update(book.key, changes)
            .catch(error => dispatch(updateBookError(error)));
    };
}

export function updateBookSuccess(book) {
    return {
        type: UPDATE_BOOK_SUCCESS,
        payload: book
    };
}

export function loadBooksSuccess(books) {
    return {
        type: LOAD_BOOKS_SUCCESS,
        payload: books
    };
}

export function filterBooks(filterType) {
    return {
        type: FILTER_BOOKS,
        payload: {filterType}
    };
}

export function loadBooks() {
    return (dispatch, getState) => {
        const {auth} = getState();
        booklist.path = `${auth.id}/comics`;
        booklist.subscribe(dispatch);
    };
}

export function unloadBooks() {
    booklist.unsubscribe();
    return {
        type: UNLOAD_BOOKS_SUCCESS
    };
}

export function updateBooksAttribute(label, key, changes) {
    return dispatch => {
        return booklist.map(book => {
            if (book[label] && book[label].key === key) {
               return dispatch(updateBook(book, {[label]: {key: key, ...changes}}))
            }
            return null;
        })
    }
}
