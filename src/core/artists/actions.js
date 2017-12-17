import {getArtistsDeleted} from './selectors';
import {artistList} from './artist-list';
import {
    CREATE_ARTIST_ERROR,
    CREATE_ARTIST_SUCCESS,
    DELETE_ARTIST_ERROR,
    DELETE_ARTIST_SUCCESS,
    FILTER_ARTISTS,
    LOAD_ARTISTS_SUCCESS,
    UNDELETE_ARTIST_ERROR,
    UNLOAD_ARTISTS_SUCCESS,
    UPDATE_ARTIST_ERROR,
    UPDATE_ARTIST_SUCCESS
} from './action-types';


export function createArtist({label}) {
    return dispatch => {
        return artistList.push({label})
            .catch(error => dispatch(createArtistError(error)));
    };
}

export function createArtistError(error) {
    return {
        type: CREATE_ARTIST_ERROR,
        payload: error
    };
}

export function createArtistSuccess(artist) {
    return {
        type: CREATE_ARTIST_SUCCESS,
        payload: artist
    };
}

export function deleteArtist(artist) {
    return dispatch => {
        artistList.remove(artist.key)
            .catch(error => dispatch(deleteArtistError(error)));
    };
}

export function deleteArtistError(error) {
    return {
        type: DELETE_ARTIST_ERROR,
        payload: error
    };
}

export function deleteArtistSuccess(artist) {
    return {
        type: DELETE_ARTIST_SUCCESS,
        payload: artist
    };
}

export function undeleteArtist() {
    return (dispatch, getState) => {
        const artist = getArtistsDeleted(getState());
        if (artist) {
            artistList.set(artist.key, {label: artist.label})
                .catch(error => dispatch(undeleteArtistError(error)));
        }
    };
}

export function undeleteArtistError(error) {
    return {
        type: UNDELETE_ARTIST_ERROR,
        payload: error
    };
}

export function updateArtistError(error) {
    return {
        type: UPDATE_ARTIST_ERROR,
        payload: error
    };
}

//fixme: impacter la liste des livres...
export function updateArtist(artist, changes) {
    return dispatch => {
        artistList.update(artist.key, changes)
            .catch(error => dispatch(updateArtistError(error)));
    };
}

export function updateArtistSuccess(artist) {
    return {
        type: UPDATE_ARTIST_SUCCESS,
        payload: artist
    };
}

export function loadArtistSuccess(artists) {
    return {
        type: LOAD_ARTISTS_SUCCESS,
        payload: artists
    };
}

export function filterArtists(filterType) {
    return {
        type: FILTER_ARTISTS,
        payload: {filterType}
    };
}

export function loadArtists() {
    return (dispatch, getState) => {
        const {auth} = getState();
        artistList.path = `${auth.id}/artists`;
        artistList.subscribe(dispatch);
    };
}

export function unloadArtists() {
    artistList.unsubscribe();
    return {
        type: UNLOAD_ARTISTS_SUCCESS
    };
}
