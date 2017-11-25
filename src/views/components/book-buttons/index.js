import React from "react";
import {PropTypes} from 'prop-types';
import {CREATION_MODAL} from "../../../core/modal/variables";

export default class BookButton extends React.Component{
    constructor(props){
        super(props);

        this.handleOpenModal = this.handleOpenModal.bind(this);
    }

    handleOpenModal(e) {
        e.preventDefault();
        this.props.openModal(CREATION_MODAL);
    }

    render() {
        return (
            <a className="waves-effect waves-teal btn" onClick={this.handleOpenModal}>
                <i className="material-icons left">library_add</i>New book
            </a>
        )
    }
}

BookButton.PropTypes = {
    openModal: PropTypes.func.isRequired
};

