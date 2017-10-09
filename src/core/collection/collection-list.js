import { FirebaseList } from '../firebase';
import * as collectionActions from './actions';
import { Collection } from './collection';


export const collectionList = new FirebaseList({
  onAdd: collectionActions.createCollectionSuccess,
  onChange: collectionActions.updateCollectionSuccess,
  onLoad: collectionActions.loadCollectionSuccess,
  onRemove: collectionActions.deleteCollectionSuccess
}, Collection);
