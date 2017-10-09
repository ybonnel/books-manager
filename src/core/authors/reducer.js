import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_AUTHOR_SUCCESS,
    DELETE_AUTHOR_SUCCESS,
    FILTER_AUTHORS,
    LOAD_AUTHORS_SUCCESS,
    UPDATE_AUTHOR_SUCCESS
} from './action-types';


export const AuthorsState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function authorsReducer(state = new AuthorsState(), {payload, type}) {
    switch (type) {
        case CREATE_AUTHOR_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_AUTHOR_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(author => author.key !== payload.key)
            });

        case FILTER_AUTHORS:
            return state.set('filter', payload.filterType || '');

        case LOAD_AUTHORS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_AUTHOR_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(author => {
                    return author.key === payload.key ? payload : author;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new AuthorsState();

        default:
            return state;
    }
}
