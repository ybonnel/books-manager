import { Record } from 'immutable';
import { DELETE_BOOK_SUCCESS } from '../books';
import { DISMISS_NOTIFICATION } from './action-types';


export const NotificationState = new Record({
  actionLabel: '',
  display: false,
  message: ''
});

export function notificationReducer(state = new NotificationState(), action) {
  switch (action.type) {
    case DELETE_BOOK_SUCCESS:
      return state.merge({
        actionLabel: 'Annuler',
        display: true,
        message: 'Livre supprimé'
      });

    case DISMISS_NOTIFICATION:
      return new NotificationState();

    default:
      return new NotificationState();
  }
}
