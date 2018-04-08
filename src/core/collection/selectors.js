export function getCollections(state) {
    return state.collections;
}

export function getCollectionsList(state) {
    return getCollections(state).list.sort((collection1, collection2) => {
        return collection1.label > collection2.label;
    });
}

export function getCollectionDeleted(state) {
    return getCollections(state).deleted;
}
