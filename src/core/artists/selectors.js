export function getArtists(state) {
    return state.artists;
}

export function getArtistsList(state) {
    return getArtists(state).list.sort((artist1, artist2) => {
        return artist1.label > artist2.label;
    });
}

export function getArtistsDeleted(state) {
    return getArtists(state).deleted;
}
