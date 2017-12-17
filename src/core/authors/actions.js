import {getAuthorDeleted} from './selectors';
import {authorList} from './author-list';
import {
    CREATE_AUTHOR_ERROR,
    CREATE_AUTHOR_SUCCESS,
    DELETE_AUTHOR_ERROR,
    DELETE_AUTHOR_SUCCESS,
    FILTER_AUTHORS,
    LOAD_AUTHORS_SUCCESS,
    UNDELETE_AUTHOR_ERROR,
    UNLOAD_AUTHORS_SUCCESS,
    UPDATE_AUTHOR_ERROR,
    UPDATE_AUTHOR_SUCCESS
} from './action-types';


export function createAuthor({label}) {
    return dispatch => {
        return authorList.push({label})
            .catch(error => dispatch(createAuthorError(error)));
    };
}

export function createAuthorError(error) {
    return {
        type: CREATE_AUTHOR_ERROR,
        payload: error
    };
}

export function createAuthorSuccess(author) {
    return {
        type: CREATE_AUTHOR_SUCCESS,
        payload: author
    };
}

//fixme: verifier au prélable qu'aucun livre ne contient cette auteur...a faire sur la page bien sur pas là
export function deleteAuthor(author) {
    return dispatch => {
        authorList.remove(author.key)
            .catch(error => dispatch(deleteAuthorError(error)));
    };
}

export function deleteAuthorError(error) {
    return {
        type: DELETE_AUTHOR_ERROR,
        payload: error
    };
}

export function deleteAuthorSuccess(author) {
    return {
        type: DELETE_AUTHOR_SUCCESS,
        payload: author
    };
}

export function undeleteAuthor() {
    return (dispatch, getState) => {
        const author = getAuthorDeleted(getState());
        if (author) {
            authorList.set(author.key, {label: author.label})
                .catch(error => dispatch(undeleteAuthorError(error)));
        }
    };
}

export function undeleteAuthorError(error) {
    return {
        type: UNDELETE_AUTHOR_ERROR,
        payload: error
    };
}

export function updateAuthorError(error) {
    return {
        type: UPDATE_AUTHOR_ERROR,
        payload: error
    };
}

//fixme: impacter la liste des livres...
export function updateAuthor(author, changes) {
    return dispatch => {
        return authorList.update(author.key, changes)
            .catch(error => dispatch(updateAuthorError(error)));
    };
}

export function updateAuthoSuccess(author) {
    return {
        type: UPDATE_AUTHOR_SUCCESS,
        payload: author
    };
}

export function loadAuthorsSuccess(authors) {
    return {
        type: LOAD_AUTHORS_SUCCESS,
        payload: authors
    };
}

export function filterAuthors(filterType) {
    return {
        type: FILTER_AUTHORS,
        payload: {filterType}
    };
}

export function loadAuthors() {
    return (dispatch, getState) => {
        const {auth} = getState();
        authorList.path = `${auth.id}/authors`;
        authorList.subscribe(dispatch);
    };
}

export function unloadAuthors() {
    authorList.unsubscribe();
    return {
        type: UNLOAD_AUTHORS_SUCCESS
    };
}
