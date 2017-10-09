import { FirebaseList } from '../firebase';
import * as styleActions from './actions';
import { Style } from './style';


export const styleList = new FirebaseList({
  onAdd: styleActions.createStyleSuccess,
  onChange: styleActions.updateStyleSuccess,
  onLoad: styleActions.loadStyleSuccess,
  onRemove: styleActions.deleteStyleSuccess
}, Style);
