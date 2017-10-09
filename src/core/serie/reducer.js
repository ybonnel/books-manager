import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_SERIE_SUCCESS,
    DELETE_SERIE_SUCCESS,
    FILTER_SERIES,
    LOAD_SERIES_SUCCESS,
    UPDATE_SERIE_SUCCESS
} from './action-types';


export const SeriesState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function seriesReducer(state = new SeriesState(), {payload, type}) {
    switch (type) {
        case CREATE_SERIE_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_SERIE_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(serie => serie.key !== payload.key)
            });

        case FILTER_SERIES:
            return state.set('filter', payload.filterType || '');

        case LOAD_SERIES_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_SERIE_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(serie => {
                    return serie.key === payload.key ? payload : serie;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new SeriesState();

        default:
            return state;
    }
}
