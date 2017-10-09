export function getArtists(state) {
    return state.artists;
}

export function getArtistsList(state) {
    return getArtists(state).list;
}

export function getArtistsDeleted(state) {
    return getArtists(state).deleted;
}
