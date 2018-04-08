import {List, Record} from 'immutable';
import {normalizeString} from '../../utils/utils';

import {
    SIGN_OUT_SUCCESS
} from '../auth';

import {
    SELECT_BOOK,
    UNSELECT_BOOK,
    CREATE_BOOK_SUCCESS,
    DELETE_BOOK_SUCCESS,
    FILTER_BOOKS,
    LOAD_BOOKS_SUCCESS,
    UPDATE_BOOK_SUCCESS,
    LOAD_BOOK,
    TOGGLE_MOBILE_SELECTION,
    RESET_MOBILE_SELECTION,
    SEARCH_BOOKS,
    SORT_BOOKS
} from './action-types';
import {SORT_OPTIONS, FILTERS} from "./variables";


export const BooksState = new Record({
    deleted: null,
    filter: FILTERS.ALL,
    list: new List(),
    previous: null,
    selected: null,
    bookToUpdate: null,
    mobileSelection: new Map(),
    search: '',
    sort: SORT_OPTIONS.SERIE
});

export function booksReducer(state = new BooksState(), {payload, type}) {
    switch (type) {
        case SELECT_BOOK:
            return state.merge({
                selected: payload
            });

        case UNSELECT_BOOK:
            return state.merge({
                selected: null
            });

        case LOAD_BOOK:
            return state.merge({
                bookToUpdate: payload
            });

        case CREATE_BOOK_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.deleted && state.deleted.key === payload.key ?
                    state.previous :
                    state.list.unshift(payload)
            });

        case DELETE_BOOK_SUCCESS:
            return state.merge({
                deleted: payload,
                previous: state.list,
                list: state.list.filter(book => book.key !== payload.key)
            });

        case FILTER_BOOKS:
            return state.set('filter', payload.filterType || '');

        case SORT_BOOKS:
            return state.set('sort', payload.sortOption || '');

        case LOAD_BOOKS_SUCCESS:
            return state.set('list', new List(payload.reverse()));

        case UPDATE_BOOK_SUCCESS:
            return state.merge({
                deleted: null,
                previous: null,
                list: state.list.map(book => {
                    return book.key === payload.key ? payload : book;
                })
            });

        case SIGN_OUT_SUCCESS:
            return new BooksState();

        case TOGGLE_MOBILE_SELECTION:
            return state.merge({
                mobileSelection: state.mobileSelection.has(payload.key) ?
                    state.mobileSelection.delete(payload.key) && state.mobileSelection :
                    state.mobileSelection.set(payload.key, payload)
            });

        case RESET_MOBILE_SELECTION:
            return state.merge({
                mobileSelection: new Map()
            });

        case SEARCH_BOOKS:
            const search = normalizeString(payload);
            return state.merge({search});

        default:
            return state;
    }
}
