import React from "react";
import {connect} from "react-redux";
import {createSelector} from "reselect";

import {getModal} from "../../../core/modal/selectors";
import {CREATION_MODAL, LOAN_MODAL} from "../../../core/modal";

import CreationModal from './creation-modal';
import LoanModal from './loan-modal';

const MODAL_COMPONENTS = {
    [CREATION_MODAL]: <CreationModal />,
    [LOAN_MODAL]: <LoanModal />
};

class Modal extends React.Component {
    render() {
        const {isOpen, type} = this.props.modal;

        if (!isOpen && !type) {
            return null;
        }
        return MODAL_COMPONENTS[type];
    }
}

const mapStateToProps = createSelector(
    getModal,
    (modal) => ({
        modal
    })
);

export default connect(mapStateToProps)(Modal)