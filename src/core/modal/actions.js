import {CLOSE_MODAL, OPEN_MODAL} from './action-types';

export function openModal() {
    return {
        type: OPEN_MODAL
    };
}

export function closeModal() {
    return {
        type: CLOSE_MODAL
    };
}