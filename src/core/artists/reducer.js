import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_ARTIST_SUCCESS,
    DELETE_ARTIST_SUCCESS,
    FILTER_ARTISTS,
    LOAD_ARTISTS_SUCCESS,
    UPDATE_ARTIST_SUCCESS
} from './action-types';


export const ArtistsState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function artistsReducer(state = new ArtistsState(), {payload, type}) {
    switch (type) {
        case CREATE_ARTIST_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_ARTIST_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(artist => artist.key !== payload.key)
            });

        case FILTER_ARTISTS:
            return state.set('filter', payload.filterType || '');

        case LOAD_ARTISTS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_ARTIST_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(artist => {
                    return artist.key === payload.key ? payload : artist;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new ArtistsState();

        default:
            return state;
    }
}
