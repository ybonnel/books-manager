import {CLOSE_MODAL, OPEN_MODAL} from './action-types';

export function openModal(type) {
    return {
        type: OPEN_MODAL,
        payload: {type}
    };
}

export function closeModal() {
    return {
        type: CLOSE_MODAL
    };
}