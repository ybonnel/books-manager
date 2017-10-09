import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_EDITOR_SUCCESS,
    DELETE_EDITOR_SUCCESS,
    FILTER_EDITORS,
    LOAD_EDITORS_SUCCESS,
    UPDATE_EDITOR_SUCCESS
} from './action-types';


export const EditorsState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function editorsReducer(state = new EditorsState(), {payload, type}) {
    switch (type) {
        case CREATE_EDITOR_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_EDITOR_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(editor => editor.key !== payload.key)
            });

        case FILTER_EDITORS:
            return state.set('filter', payload.filterType || '');

        case LOAD_EDITORS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_EDITOR_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(editor => {
                    return editor.key === payload.key ? payload : editor;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new EditorsState();

        default:
            return state;
    }
}
