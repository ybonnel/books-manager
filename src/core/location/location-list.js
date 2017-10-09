import { FirebaseList } from '../firebase';
import * as locationActions from './actions';
import { Location } from './location';


export const locationList = new FirebaseList({
  onAdd: locationActions.createLocationSuccess,
  onChange: locationActions.updateLocationSuccess,
  onLoad: locationActions.loadLocationSuccess,
  onRemove: locationActions.deleteLocationSuccess
}, Location);
