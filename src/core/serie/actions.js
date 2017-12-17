import {getSerieDeleted} from './selectors';
import {serieList} from './serie-list';
import {
    CREATE_SERIE_ERROR,
    CREATE_SERIE_SUCCESS,
    DELETE_SERIE_ERROR,
    DELETE_SERIE_SUCCESS,
    FILTER_SERIES,
    LOAD_SERIES_SUCCESS,
    UNDELETE_SERIE_ERROR,
    UNLOAD_SERIES_SUCCESS,
    UPDATE_SERIE_ERROR,
    UPDATE_SERIE_SUCCESS
} from './action-types';


export function createSerie({label}) {
    return dispatch => {
        return serieList.push({label})
            .catch(error => dispatch(createSerieError(error)));
    };
}

export function createSerieError(error) {
    return {
        type: CREATE_SERIE_ERROR,
        payload: error
    };
}

export function createSerieSuccess(serie) {
    return {
        type: CREATE_SERIE_SUCCESS,
        payload: serie
    };
}

export function deleteSerie(serie) {
    return dispatch => {
        serieList.remove(serie.key)
            .catch(error => dispatch(deleteSerieError(error)));
    };
}

export function deleteSerieError(error) {
    return {
        type: DELETE_SERIE_ERROR,
        payload: error
    };
}

export function deleteSerieSuccess(serie) {
    return {
        type: DELETE_SERIE_SUCCESS,
        payload: serie
    };
}

export function undeleteSerie() {
    return (dispatch, getState) => {
        const serie = getSerieDeleted(getState());
        if (serie) {
            serieList.set(serie.key, {label: serie.label})
                .catch(error => dispatch(undeleteSerieError(error)));
        }
    };
}

export function undeleteSerieError(error) {
    return {
        type: UNDELETE_SERIE_ERROR,
        payload: error
    };
}

export function updateSerieError(error) {
    return {
        type: UPDATE_SERIE_ERROR,
        payload: error
    };
}

export function updateSerie(serie, changes) {
    return dispatch => {
        return serieList.update(serie.key, changes)
            .catch(error => dispatch(updateSerieError(error)));
    };
}

export function updateSerieSuccess(serie) {
    return {
        type: UPDATE_SERIE_SUCCESS,
        payload: serie
    };
}

export function loadSerieSuccess(series) {
    return {
        type: LOAD_SERIES_SUCCESS,
        payload: series
    };
}

export function filterSeries(filterType) {
    return {
        type: FILTER_SERIES,
        payload: {filterType}
    };
}

export function loadSeries() {
    return (dispatch, getState) => {
        const {auth} = getState();
        serieList.path = `${auth.id}/series`;
        serieList.subscribe(dispatch);
    };
}

export function unloadSeries() {
    serieList.unsubscribe();
    return {
        type: UNLOAD_SERIES_SUCCESS
    };
}
