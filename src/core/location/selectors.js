export function getLocations(state) {
    return state.locations;
}

export function getLocationsList(state) {
    return getLocations(state).list;
}

export function getLocationDeleted(state) {
    return getLocations(state).deleted;
}
