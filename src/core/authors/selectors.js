export function getAuthors(state) {
    return state.authors;
}

export function getAuthorsList(state) {
    return getAuthors(state).list;
}

export function getAuthorDeleted(state) {
    return getAuthors(state).deleted;
}
