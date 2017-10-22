import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import Modal from 'react-modal';

import {getModal, modalActions} from "../../../core/modal/index";
import {booksActions} from "../../../core/books/index";
import {authorActions, getAuthorsList} from "../../../core/authors/index";
import {artistActions, getArtistsList} from "../../../core/artists/index";
import {getSeriesList, serieActions} from "../../../core/serie/index";
import {editorActions, getEditorsList} from "../../../core/editor/index";
import {collectionActions, getCollectionsList} from "../../../core/collection/index";
import {getStylesList, styleActions} from "../../../core/style/index";
import {getLocationsList, locationActions} from "../../../core/location/index";
import {getBookToUpdate} from "../../../core/books/selectors";


class CreationModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseButton = this.handleCloseButton.bind(this);
    }

    handleCloseButton(e) {
        e.preventDefault();
        this.props.unselectBook();
        this.props.closeModal();
    }

    render() {
        return (
            <Modal
                isOpen={this.props.modal.isOpen}>
                <div className="modal modal-fixed-footer" ref={ref => this.modalNode = ref}>
                    <div className="modal-content">
                        <h4>Give us new book to add</h4>
                        <div>Hello</div>
                    </div>
                    <div className="modal-footer">
                        <a className="modal-action waves-effect waves-green btn-flat" onClick={this.handleCloseButton}>Cancel</a>
                    </div>
                </div>
            </Modal>
        )
    }
}

CreationModal.propTypes = {
    modal: PropTypes.shape({isOpen: PropTypes.bool.isRequired}).isRequired,
    closeModal: PropTypes.func.isRequired,
    createBook: PropTypes.func.isRequired,
    createAuthor: PropTypes.func.isRequired,
    createArtist: PropTypes.func.isRequired,
    createSerie: PropTypes.func.isRequired,
    createEditor: PropTypes.func.isRequired,
    createCollection: PropTypes.func.isRequired,
    createStyle: PropTypes.func.isRequired,
    createLocation: PropTypes.func.isRequired,
    unselectBook: PropTypes.func.isRequired
};

const mapStateToProps = createSelector(
    getModal,
    getBookToUpdate,
    getSeriesList,
    getAuthorsList,
    getArtistsList,
    getEditorsList,
    getCollectionsList,
    getStylesList,
    getLocationsList,
    (modal, book, series, authors, artists, editors, collections, styles, locations, books) => ({
        modal,
        series,
        authors,
        artists,
        editors,
        collections,
        styles,
        locations,
        initialValues: book,
        enableReinitialize: true
    })
);

const mapDispatchToProps = Object.assign(
    {},
    modalActions,
    booksActions,
    serieActions,
    authorActions,
    artistActions,
    editorActions,
    collectionActions,
    styleActions,
    locationActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreationModal);