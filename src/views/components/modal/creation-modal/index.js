import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import classNames from "classnames";
import {CameraOff} from 'react-feather';


import {getModal, modalActions} from "../../../../core/modal/index";
import {booksActions} from "../../../../core/books/index";
import {authorActions, getAuthorsList} from "../../../../core/authors/index";
import {artistActions, getArtistsList} from "../../../../core/artists/index";
import {getSeriesList, serieActions} from "../../../../core/serie/index";
import {editorActions, getEditorsList} from "../../../../core/editor/index";
import {collectionActions, getCollectionsList} from "../../../../core/collection/index";
import {getStylesList, styleActions} from "../../../../core/style/index";
import {getLocationsList, locationActions} from "../../../../core/location/index";
import {getSelectedBook} from "../../../../core/books/selectors";

import {mapToObj} from "../../../../utils/utils"
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
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
        this.validate = this.validate.bind(this);

        const book = this.props.selectedBook ? mapToObj(this.props.selectedBook) : this.initializeState();
        this.state = {...book, errors: {}}
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
        this.setState({errors: {}});
        this.props.unselectBook();
        this.props.closeModal();
    }

    validate() {
        return new Promise((resolve, reject) => {
            const errors = {};
            if (!this.state.title && (!this.state.serie)) {
                errors.title = "Le titre est obligatoire si l'entrée n'est pas une série.";
            }

            if (!this.state.authors.length) {
                errors.authors = "L'entrée doit comporter au moins un auteur.";
            }

            if (!!this.state.serie && !this.state.tome) {
                errors.serie = "Veuillez renseigner le numéro de série correspondant."
            }

            if (!this.state.serie && !!this.state.tome) {
                errors.tome = "Veuillez renseigner la série correspondante."
            }

            if (!!Object.keys(errors).length) {
                reject(errors);
            } else {
                resolve();
            }
        })
    }

    createAttributeIfNeeded(attr, create) {
        if (attr && !!attr.className) {
            return create({label: attr.label})
                .then(key => ({key, label: attr.label}));
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
        this.validate()
            .then(() => this.setState({errors: {}}))
            .then(() => Promise.all(this.state.authors.map(author => this.createAttributeIfNeeded(author, this.props.createAuthor))))
            .then(authors => this.setState({authors}))
            .then(() => Promise.all((this.state.artists || []).map(artist => this.createAttributeIfNeeded(artist, this.props.createArtist))))
            .then(artists => this.setState({artists}))
            .then(() => this.createAttributeIfNeeded(this.state.serie, this.props.createSerie))
            .then(serie => this.setState({serie}))
            .then(() => this.createAttributeIfNeeded(this.state.style, this.props.createStyle))
            .then(style => this.setState({style}))
            .then(() => this.createAttributeIfNeeded(this.state.editor, this.props.createEditor))
            .then(editor => this.setState({editor}))
            .then(() => this.createAttributeIfNeeded(this.state.collection, this.props.createCollection))
            .then(collection => this.setState({collection}))
            .then(() => this.createAttributeIfNeeded(this.state.location, this.props.createLocation))
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
            })
            .catch(errors => this.setState({errors}))
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
                onRequestClose={() => {
                    this.setState(this.initializeState());
                    this.props.closeModal();
                }}
                className="modal creation-modal"
                isOpen={this.props.modal.isOpen}>
                <div className="wrapper modal__wrapper">
                    <div className="modal__title">Ajouter un livre</div>
                    <div className="modal__content">
                        <form className="form creation-form">
                            <div className="form__group">
                                <div className="input__group input__group--full">
                                    <input
                                        type="text"
                                        id="title"
                                        className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': !!this.state.title,
                                            'form__input--has-error': !!this.state.errors.title
                                        })}
                                        value={this.state.title}
                                        onChange={(event) => this.setState({title: event.target.value})}/>
                                    <label htmlFor="title">Titre</label>
                                    <span className="form__input__border--focus"/>
                                    {this.state.errors.title &&
                                    <span className="form__input__error">{this.state.errors.title}</span>}
                                </div>
                                <div className="input__group input__group--two-third">
                                    <Select.Creatable
                                        multi={false}
                                        name="serie"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': !!this.state.serie,
                                            'form__input--has-error': !!this.state.errors.serie
                                        })}
                                        options={this.getAutocompleteData(this.props.series)}
                                        onChange={serie => this.setState({serie})}
                                        value={this.state.serie}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="serie">Série</label>
                                    <span className="form__input__border--focus"/>
                                    {this.state.errors.serie &&
                                    <span className="form__input__error">{this.state.errors.serie}</span>}
                                </div>
                                <div className="input__group input__group--third">
                                    <input
                                        type="number" min="0" step="1"
                                        id="tome"
                                        className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': !!this.state.tome,
                                            'form__input--has-error': !!this.state.errors.tome
                                        })}
                                        onChange={(event) => this.setState({tome: event.target.value})}
                                        value={this.state.tome || undefined}
                                    />
                                    <label htmlFor="tome">Tome</label>
                                    <span className="form__input__border--focus"/>
                                    {this.state.errors.tome &&
                                    <span className="form__input__error">{this.state.errors.tome}</span>}
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group input__group--full">
                                    <Select.Creatable
                                        multi={true}
                                        name="authors"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': this.state.authors.length > 0,
                                            'form__input--has-error': !!this.state.errors.authors
                                        })}
                                        options={this.getAutocompleteData(this.props.authors)}
                                        onChange={authors => this.setState({authors})}
                                        value={this.state.authors}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="authors">Auteur(s)</label>
                                    <span className="form__input__border--focus"/>
                                    {this.state.errors.authors &&
                                    <span className="form__input__error">{this.state.errors.authors}</span>}
                                </div>
                                <div className="input__group  input__group--full">
                                    <Select.Creatable
                                        multi={true}
                                        name="artists"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.artists && this.state.artists.length > 0 ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.artists)}
                                        onChange={artists => this.setState({artists})}
                                        value={this.state.artists}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="artists">Artiste</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group input__group--half">
                                    <Select.Creatable
                                        multi={false}
                                        name="editor"
                                        menuContainerStyle={{'zIndex': 999}}
                                        className={`form__input ${this.state.editor ? 'form__input--has-content' : ''}`}
                                        options={this.getAutocompleteData(this.props.editors)}
                                        onChange={editor => this.setState({editor})}
                                        value={this.state.editor}
                                        labelKey="label" valueKey="key"
                                    />
                                    <label htmlFor="editor">Éditeur</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group input__group--half">
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
                                <div className="input__group input__group--full">
                                    <input
                                        type="url"
                                        name="cover" id="cover"
                                        className={`form__input ${!!this.state.cover ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({cover: event.target.value})}
                                        value={this.state.cover || ''}
                                    />
                                    <label htmlFor="cover">Url de couverture</label>
                                    <span className="form__input__border--focus"/>
                                </div>
                                <div className="input__group__subgroup input__group--two-third">
                                    <div className="input__group input__group--half">
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
                                    <div className="input__group input__group--half">
                                        <input
                                            type="number" min="0" step="0.01"
                                            name="price"
                                            className={`form__input ${!!this.state.price ? 'form__input--has-content' : ''}`}
                                            onChange={(event) => this.setState({price: event.target.value})}
                                            value={this.state.price || undefined}
                                        />
                                        <label htmlFor="price">Prix</label>
                                        <span className="form__input__border--focus"/>
                                    </div>
                                    <div className="input__group input__group--half">
                                        <input
                                            type="number" step="1"
                                            name="isbn"
                                            className={`form__input ${!!this.state.isbn ? 'form__input--has-content' : ''}`}
                                            onChange={(event) => this.setState({isbn: event.target.value})}
                                            value={this.state.isbn || undefined}
                                        />
                                        <label htmlFor="isbn">ISBN</label>
                                        <span className="form__input__border--focus"/>
                                    </div>
                                    <div className="input__group input__group--half">
                                        <div className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': !!this.state.date,
                                        })}>
                                            <DatePicker
                                                className={classNames({
                                                    'form__input': true,
                                                    'form__input--has-content': !!this.state.date,
                                                })}
                                                selected={moment(this.state.date)}
                                                onChange={date => this.setState({date})}
                                                locale="fr"
                                                dateFormat="DD/MM/YYYY"
                                                popperClassName="some-custom-class"
                                                popperPlacement="top-end"
                                                popperModifiers={{
                                                    offset: {
                                                        enabled: true,
                                                        offset: '5px, 10px'
                                                    },
                                                    preventOverflow: {
                                                        enabled: true,
                                                        escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
                                                        boundariesElement: 'viewport'
                                                    }
                                                }}
                                            />
                                        </div>

                                        <label htmlFor="isbn">Date d'achat</label>
                                        <span className="form__input__border--focus"/>
                                    </div>
                                </div>
                                <div className="input__group__subgroup input__group--third">
                                    <div className="cover__thumbnail">
                                        {this.state.cover ? <img src={this.state.cover} alt="thumbnail"/> : <CameraOff/>}
                                    </div>
                                </div>
                            </div>

                            <div className="form__group">
                                <div className="input__group input__group--full">
                                    <textarea
                                        name="comment" rows="5"
                                        className={`form__input ${!!this.state.comment ? 'form__input--has-content' : ''}`}
                                        onChange={(event) => this.setState({comment: event.target.value})}
                                        value={this.state.comment || ''}
                                    />
                                    <label htmlFor="cover">Commentaire</label>
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