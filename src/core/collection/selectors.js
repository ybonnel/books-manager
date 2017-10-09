export function getCollections(state) {
    return state.collections;
}

export function getCollectionsList(state) {
    return getCollections(state).list;
}

export function getCollectionDeleted(state) {
    return getCollections(state).deleted;
}
