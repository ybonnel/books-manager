export function getSeries(state) {
    return state.series;
}

export function getSeriesList(state) {
    return getSeries(state).list.sort((serie1, serie2) => {
        return serie1.label > serie2.label
    });
}

export function getSerieDeleted(state) {
    return getSeries(state).deleted;
}
