import {Record} from "immutable";
import {CLOSE_MODAL, OPEN_MODAL} from "./action-types";


export const modalState = new Record({
    isOpen: false
});


export function modalReducer(state = new modalState(), {type}) {
    switch (type) {
        case OPEN_MODAL:
            return state.merge({
                isOpen: true,
            });

        case CLOSE_MODAL:
            return  state.merge({
                isOpen: false
            });

        default:
            return state;
    }
}
