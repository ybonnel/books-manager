import React from "react";
import {PropTypes} from 'prop-types';

export default class BookButton extends React.Component{
    constructor(props){
        super(props);

        this.handleOpenModal = this.handleOpenModal.bind(this);
    }

    handleOpenModal(e) {
        e.preventDefault();
        this.props.openModal();
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

