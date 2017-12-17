import {getEditorDeleted} from './selectors';
import {editorList} from './editor-list';
import {
    CREATE_EDITOR_ERROR,
    CREATE_EDITOR_SUCCESS,
    DELETE_EDITOR_ERROR,
    DELETE_EDITOR_SUCCESS,
    FILTER_EDITORS,
    LOAD_EDITORS_SUCCESS,
    UNDELETE_EDITOR_ERROR,
    UNLOAD_EDITORS_SUCCESS,
    UPDATE_EDITOR_ERROR,
    UPDATE_EDITOR_SUCCESS
} from './action-types';


export function createEditor({label}) {
    return dispatch => {
        return editorList.push({label})
            .catch(error => dispatch(createEditorError(error)));
    };
}

export function createEditorError(error) {
    return {
        type: CREATE_EDITOR_ERROR,
        payload: error
    };
}

export function createEditorSuccess(editor) {
    return {
        type: CREATE_EDITOR_SUCCESS,
        payload: editor
    };
}

export function deleteEditor(editor) {
    return dispatch => {
        editorList.remove(editor.key)
            .catch(error => dispatch(deleteEditorError(error)));
    };
}

export function deleteEditorError(error) {
    return {
        type: DELETE_EDITOR_ERROR,
        payload: error
    };
}

export function deleteEditorSuccess(editor) {
    return {
        type: DELETE_EDITOR_SUCCESS,
        payload: editor
    };
}

export function undeleteEditor() {
    return (dispatch, getState) => {
        const editor = getEditorDeleted(getState());
        if (editor) {
            editorList.set(editor.key, {label: editor.label})
                .catch(error => dispatch(undeleteEditorError(error)));
        }
    };
}

export function undeleteEditorError(error) {
    return {
        type: UNDELETE_EDITOR_ERROR,
        payload: error
    };
}

export function updateEditorError(error) {
    return {
        type: UPDATE_EDITOR_ERROR,
        payload: error
    };
}

//fixme: impacter la liste des livres...
export function updateEditor(editor, changes) {
    return dispatch => {
        editorList.update(editor.key, changes)
            .catch(error => dispatch(updateEditorError(error)));
    };
}

export function updateEditorSuccess(editor) {
    return {
        type: UPDATE_EDITOR_SUCCESS,
        payload: editor
    };
}

export function loadEditorSuccess(editors) {
    return {
        type: LOAD_EDITORS_SUCCESS,
        payload: editors
    };
}

export function filterEditors(filterType) {
    return {
        type: FILTER_EDITORS,
        payload: {filterType}
    };
}

export function loadEditors() {
    return (dispatch, getState) => {
        const {auth} = getState();
        editorList.path = `${auth.id}/editors`;
        editorList.subscribe(dispatch);
    };
}

export function unloadEditors() {
    editorList.unsubscribe();
    return {
        type: UNLOAD_EDITORS_SUCCESS
    };
}
