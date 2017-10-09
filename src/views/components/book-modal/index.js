import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {getModal, modalActions} from "../../../core/modal/index";
import {getSelectedBook} from "../../../core/books/index";

import "../../styles/modal.css";

class CreationModal extends React.Component{

    componentDidMount() {
        window.$(this.modalNode).modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            complete: () => this.props.closeDetailModal() // Callback for Modal close
        });
        if (this.props.modal.isDetailOpen) {
            window.$(this.modalNode).modal('open');
        }
    }

    componentWillUnmount() {
        window.$(this.modalNode).modal();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal.isDetailOpen !== this.props.modal.isDetailOpen) {
            if (nextProps.modal.isDetailOpen) {
                window.$(this.modalNode).modal('open');
            } else {
                window.$(this.modalNode).modal('close');
            }
        }
    }

    handleCloseButton(e) {
        e.preventDefault();
        this.props.closeDetailModal();
    }

    render() {
        return (
            <div id="modal1" className="modal bottom-sheet" ref={ref => this.modalNode = ref}>
                {!this.props.book ?
                    <div>rien</div> :
                    <div>
                        <div className="modal-content">
                            <h4>
                                {this.props.book.serie ? `${this.props.book.serie.label} - ` : undefined}
                                {this.props.book.serie ? `Tome ${this.props.book.tome} - ` : undefined}
                                {this.props.book.title ? `${this.props.book.title}` : undefined}
                            </h4>
                            {this.props.book.editor && <p>Editeur: {this.props.book.editor.name}</p>}
                            {this.props.book.collection && <p>Collection: {this.props.book.collection.label}</p>}
                            {this.props.book.authors.length > 0 &&
                            <p>Auteurs: {this.props.book.authors.map(auth => auth.name).join(', ')}</p>}
                            {this.props.book.artists.length > 0 &&
                            <p>Artistes: {this.props.book.artists.map(art => art.name).join(', ')}</p>}
                            {this.props.book.location && <p>Localisation: {this.props.book.location.name}</p>}
                            {this.props.book.isbn && <p>ISBN: {this.props.book.isbn}</p>}
                        </div>
                        <div className="modal-footer">
                            <a className="modal-action modal-close waves-effect waves-green btn-flat"
                               onClick={this.handleCloseButton}>Close</a>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

CreationModal.propTypes = {
    modal: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        isDetailOpen: PropTypes.bool.isRequired
    }).isRequired,
        closeDetailModal: PropTypes.func.isRequired
};

const mapStateToProps = createSelector(
    getModal,
    getSelectedBook,
    (modal, book) => ({
        modal,
        book
    })
);

const mapDispatchToProps = Object.assign(
    {},
    modalActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreationModal);