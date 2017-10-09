import { FirebaseList } from '../firebase';
import * as authorActions from './actions';
import { Author } from './author';


export const authorList = new FirebaseList({
  onAdd: authorActions.createAuthorSuccess,
  onChange: authorActions.updateAuthoSuccess,
  onLoad: authorActions.loadAuthorsSuccess,
  onRemove: authorActions.deleteAuthorSuccess
}, Author);
