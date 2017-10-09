import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_COLLECTION_SUCCESS,
    DELETE_COLLECTION_SUCCESS,
    FILTER_COLLECTIONS,
    LOAD_COLLECTIONS_SUCCESS,
    UPDATE_COLLECTION_SUCCESS
} from './action-types';


export const CollectionsState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function collectionsReducer(state = new CollectionsState(), {payload, type}) {
    switch (type) {
        case CREATE_COLLECTION_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_COLLECTION_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(collection => collection.key !== payload.key)
            });

        case FILTER_COLLECTIONS:
            return state.set('filter', payload.filterType || '');

        case LOAD_COLLECTIONS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_COLLECTION_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(collection => {
                    return collection.key === payload.key ? payload : collection;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new CollectionsState();

        default:
            return state;
    }
}
