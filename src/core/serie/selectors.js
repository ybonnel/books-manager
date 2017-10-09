export function getSeries(state) {
    return state.series;
}

export function getSeriesList(state) {
    return getSeries(state).list;
}

export function getSerieDeleted(state) {
    return getSeries(state).deleted;
}
