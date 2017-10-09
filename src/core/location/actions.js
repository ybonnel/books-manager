import {getLocationDeleted} from './selectors';
import {locationList} from './location-list';
import {
    CREATE_LOCATION_ERROR,
    CREATE_LOCATION_SUCCESS,
    DELETE_LOCATION_ERROR,
    DELETE_LOCATION_SUCCESS,
    FILTER_LOCATIONS,
    LOAD_LOCATIONS_SUCCESS,
    UNDELETE_LOCATION_ERROR,
    UNLOAD_LOCATIONS_SUCCESS,
    UPDATE_LOCATION_ERROR,
    UPDATE_LOCATION_SUCCESS
} from './action-types';


export function createLocation({name}) {
    return dispatch => {
        return locationList.push({name})
            .catch(error => dispatch(createLocationError(error)));
    };
}

export function createLocationError(error) {
    return {
        type: CREATE_LOCATION_ERROR,
        payload: error
    };
}

export function createLocationSuccess(location) {
    return {
        type: CREATE_LOCATION_SUCCESS,
        payload: location
    };
}

export function deleteLocation(location) {
    return dispatch => {
        locationList.remove(location.key)
            .catch(error => dispatch(deleteLocationError(error)));
    };
}

export function deleteLocationError(error) {
    return {
        type: DELETE_LOCATION_ERROR,
        payload: error
    };
}

export function deleteLocationSuccess(location) {
    return {
        type: DELETE_LOCATION_SUCCESS,
        payload: location
    };
}

export function undeleteLocation() {
    return (dispatch, getState) => {
        const location = getLocationDeleted(getState());
        if (location) {
            locationList.set(location.key, {name: location.name})
                .catch(error => dispatch(undeleteLocationError(error)));
        }
    };
}

export function undeleteLocationError(error) {
    return {
        type: UNDELETE_LOCATION_ERROR,
        payload: error
    };
}

export function updateLocationError(error) {
    return {
        type: UPDATE_LOCATION_ERROR,
        payload: error
    };
}

//fixme: impacter la liste des livres...
export function updateLocation(location, changes) {
    return dispatch => {
        locationList.update(location.key, changes)
            .catch(error => dispatch(updateLocationError(error)));
    };
}

export function updateLocationSuccess(location) {
    return {
        type: UPDATE_LOCATION_SUCCESS,
        payload: location
    };
}

export function loadLocationSuccess(locations) {
    return {
        type: LOAD_LOCATIONS_SUCCESS,
        payload: locations
    };
}

export function filterLocations(filterType) {
    return {
        type: FILTER_LOCATIONS,
        payload: {filterType}
    };
}

export function loadLocations() {
    return (dispatch, getState) => {
        const {auth} = getState();
        locationList.path = `${auth.id}/locations`;
        locationList.subscribe(dispatch);
    };
}

export function unloadLocations() {
    locationList.unsubscribe();
    return {
        type: UNLOAD_LOCATIONS_SUCCESS
    };
}
