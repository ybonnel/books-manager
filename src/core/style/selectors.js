export function getStyles(state) {
    return state.styles;
}

export function getStylesList(state) {
    return getStyles(state).list;
}

export function getStyleDeleted(state) {
    return getStyles(state).deleted;
}
