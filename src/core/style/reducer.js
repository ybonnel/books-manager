import {List, Record} from 'immutable';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    CREATE_STYLE_SUCCESS,
    DELETE_STYLE_SUCCESS,
    FILTER_STYLES,
    LOAD_STYLES_SUCCESS,
    UPDATE_STYLE_SUCCESS
} from './action-types';


export const StylesState = new Record({
    deleted: null,
    filter: '',
    list: new List(),
    previous: null
});


export function stylesReducer(state = new StylesState(), {payload, type}) {
    switch (type) {
        case CREATE_STYLE_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_STYLE_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(style => style.key !== payload.key)
            });

        case FILTER_STYLES:
            return state.set('filter', payload.filterType || '');

        case LOAD_STYLES_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_STYLE_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(style => {
                    return style.key === payload.key ? payload : style;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new StylesState();

        default:
            return state;
    }
}
