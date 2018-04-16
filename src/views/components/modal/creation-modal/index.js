import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import Modal from 'react-modal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import classNames from "classnames";
import {CameraOff, Repeat, X, Search} from 'react-feather';
import {Loading} from '../../loading';
import {DragDropContext} from 'react-beautiful-dnd';

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

import {Column} from '../../multi-drag/column';
import {multiDragAwareReorder, multiSelectTo as multiSelect, withNewCreatorIds} from '../../multi-drag/dragUtils';
import {MultiDragContainer} from "../../multi-drag/wrappers";

import {mapToObj, fetchWithRetry, arrayToObj, trimWithoutPonctuation} from "../../../../utils/utils"

import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import './creation-modal.css';
import '../../../styles/modal.css'

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
        this.handleLookUp = this.handleLookUp.bind(this);
        this.getBookInformations = this.getBookInformations.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.multiSelectTo = this.multiSelectTo.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
        this.toggleSelectionInGroup = this.toggleSelectionInGroup.bind(this);
        this.findEntry = this.findEntry.bind(this);
        this.deleteCreator = this.deleteCreator.bind(this);

        const book = this.props.selectedBook ? mapToObj(this.props.selectedBook) : this.initializeState();
        this.state = {...book, errors: {}}
    }

    initializeState() {
        return {
            title: '',
            serie: undefined,
            tome: '',
            date: moment(),
            artists: [],
            authors: [],
            editor: undefined,
            collection: undefined,
            isbn: '',
            style: undefined,
            location: undefined,
            price: '',
            comment: '',
            cover: undefined,
            loading: false
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

    createOrUpdateSerie() {
        if (!this.state.serie) {
            return Promise.resolve(this.state.serie)
        }

        if (this.state.serie && !!this.state.serie.className) {
            const serie = {
                label: this.state.serie.label,
                styles: this.state.style ? [mapToObj(this.state.style)] : [],
                maxTome: this.state.tome
            };

            return this.props.createSerie(serie)
                .then(key => ({key, ...serie}));
        } else {
            const mods = {};
            if (Number(this.state.serie.maxTome) < Number(this.state.tome)) {
                mods.maxTome = this.state.tome;
            }
            if (this.state.serie.styles.every(style => style.key !== this.state.style.key)) {
                mods.styles = [...this.state.serie.styles, {key: this.state.style.key, label: this.state.style.label}];
            }
            if (Object.keys(mods).length > 0) {
                this.props.updateSerie(this.state.serie, mods);
            }
        }
        return Promise.resolve(this.state.serie);
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
            .then(() => this.createAttributeIfNeeded(this.state.style, this.props.createStyle))
            .then(style => this.setState({style}))
            .then(() => this.createOrUpdateSerie())
            .then(serie => this.setState({serie}))
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
            .catch(errors => {
                console.log(errors);
                this.setState({errors})
            })
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
        return recordList.reduce((acc, item) => acc.concat(item), [])
    }

    handleLookUp(event) {
        if (event.type === 'keydown' && event.keyCode !== 13) {
            return;
        }

        const searchedIsbn = this.searchInput.value;
        if (searchedIsbn.length !== 13) {
            this.setState({
                loading: false,
                error: {
                    error: undefined,
                    message: 'un isbn = 13 chiffres !!!'
                },
                searchedIsbn
            });
            return;
        }


        this.setState({loading: true, error: undefined});
        fetchWithRetry(process.env.REACT_APP_AWS_ITEM_LOOKUP_URL, 500, 3, {
            method: 'POST',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({"isbn": searchedIsbn})
        })
            .then(result => {
                const bookAwsInfo = this.getBookInformations(result[0]);
                const choices = this.makeChoices(bookAwsInfo);
                this.setState({
                    searchedIsbn,
                    loading: false,
                    choicesWindow: true,
                    bookAwsInfo,
                    choices,
                    entities: choices.creatorsChoice,
                    draggingCreatorId: null,
                    selectedCreatorIds: []
                });
            })
            .catch((error) => {
                console.error(error);
                this.setState({
                    loading: false,
                    error: {
                        error,
                        message: 'Désolé, une erreur est survenue lors de la recherche d\'information. Si le problème persiste, ouvrez la fenêtre et criez tres fort, qui sait ?'
                    }
                });
            })
    }

    makeChoices(info) {
        let serie, tome, title;
        const awsTitle = info.title.match(/(.+)\W+(Tome|T|t|tome)[\D\s]?([0-9]+)\s?\W*(.*)/);
        serie = awsTitle ? awsTitle[1] : undefined;
        tome = awsTitle ? awsTitle[3] : undefined;
        title = awsTitle ? awsTitle[4] : info.title;
        const authors = (info.authors || []).map((name, idx) => ({id: `author-${idx}`, label: name}));
        const artists = (info.artists || []).map((name, idx) => ({id: `artist-${idx}`, label: name}));

        return {
            serie: serie && trimWithoutPonctuation(serie),
            tome,
            title: title && trimWithoutPonctuation(title),
            creatorsChoice: {
                columnOrder: ['authors', 'artists'],
                columns: {
                    authors: {
                        id: 'authors',
                        title: 'Auteurs',
                        creatorIds: authors.map(auth => auth.id)
                    },
                    artists: {
                        id: 'artists',
                        title: 'Artistes',
                        creatorIds: artists.map(art => art.id)
                    }
                },
                creators: {...arrayToObj(authors, 'id'), ...arrayToObj(artists, 'id')}
            }
        };
    }


    getBookInformations(awsResult) {
        const info = awsResult.ItemAttributes[0];
        const title = Array.isArray(info.Title) ? info.Title[0] : info.Title;
        const price = info.ListPrice[0].Amount / 100;
        const editor = Array.isArray(info.Studio) ? info.Studio[0] : info.Studio;
        const cover = awsResult.LargeImage[0].URL[0];

        let artists, authors;
        if (info.Creator) {
            const creator = info.Creator.filter(item => !item.$.Role.toUpperCase().includes('ILLUSTRATION')).map(item => item._);
            const author = info.Author || [];
            authors = [...creator, ...author];
            artists = info.Creator.filter(item => item.$.Role.toUpperCase().includes('ILLUSTRATION')).map(item => item._);
        } else {
            authors = info.Author;
        }

        return {title, price, editor, authors, artists, cover};
    }

    onDragStart(start) {
        const id = start.draggableId;
        const selected = this.state.selectedCreatorIds.find(creatorId => creatorId === id);

        // if dragging an item that is not selected - unselect all items
        if (!selected) {
            this.setState({
                selectedCreatorIds: [],
            });
        }
        this.setState({
            draggingCreatorId: start.draggableId,
        });
    }

    onDragEnd(result) {
        const destination = result.destination;
        const source = result.source;

        // nothing to do
        if (!destination || result.reason === 'CANCEL') {
            this.setState({
                draggingCreatorId: null,
            });
            return;
        }

        const processed = multiDragAwareReorder({
            entities: this.state.entities,
            selectedCreatorIds: this.state.selectedCreatorIds,
            source,
            destination,
        });

        this.setState({
            ...processed,
            draggingCreatorId: null,
        });
    }

    toggleSelection(creatorId) {
        const selectedCreatorIds = this.state.selectedCreatorIds;
        const wasSelected = selectedCreatorIds.includes(creatorId);

        const newCreatorIds = (() => {
            // Creator was not previously selected
            // now will be the only selected item
            if (!wasSelected) {
                return [creatorId];
            }

            // Creator was part of a selected group
            // will now become the only selected item
            if (selectedCreatorIds.length > 1) {
                return [creatorId];
            }

            // creator was previously selected but not in a group
            // we will now clear the selection
            return [];
        })();

        this.setState({
            selectedCreatorIds: newCreatorIds,
        });
    }

    toggleSelectionInGroup(creatorId) {
        const selectedCreatorIds = this.state.selectedCreatorIds;
        const index = selectedCreatorIds.indexOf(creatorId);

        // if not selected - add it to the selected items
        if (index === -1) {
            this.setState({
                selectedCreatorIds: [...selectedCreatorIds, creatorId],
            });
            return;
        }

        // it was previously selected and now needs to be removed from the group
        const shallow = [...selectedCreatorIds];
        shallow.splice(index, 1);
        this.setState({
            selectedCreatorIds: shallow,
        });
    }

    multiSelectTo(newCreatorId) {
        const updated = multiSelect(
            this.state.entities,
            this.state.selectedCreatorIds,
            newCreatorId
        );

        if (updated == null) {
            return;
        }

        this.setState({
            selectedCreatorIds: updated,
        });
    }

    deleteCreator(creatorId, columnId) {
        const column = this.state.entities.columns[columnId];
        const creatorIds = column.creatorIds.filter(id => id !== creatorId);

        const entities = {
            ...this.state.entities,
            columns: {
                ...this.state.entities.columns,
                [columnId]: withNewCreatorIds(column, creatorIds),
            },
        };

        this.setState({entities});
    }

    findEntry(entry, list) {
        if (!entry) {
            return undefined;
        }

        const item = this.getAutocompleteData(list)
            .find(item => item.label.toUpperCase() === entry.toUpperCase());

        if (!item) {
            return {label: entry, className: 'need to create'};
        }
        return item;
    }

    render() {
        if (this.state.loading) {
            return (
                <Modal className="modal modal__loading"
                       isOpen={this.props.modal.isOpen}>
                    <Loading/>
                </Modal>
            )
        }

        if (this.state.choicesWindow && this.state.choices) {
            const entities = this.state.entities;
            const selected = this.state.selectedCreatorIds;

            const getCreators = (entities, columnId) => entities.columns[columnId].creatorIds
                .map(creatorId => entities.creators[creatorId]);

            return (
                <Modal className="modal choices-modal"
                       isOpen={this.props.modal.isOpen}>
                    <div className="wrapper modal__wrapper">
                        <div className="modal__title">Modifier les informations à importer</div>
                        <div className="modal__content">
                            <div className="form__group--full">
                                <div className="choices__results form__group form__group--full">
                                    {this.state.choices.title &&
                                    <div className="input__group input__group--full">
                                        <input
                                            type="text"
                                            id="choice-title"
                                            className={classNames({
                                                'form__input': true,
                                                'form__input--has-content': !!this.state.choices.title,
                                            })}
                                            value={this.state.choices.title}
                                            onChange={(event) => this.setState({
                                                choices: {
                                                    ...this.state.choices,
                                                    title: event.target.value
                                                }
                                            })}/>
                                        <label htmlFor="choice-title">Titre</label>
                                        <span className="form__input__border--focus"/>
                                    </div>}
                                    {this.state.choices.serie &&
                                    <div className="input__group input__group--two-third">
                                        <input
                                            type="text"
                                            id="choice-serie"
                                            className={classNames({
                                                'form__input': true,
                                                'form__input--has-content': !!this.state.choices.serie,
                                            })}
                                            value={this.state.choices.serie}
                                            onChange={(event) => this.setState({
                                                choices: {
                                                    ...this.state.choices,
                                                    serie: event.target.value
                                                }
                                            })}/>
                                        <label htmlFor="choice-serie">Serie</label>
                                        <span className="form__input__border--focus"/>
                                    </div>}
                                    {this.state.choices.tome &&
                                    <div className="input__group input__group--third">
                                        <input
                                            type="number"
                                            step="1" min="0"
                                            id="choice-tome"
                                            className={classNames({
                                                'form__input': true,
                                                'form__input--has-content': !!this.state.choices.tome,
                                            })}
                                            value={this.state.choices.tome}
                                            onChange={(event) => this.setState({
                                                choices: {
                                                    ...this.state.choices,
                                                    tome: event.target.value
                                                }
                                            })}/>
                                        <label htmlFor="choice-tome">Tome</label>
                                        <span className="form__input__border--focus"/>
                                    </div>}
                                </div>
                            </div>
                            <div className="creator__choice">
                                <DragDropContext
                                    onDragStart={this.onDragStart}
                                    onDragEnd={this.onDragEnd}
                                >
                                    <MultiDragContainer className="creator__choice__container">
                                        {this.state.entities.columnOrder.map((columnId, idx) => (
                                            [
                                                <Column
                                                    column={entities.columns[columnId]}
                                                    creators={getCreators(entities, columnId)}
                                                    selectedCreatorIds={selected}
                                                    key={columnId}
                                                    draggingCreatorId={this.state.draggingCreatorId}
                                                    toggleSelection={this.toggleSelection}
                                                    toggleSelectionInGroup={this.toggleSelectionInGroup}
                                                    multiSelectTo={this.multiSelectTo}
                                                    deleteCreator={creatorId => this.deleteCreator(creatorId, columnId)}
                                                />,
                                                idx === 0 && <Repeat key={`repeat${idx}`} className="icon"/>
                                            ]
                                        ))}
                                    </MultiDragContainer>
                                </DragDropContext>
                            </div>
                        </div>
                    </div>
                    <div className="modal__footer">
                        <a className="button" onClick={() => {
                            const serie = this.findEntry(this.state.choices.serie, this.props.series);
                            this.setState({
                                title: this.state.choices.title || '',
                                serie,
                                style: serie && serie.styles ? serie.styles[0] : undefined,
                                tome: this.state.choices.tome || '',
                                artists: this.state.entities.columns.artists.creatorIds.map(id => this.findEntry(this.state.entities.creators[id].label, this.props.artists)),
                                authors: this.state.entities.columns.authors.creatorIds.map(id => this.findEntry(this.state.entities.creators[id].label, this.props.authors)),
                                editor: this.findEntry(this.state.bookAwsInfo.editor, this.props.editors),
                                price: this.state.bookAwsInfo.price || '',
                                cover: this.state.bookAwsInfo.cover || '',
                                isbn: this.state.searchedIsbn,
                                choicesWindow: false
                            })
                        }}>Importer</a>
                        <a className="button" onClick={() => this.setState({choicesWindow: false})}>Annuler</a>
                    </div>
                </Modal>
            )
        }

        return (
            <Modal
                onRequestClose={() => {
                    this.setState(this.initializeState());
                    this.props.closeModal();
                }}
                className="modal creation-modal"
                isOpen={this.props.modal.isOpen}>
                <div className="wrapper modal__wrapper">
                    <div className="modal__title__wrapper">
                        <div className="modal__title">Ajouter un livre</div>
                        <div className="search__wrapper">
                            <div className="search__box__icon__wrapper">
                                <Search className="search__box__icon"/>
                            </div>
                            <input type="text" required className="search__box form__input"
                                   autoFocus
                                   placeholder="Rechercher par isbn"
                                   ref={ref => this.searchInput = ref}
                                   onKeyDown={this.handleLookUp}/>
                            <span className="form__input__border--focus"/>
                            <X className="clear__search" onClick={() => this.searchInput.value = ''}/>
                        </div>
                        <a className="button" onClick={this.handleLookUp}>Rechercher</a>
                    </div>
                    {this.state.error && <div>{this.state.error.message}</div>}
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
                                        className={classNames({
                                            'form__input': true,
                                            'form__input--has-content': !!this.state.serie,
                                            'form__input--has-error': !!this.state.errors.serie
                                        })}
                                        options={this.getAutocompleteData(this.props.series)}
                                        onChange={serie => this.setState({serie})}
                                        value={this.state.serie}
                                        labelKey="label" valueKey="key"
                                        promptTextCreator={label => `Créer la série ${label}`}
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
                                        value={this.state.tome}
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
                                        promptTextCreator={label => `Créer l'auteur ${label}`}
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
                                        promptTextCreator={label => `Créer l'artiste ${label}`}
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
                                        promptTextCreator={label => `Créer l'éditeur ${label}`}
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
                                        promptTextCreator={label => `Créer la collection ${label}`}
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
                                            promptTextCreator={label => `Créer le style ${label}`}
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
                                            value={this.state.price}
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
                                            value={this.state.isbn}
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
                                        {this.state.cover ? <img src={this.state.cover} alt="thumbnail"/> :
                                            <CameraOff/>}
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
    updateSerie: PropTypes.func.isRequired,
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