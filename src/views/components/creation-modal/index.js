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
import {getSelectedBook} from "../../../core/books/selectors";

import {mapToObj} from "../../../utils/utils"

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
            title: '',
            serie: '',
            tome: '',
            date: moment(),
            artists: [],
            authors: [],
            editor: '',
            collection: '',
            isbn: '',
            style: '',
            location: '',
            price: '',
            comment: '',
            cover: ''
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

    createAttributeIfNeeded(attr, labelKey, create) {
        if (!!attr.className) {
            return create({[labelKey]: attr[labelKey]})
                .then(key => ({key, [labelKey]: attr[labelKey]}));
        }
        return Promise.resolve(attr);
    }

    replaceUndefinedOrNull(key, value) {
        if (value === undefined || value === '') {
            return null;
        }
        return value;
    }

    cleanJson(jsonValues) {
        return JSON.parse(JSON.stringify(jsonValues, this.replaceUndefinedOrNull));
    }

    handleSubmit() {
        Promise.all(this.state.authors.map(author => this.createAttributeIfNeeded(author, 'name', this.props.createAuthor)))
            .then(authors => this.setState({authors}))
            .then(() => Promise.all(this.state.artists.map(artist => this.createAttributeIfNeeded(artist, 'name', this.props.createArtist))))
            .then(artists => this.setState({artists}))
            .then(() => this.createAttributeIfNeeded(this.state.serie, 'label', this.props.createSerie))
            .then(serie => this.setState({serie}))
            .then(() => this.createAttributeIfNeeded(this.state.style, 'label', this.props.createStyle))
            .then(style => this.setState({style}))
            .then(() => this.createAttributeIfNeeded(this.state.editor, 'name', this.props.createEditor))
            .then(editor => this.setState({editor}))
            .then(() => this.createAttributeIfNeeded(this.state.collection, 'label', this.props.createCollection))
            .then(collection => this.setState({collection}))
            .then(() => this.createAttributeIfNeeded(this.state.location, 'name', this.props.createLocation))
            .then(location => this.setState({location}))
            .then(() => {
                if (!!this.state.key) {
                    this.props.updateBook(this.props.selectedBook, this.cleanJson(this.state))
                } else {
                    this.props.createBook(this.cleanJson(this.state))
                }
            })
            .then(() => this.props.unselectBook())
            .then(() => {
                this.setState(this.initializeState());
                this.props.closeModal();
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedBook) {
            const selectedBook = mapToObj(nextProps.selectedBook);
            this.setState({...selectedBook, date: moment(selectedBook.date)});
        }
    }

    getAutocompleteData(recordList) {
        if (!recordList) {
            return [];
        }
        return recordList.reduce((acc, item, index) => acc.concat(item), [])
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
                                        value={this.state.title}
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
                                        options={this.getAutocompleteData(this.props.series)}
                                        onChange={serie => this.setState({serie})}
                                        value={this.state.serie}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="serie">Série</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group input__group--small">
                                    <input
                                        type="number" min="0" step="1"
                                        id="tome"
                                        className={`form__input ${!!this.state.tome ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({tome: event.target.value})}
                                        value={this.state.tome}
                                    />
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
                                        labelKey="name" valueKey="key"
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
                                        labelKey="name" valueKey="key"
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
                                        labelKey="name" valueKey="key"
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
                                        options={this.getAutocompleteData(this.props.collections)}
                                        onChange={collection => this.setState({collection})}
                                        value={this.state.collection}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="collection">Collection</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <input
                                        type="number" step="1"
                                        name="isbn"
                                        className={`form__input ${!!this.state.isbn ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({isbn: event.target.value})}
                                        value={this.state.isbn}
                                    />
                                    <label htmlFor="isbn">ISBN</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <Select.Creatable
                                        multi={false}
                                        name="style"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.style ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.styles)}
                                        onChange={style => this.setState({style})}
                                        value={this.state.style}
                                        labelKey="label" valueKey="key"
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
                                        labelKey="name" valueKey="key"
                                    />
                                    <label htmlFor="location">Localisation</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group input__group--small">
                                    <input
                                        type="number" min="0" step="0.01"
                                        name="price"
                                        className={`form__input ${!!this.state.price ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({price: event.target.value})}
                                        value={this.state.price}
                                    />
                                    <label htmlFor="price">Prix</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <SingleDatePicker
                                        placeholder="test" monthFormat="MMMM YYYY"
                                        date={this.state.date}
                                        onDateChange={date => this.setState({date})}
                                        focused={this.state.focused}
                                        onFocusChange={({focused}) => this.setState({focused})}
                                        displayFormat="DD/MM/YYYY"
                                    />
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group">
                                    <textarea
                                        name="comment"
                                        className={`form__input ${!!this.state.comment ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({comment: event.target.value})}
                                        value={this.state.comment || ''}
                                    />
                                    <label htmlFor="cover">Commentaire</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group">
                                    <input
                                        type="url"
                                        name="cover"
                                        className={`form__input ${!!this.state.cover ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({cover: event.target.value})}
                                        value={this.state.cover || ''}
                                    />
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
    updateBook: PropTypes.func.isRequired,
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
    getSelectedBook,
    getSeriesList,
    getAuthorsList,
    getArtistsList,
    getEditorsList,
    getCollectionsList,
    getStylesList,
    getLocationsList,
    (modal, selectedBook, series, authors, artists, editors, collections, styles, locations) => ({
        modal,
        series,
        authors,
        artists,
        editors,
        collections,
        styles,
        locations,
        selectedBook
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