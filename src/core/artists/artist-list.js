import { FirebaseList } from '../firebase';
import * as artistActions from './actions';
import { Artist } from './artist';


export const artistList = new FirebaseList({
  onAdd: artistActions.createArtistSuccess,
  onChange: artistActions.updateArtistSuccess,
  onLoad: artistActions.loadArtistSuccess,
  onRemove: artistActions.deleteArtistSuccess
}, Artist);
