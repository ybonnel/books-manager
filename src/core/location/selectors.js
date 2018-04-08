export function getLocations(state) {
    return state.locations;
}

export function getLocationsList(state) {
    return getLocations(state).list.sort((loc1, loc2) => {
        return loc1.label > loc2.label;
    });
}

export function getLocationDeleted(state) {
    return getLocations(state).deleted;
}
