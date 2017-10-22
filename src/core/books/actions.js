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
    UPDATE_BOOK_SUCCESS
} from './action-types';


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
            booklist.set(book.key, {title: book.title, tome: book.tome, authors: book.authors, artists: book.artists, serie: book.serie})
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