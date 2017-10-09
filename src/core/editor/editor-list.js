import { FirebaseList } from '../firebase';
import * as editorActions from './actions';
import { Editor } from './Editor';


export const editorList = new FirebaseList({
  onAdd: editorActions.createEditorSuccess,
  onChange: editorActions.updateEditorSuccess,
  onLoad: editorActions.loadEditorSuccess,
  onRemove: editorActions.deleteEditorSuccess
}, Editor);
