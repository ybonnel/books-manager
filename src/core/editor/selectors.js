export function getEditors(state) {
    return state.editors;
}

export function getEditorsList(state) {
    return getEditors(state).list.sort((editor1, editor2) => {
        return editor1.label > editor2.label;
    });
}

export function getEditorDeleted(state) {
    return getEditors(state).deleted;
}
