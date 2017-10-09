import {getCollectionDeleted} from './selectors';
import {collectionList} from './collection-list';
import {
    CREATE_COLLECTION_ERROR,
    CREATE_COLLECTION_SUCCESS,
    DELETE_COLLECTION_ERROR,
    DELETE_COLLECTION_SUCCESS,
    FILTER_COLLECTIONS,
    LOAD_COLLECTIONS_SUCCESS,
    UNDELETE_COLLECTION_ERROR,
    UNLOAD_COLLECTIONS_SUCCESS,
    UPDATE_COLLECTION_ERROR,
    UPDATE_COLLECTION_SUCCESS
} from './action-types';


export function createCollection({label}) {
    return dispatch => {
        return collectionList.push({label})
            .catch(error => dispatch(createCollectionError(error)));
    };
}

export function createCollectionError(error) {
    return {
        type: CREATE_COLLECTION_ERROR,
        payload: error
    };
}

export function createCollectionSuccess(collection) {
    return {
        type: CREATE_COLLECTION_SUCCESS,
        payload: collection
    };
}

export function deleteCollection(collection) {
    return dispatch => {
        collectionList.remove(collection.key)
            .catch(error => dispatch(deleteCollectionError(error)));
    };
}

export function deleteCollectionError(error) {
    return {
        type: DELETE_COLLECTION_ERROR,
        payload: error
    };
}

export function deleteCollectionSuccess(collection) {
    return {
        type: DELETE_COLLECTION_SUCCESS,
        payload: collection
    };
}

export function undeleteCollection() {
    return (dispatch, getState) => {
        const collection = getCollectionDeleted(getState());
        if (collection) {
            collectionList.set(collection.key, {label: collection.label})
                .catch(error => dispatch(undeleteCollectionError(error)));
        }
    };
}

export function undeleteCollectionError(error) {
    return {
        type: UNDELETE_COLLECTION_ERROR,
        payload: error
    };
}

export function updateCollectionError(error) {
    return {
        type: UPDATE_COLLECTION_ERROR,
        payload: error
    };
}

//fixme: impacter la liste des livres...
export function updateCollection(collection, changes) {
    return dispatch => {
        collectionList.update(collection.key, changes)
            .catch(error => dispatch(updateCollectionError(error)));
    };
}

export function updateCollectionSuccess(collection) {
    return {
        type: UPDATE_COLLECTION_SUCCESS,
        payload: collection
    };
}

export function loadCollectionSuccess(collections) {
    return {
        type: LOAD_COLLECTIONS_SUCCESS,
        payload: collections
    };
}

export function filterCollections(filterType) {
    return {
        type: FILTER_COLLECTIONS,
        payload: {filterType}
    };
}

export function loadCollections() {
    return (dispatch, getState) => {
        const {auth} = getState();
        collectionList.path = `${auth.id}/collections`;
        collectionList.subscribe(dispatch);
    };
}

export function unloadCollections() {
    collectionList.unsubscribe();
    return {
        type: UNLOAD_COLLECTIONS_SUCCESS
    };
}
