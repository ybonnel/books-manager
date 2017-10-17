import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {Control, Form} from 'react-redux-form';

import {TextInput, TextArea, AutocompleteInput, mapProps} from '../../../core/form';

import {createSelector} from "reselect";
import {getModal, modalActions} from "../../../core/modal/index";
import {booksActions} from "../../../core/books/index";
import {authorActions, getAuthorsList} from "../../../core/authors/index";
import {artistActions, getArtistsList} from "../../../core/artists/index";
import {getSeriesList, serieActions} from "../../../core/serie/index";
import {editorActions, getEditorsList} from "../../../core/editor/index";
import {collectionActions, getCollectionsList} from "../../../core/collection/index";
import {getStylesList, styleActions} from "../../../core/style/index";
import {getLocationsList, locationActions} from "../../../core/location/index";

const creationModal = React.createClass({
    propTypes: {
        modal: PropTypes.shape(
            {isOpen: PropTypes.bool.isRequired}
        ).isRequired,
        closeModal: PropTypes.func.isRequired,
        createBook: PropTypes.func.isRequired,
        createAuthor: PropTypes.func.isRequired,
        createArtist: PropTypes.func.isRequired,
        createSerie: PropTypes.func.isRequired,
        createEditor: PropTypes.func.isRequired,
        createCollection: PropTypes.func.isRequired,
        createStyle: PropTypes.func.isRequired,
        createLocation: PropTypes.func.isRequired
    },

    componentDidMount() {
        window.$(this.modalNode).modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            complete: () => this.props.closeModal() // Callback for Modal close
        });

        if (this.props.modal.isOpen) {
            window.$(this.modalNode).modal('open');
        }
    },

    componentWillUnmount() {
        window.$(this.modalNode).modal();
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.modal.isOpen !== this.props.modal.isOpen) {
            if (nextProps.modal.isOpen) {
                window.$(this.modalNode).modal('open');
            } else {
                window.$(this.modalNode).modal('close');
            }
        }
    },

    handleCloseButton(e) {
        e.preventDefault();
        this.props.closeModal();
    },

    handleSubmitButton(e) {
        e.preventDefault();
        this.formNode.submit();
    },

    createAndReplaceAttributeIfNeeded(isKnown, attr, create, replace) {
        if (!isKnown) {
            return create(attr).then(key => replace(key));
        }
    },

    replaceUndefinedOrNull(key, value) {
        if (value === undefined) {
            return null;
        }
        return value;
    },

    cleanJson(jsonValues) {
        return JSON.parse(JSON.stringify(jsonValues, this.replaceUndefinedOrNull));
    },

    handleFormSubmit(values) {
        Promise.all([
            !!values.artists && values.artists.map((artist, i) => this.createAndReplaceAttributeIfNeeded(false, artist, this.props.createArtist,
                (key) => values.artists[i].key = key)),
            values.authors.map((author, i) => this.createAndReplaceAttributeIfNeeded(false, author, this.props.createAuthor,
                (key) => values.authors[i].key = key)),
            !!values.style && this.createAndReplaceAttributeIfNeeded(false, values.style, this.props.createStyle,
                (key) => values.style.key = key),
            !!values.serie && this.createAndReplaceAttributeIfNeeded(false, values.serie, this.props.createSerie,
                (key) => values.serie.key = key),
            !!values.editor && this.createAndReplaceAttributeIfNeeded(false, values.editor, this.props.createEditor,
                (key) => values.editor.key = key),
            !!values.collection && this.createAndReplaceAttributeIfNeeded(false, values.collection, this.props.createCollection,
                (key) => values.collection.key = key),
            !!values.location && this.createAndReplaceAttributeIfNeeded(false, values.location, this.props.createLocation,
                (key) => values.location.key = key)
        ])
            .then(() => this.props.createBook(this.cleanJson(values)))
            .then(() => this.props.reset());
        this.props.closeModal();
    },

    render() {
        return (
            <div className="modal modal-fixed-footer" ref={ref => this.modalNode = ref}>
                <div className="modal-content">
                    <h4>Give us new book to add</h4>
                    <div className="row">
                        <Form model="user" onSubmit={(val) => this.handleSubmit(val)} className="col s12">
                            <Control.text type="text" model="book.title" placeholder="title" id="title"
                                          component={TextInput} mapProps={mapProps} className="col s6"/>
                            <Control.text type="text" model="book.author" placeholder="Auteur" id="author"
                                          component={AutocompleteInput} mapProps={mapProps} className="col s6"
                                          autosuggestProps={autoSuggestProps}/>
                            <Control.text type="text" model="book.comment" placeholder="commentaire" id="comment"
                                          component={TextArea} mapProps={mapProps} className="col s12"/>
                        </Form>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="right waves-effect waves-light btn" form="form">
                        Create
                    </button>
                    <button type="button" className="right waves-effect waves-light btn" form="form">
                        Clear
                    </button>
                    <a className="modal-action waves-effect waves-green btn-flat" onClick={this.handleCloseButton}>Cancel</a>
                </div>
            </div>
        )
    }
});

const mapStateToProps = createSelector(
    getModal,
    getSeriesList,
    getAuthorsList,
    getArtistsList,
    getEditorsList,
    getCollectionsList,
    getStylesList,
    getLocationsList,
    (modal, series, authors, artists, editors, collections, styles, locations, books) => ({
        modal,
        series,
        authors,
        artists,
        editors,
        collections,
        styles,
        locations
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

//todo: en passant des donnée à intial values, on peut utiliser le meme formulaire en mode "update"
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(creationModal);