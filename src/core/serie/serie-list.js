import { FirebaseList } from '../firebase';
import * as serieActions from './actions';
import { Serie } from './serie';


export const serieList = new FirebaseList({
  onAdd: serieActions.createSerieSuccess,
  onChange: serieActions.updateSerieSuccess,
  onLoad: serieActions.loadSerieSuccess,
  onRemove: serieActions.deleteSerieSuccess
}, Serie);
