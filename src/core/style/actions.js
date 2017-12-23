import {getStyleDeleted} from './selectors';
import {styleList} from './style-list';
import {
    CREATE_STYLE_ERROR,
    CREATE_STYLE_SUCCESS,
    DELETE_STYLE_ERROR,
    DELETE_STYLE_SUCCESS,
    FILTER_STYLES,
    LOAD_STYLES_SUCCESS,
    UNDELETE_STYLE_ERROR,
    UNLOAD_STYLES_SUCCESS,
    UPDATE_STYLE_ERROR,
    UPDATE_STYLE_SUCCESS
} from './action-types';


export function createStyle({label}) {
    return dispatch => {
        return styleList.push({label})
            .catch(error => dispatch(createStyleError(error)));
    };
}

export function createStyleError(error) {
    return {
        type: CREATE_STYLE_ERROR,
        payload: error
    };
}

export function createStyleSuccess(style) {
    return {
        type: CREATE_STYLE_SUCCESS,
        payload: style
    };
}

export function deleteStyle(style) {
    return dispatch => {
        styleList.remove(style.key)
            .catch(error => dispatch(deleteStyleError(error)));
    };
}

export function deleteStyleError(error) {
    return {
        type: DELETE_STYLE_ERROR,
        payload: error
    };
}

export function deleteStyleSuccess(style) {
    return {
        type: DELETE_STYLE_SUCCESS,
        payload: style
    };
}

export function undeleteStyle() {
    return (dispatch, getState) => {
        const style = getStyleDeleted(getState());
        if (style) {
            styleList.set(style.key, {label: style.label})
                .catch(error => dispatch(undeleteStyleError(error)));
        }
    };
}

export function undeleteStyleError(error) {
    return {
        type: UNDELETE_STYLE_ERROR,
        payload: error
    };
}

export function updateStyleError(error) {
    return {
        type: UPDATE_STYLE_ERROR,
        payload: error
    };
}

export function updateStyle(style, changes) {
    return dispatch => {
        return styleList.update(style.key, changes)
            .catch(error => dispatch(updateStyleError(error)));
    };
}

export function updateStyleSuccess(style) {
    return {
        type: UPDATE_STYLE_SUCCESS,
        payload: style
    };
}

export function loadStyleSuccess(styles) {
    return {
        type: LOAD_STYLES_SUCCESS,
        payload: styles
    };
}

export function filterStyles(filterType) {
    return {
        type: FILTER_STYLES,
        payload: {filterType}
    };
}

export function loadStyles() {
    return (dispatch, getState) => {
        const {auth} = getState();
        styleList.path = `${auth.id}/styles`;
        styleList.subscribe(dispatch);
    };
}

export function unloadStyles() {
    styleList.unsubscribe();
    return {
        type: UNLOAD_STYLES_SUCCESS
    };
}
