export function getAuthors(state) {
    return state.authors;
}

export function getAuthorsList(state) {
    return getAuthors(state).list.sort((author1, author2) => {
        return author1.label > author2.label;
    });
}

export function getAuthorDeleted(state) {
    return getAuthors(state).deleted;
}
