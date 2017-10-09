import {Record} from "immutable";
import {CLOSE_MODAL, OPEN_MODAL, OPEN_DETAIL_MODAL, CLOSE_DETAIL_MODAL} from "./action-types";


export const modalState = new Record({
    isOpen: false,
    isDetailOpen: false
});


export function modalReducer(state = new modalState(), {type}) {
    switch (type) {
        case OPEN_MODAL:
            return state.merge({
                isOpen: true,
            });

        case OPEN_DETAIL_MODAL:
            return  state.merge({
                isDetailOpen: true
            });

        case CLOSE_MODAL:
            return  state.merge({
                isOpen: false
            });

        case CLOSE_DETAIL_MODAL:
            return  state.merge({
                isDetailOpen: false
            });

        default:
            return state;
    }
}
