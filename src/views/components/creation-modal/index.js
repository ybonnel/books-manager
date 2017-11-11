import 'react-dates/initialize';
import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import Modal from 'react-modal';
import moment from 'moment';
import {SingleDatePicker} from 'react-dates';
import Select from 'react-select';

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

import 'react-dates/lib/css/_datepicker.css';
import 'react-select/dist/react-select.css';
import './creation-modal.css';

moment.locale('fr');

class CreationModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.replaceUndefinedOrNull = this.replaceUndefinedOrNull.bind(this);
        this.getAutocompleteData = this.getAutocompleteData.bind(this);
        this.initializeState = this.initializeState.bind(this);

        this.state = this.props.selectedBook || this.initializeState()
    }

    initializeState() {
        return {
            title: undefined,
            serie: undefined,
            tome: undefined,
            date: moment(),
            artists: [],
            authors: [],
            editor: undefined,
            collection: undefined,
            isbn: undefined,
            style: undefined,
            location: undefined,
            price: undefined,
            comment: undefined,
            cover: undefined
        }
    }

    handleCloseButton(e) {
        e.preventDefault();
        this.setState(this.initializeState());
        this.props.unselectBook();
        this.props.closeModal();
    }

    validate() {
        const errors = {};

        if (!this.state.title && (!this.state.serie)) {
            errors.title = "Le titre est obligatoire si l'entrée n'est pas une série.";
        }

        if (!this.state.authors) {
            errors.authors = "L'entrée doit comporter au moins un auteur.";
        }

        if (!!this.state.serie && !this.state.tome) {
            errors.serie = "Veuillez renseigner le numéro de série correspondant."
        }

        if (!this.state.serie && !!this.state.tome) {
            errors.tome = "Veuillez renseigner la série correspondante."
        }

        return errors;
    }

    createAndReplaceAttributeIfNeeded(attr, labelKey, create, replace) {
        if (!!attr.className) {
            return create({[labelKey]: attr.value})
                .then(key => replace(key, attr.value));
        }
        replace(attr.value, attr.label)
    }

    replaceUndefinedOrNull(key, value) {
        if (value === undefined) {
            return null;
        }
        return value;
    }

    cleanJson(jsonValues) {
        return JSON.parse(JSON.stringify(jsonValues, this.replaceUndefinedOrNull));
    }

    handleSubmit() {
        Promise.all([
            !!this.state.artists && this.state.artists.map((artist, i) => this.createAndReplaceAttributeIfNeeded(artist, 'name', this.props.createArtist,
                (key, name) => this.setState({artists: [...this.state.artists.splice(i, 1), {key, name}]}))),
            this.state.authors.map((author, i) => this.createAndReplaceAttributeIfNeeded(author, 'name', this.props.createAuthor,
                (key, name) => this.setState({authors: [...this.state.authors.splice(i, 1), {key, name}]}))),
            !!this.state.style && this.createAndReplaceAttributeIfNeeded(this.state.style, 'label', this.props.createStyle,
                (key, label) => this.setState({style: {key, label}})),
            !!this.state.serie && this.createAndReplaceAttributeIfNeeded(this.state.serie, 'label', this.props.createSerie,
                (key, label) => this.setState({serie: {key, label}})),
            !!this.state.editor && this.createAndReplaceAttributeIfNeeded(this.state.editor, 'name', this.props.createEditor,
                (key, name) => this.setState({editor: {key, name}})),
            !!this.state.collection && this.createAndReplaceAttributeIfNeeded(this.state.collection, 'label', this.props.createCollection,
                (key, label) => this.setState({collection: {key, label}})),
            !!this.state.location && this.createAndReplaceAttributeIfNeeded(this.state.location, 'name', this.props.createLocation,
                (key, name) => this.setState({location: {key, name}}))
        ])
            .then(() => {
                this.props.createBook(this.cleanJson(this.state))
            })
            .then(() => this.props.unselectBook())
            .then(() => {
                this.setState(this.initializeState());
                this.props.closeModal();
            });
    }

    getAutocompleteData(recordList, attribute = 'name') {
        if (!recordList) {
            return [];
        }
        return recordList.reduce((acc, item, index) => acc.concat({label: item[attribute], value: item.key}), [])
    }

    render() {
        return (
            <Modal
                className="modal creation-modal"
                isOpen={this.props.modal.isOpen}>
                <div className="wrapper modal__wrapper">
                    <div className="modal__title">Ajouter un livre</div>
                    <div className="modal__content">
                        <form className="form creation-form">
                            <div className="form__group">
                                <div className="input__group">
                                    <input
                                        type="text"
                                        id="title"
                                        className={`form__input ${!!this.state.title ? 'form__input--has-content' : ''}`}
                                        value={this.state.title || ''}
                                        onChange={(event) => this.setState({title: event.target.value})}/>
                                    <label htmlFor="title">Titre</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="serie"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.serie ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.series, 'label')}
                                        onChange={serie => this.setState({serie})}
                                        value={this.state.serie}
                                    />
                                    <label htmlFor="serie">Série</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group input__group--small">
                                    <input
                                        type="number" min="0" step="1"
                                        id="tome"
                                        className={`form__input ${!!this.state.tome ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({tome: event.target.value})}/>
                                    <label htmlFor="tome">Tome</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={true}
                                        name="authors"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.authors.length > 0 ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.authors)}
                                        onChange={authors => this.setState({authors})}
                                        value={this.state.authors}
                                    />
                                    <label htmlFor="authors">Auteur(s)</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={true}
                                        name="artists"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.artists.length > 0 ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.artists)}
                                        onChange={artists => this.setState({artists})}
                                        value={this.state.artists}
                                    />
                                    <label htmlFor="artists">Artiste</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="editor"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.editor ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.editors)}
                                        onChange={editor => this.setState({editor})}
                                        value={this.state.editor}
                                    />
                                    <label htmlFor="editor">Éditeur</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="collection"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.collection ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.collections, 'label')}
                                        onChange={collection => this.setState({collection})}
                                        value={this.state.collection}
                                    />
                                    <label htmlFor="collection">Collection</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <input
                                        type="number" step="1"
                                        name="isbn"
                                        className={`form__input ${!!this.state.isbn ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({isbn: event.target.value})}/>
                                    <label htmlFor="isbn">ISBN</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="style"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.style ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.styles, 'label')}
                                        onChange={style => this.setState({style})}
                                        value={this.state.style}
                                    />
                                    <label htmlFor="collection">Style</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="location"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.location ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.locations)}
                                        onChange={location => this.setState({location})}
                                        value={this.state.location}
                                    />
                                    <label htmlFor="location">Localisation</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group input__group--small">
                                    <input
                                        type="number" min="0" step="0.01"
                                        name="price"
                                        className={`form__input ${!!this.state.price ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({price: event.target.value})}/>
                                    <label htmlFor="price">Prix</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <SingleDatePicker
                                        placeholder="test" monthFormat="MMMM YYYY"
                                        date={this.state.date} // momentPropTypes.momentObj or null
                                        onDateChange={date => this.setState({date})} // PropTypes.func.isRequired
                                        focused={this.state.focused} // PropTypes.bool
                                        onFocusChange={({focused}) => this.setState({focused})} // PropTypes.func.isRequired
                                        displayFormat="DD/MM/YYYY"
                                    />
                                    {/*<label htmlFor="date">Date d'achat</label>*/}
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group">
                                    <textarea
                                        name="comment"
                                        className={`form__input ${!!this.state.comment ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({comment: event.target.value})}/>
                                    <label htmlFor="cover">Commentaire</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <input
                                        type="url"
                                        name="cover"
                                        className={`form__input ${!!this.state.cover ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({cover: event.target.value})}/>
                                    <label htmlFor="cover">Url de couverture</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal__footer">
                        <a className="button" onClick={this.handleSubmit}>Enregister</a>
                        <a className="button" onClick={this.handleCloseButton}>
                            Annuler
                        </a>
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
    unselectBook: PropTypes.func.isRequired,
    selectedBook: PropTypes.object
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