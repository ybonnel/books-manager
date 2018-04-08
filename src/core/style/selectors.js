export function getStyles(state) {
    return state.styles;
}

export function getStylesList(state) {
    return getStyles(state).list.sort((style1, style2) => {
        return style1.label > style2.label;
    });
}

export function getStyleDeleted(state) {
    return getStyles(state).deleted;
}
