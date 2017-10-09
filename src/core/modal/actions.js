import {
    OPEN_MODAL,
    CLOSE_MODAL,
    OPEN_DETAIL_MODAL,
    CLOSE_DETAIL_MODAL
} from './action-types';

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
export function openDetailModal() {
    return {
        type: OPEN_DETAIL_MODAL
    };
}

export function closeDetailModal() {
    return {
        type: CLOSE_DETAIL_MODAL
    };
}