import {Record} from "immutable";
import {CLOSE_MODAL, OPEN_MODAL} from "./action-types";


export const modalState = new Record({
    isOpen: false,
    type: undefined
});


export function modalReducer(state = new modalState(), {payload, type}) {
    switch (type) {
        case OPEN_MODAL:
            return state.merge({
                isOpen: true,
                type: payload.type
            });

        case CLOSE_MODAL:
            return  new modalState();

        default:
            return state;
    }
}
