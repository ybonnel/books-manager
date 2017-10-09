import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_LOCATION_SUCCESS,
    DELETE_LOCATION_SUCCESS,
    FILTER_LOCATIONS,
    LOAD_LOCATIONS_SUCCESS,
    UPDATE_LOCATION_SUCCESS
} from './action-types';


export const LocationsState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function locationsReducer(state = new LocationsState(), {payload, type}) {
    switch (type) {
        case CREATE_LOCATION_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_LOCATION_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(location => location.key !== payload.key)
            });

        case FILTER_LOCATIONS:
            return state.set('filter', payload.filterType || '');

        case LOAD_LOCATIONS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_LOCATION_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(location => {
                    return location.key === payload.key ? payload : location;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new LocationsState();

        default:
            return state;
    }
}
