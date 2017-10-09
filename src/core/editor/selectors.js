export function getEditors(state) {
    return state.editors;
}

export function getEditorsList(state) {
    return getEditors(state).list;
}

export function getEditorDeleted(state) {
    return getEditors(state).deleted;
}
