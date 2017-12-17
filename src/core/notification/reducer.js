import {Record} from 'immutable';
import {DELETE_BOOK_SUCCESS} from '../books';
import {DELETE_AUTHOR_SUCCESS} from '../authors';
import {DELETE_ARTIST_SUCCESS} from '../artists';
import {DELETE_SERIE_SUCCESS} from '../serie';
import {DELETE_EDITOR_SUCCESS} from '../editor';
import {DELETE_COLLECTION_SUCCESS} from '../collection';
import {DELETE_STYLE_SUCCESS} from '../style';
import {DELETE_LOCATION_SUCCESS} from '../location';
import {DISMISS_NOTIFICATION} from './action-types';


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

        case DELETE_AUTHOR_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Auteur supprimé'
            });

        case DELETE_ARTIST_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Artiste supprimé'
            });

        case DELETE_SERIE_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Série supprimés'
            });

        case DELETE_EDITOR_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Éditeur supprimé'
            });

        case DELETE_COLLECTION_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Collection supprimée'
            });

        case DELETE_STYLE_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Style supprimé'
            });

        case DELETE_LOCATION_SUCCESS:
            return state.merge({
                actionLabel: 'Annuler',
                display: true,
                message: 'Style supprimé'
            });

        case DISMISS_NOTIFICATION:
            return new NotificationState();

        default:
            return new NotificationState();
    }
}
