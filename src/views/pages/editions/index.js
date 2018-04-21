import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {withRouter} from 'react-router-dom';
import {List} from "immutable";
import Pagination from 'react-paginate';
import {ArrowLeft, ArrowRight, Search} from 'react-feather';

import {getNotification, notificationActions} from "../../../core/notification";
import {booksActions, getVisibleBooks} from "../../../core/books/index";
import {authorActions, getAuthorsList} from "../../../core/authors/index";
import {artistActions, getArtistsList} from "../../../core/artists/index";
import {serieActions, getSeriesList} from "../../../core/serie/index";
import {locationActions, getLocationsList} from "../../../core/location/index";
import {styleActions, getStylesList} from "../../../core/style/index";
import {collectionActions, getCollectionsList} from "../../../core/collection/index";
import {editorActions, getEditorsList} from "../../../core/editor/index";
import {getModal, modalActions} from "../../../core/modal/index";
import {isAuthenticated} from "../../../core/auth/selectors";

import Notification from "../../components/notification/index";
import EditionItem from "../../components/edition-item/index";

import "./editions.css";

const PAGE_NUMBER = 10;

export class Editions extends Component {
    static propTypes = {
        dismissNotification: PropTypes.func.isRequired,
        authors: PropTypes.instanceOf(List).isRequired,
        artists: PropTypes.instanceOf(List).isRequired,
        series: PropTypes.instanceOf(List).isRequired,
        editors: PropTypes.instanceOf(List).isRequired,
        collections: PropTypes.instanceOf(List).isRequired,
        styles: PropTypes.instanceOf(List).isRequired,
        locations: PropTypes.instanceOf(List).isRequired,
        loadAuthors: PropTypes.func.isRequired,
        updateAuthor: PropTypes.func.isRequired,
        deleteAuthor: PropTypes.func.isRequired,
        undeleteAuthor: PropTypes.func.isRequired,
        loadArtists: PropTypes.func.isRequired,
        updateArtist: PropTypes.func.isRequired,
        deleteArtist: PropTypes.func.isRequired,
        undeleteArtist: PropTypes.func.isRequired,
        loadSeries: PropTypes.func.isRequired,
        updateSerie: PropTypes.func.isRequired,
        deleteSerie: PropTypes.func.isRequired,
        undeleteSerie: PropTypes.func.isRequired,
        loadLocations: PropTypes.func.isRequired,
        updateLocation: PropTypes.func.isRequired,
        deleteLocation: PropTypes.func.isRequired,
        undeleteLocation: PropTypes.func.isRequired,
        loadStyles: PropTypes.func.isRequired,
        updateStyle: PropTypes.func.isRequired,
        deleteStyle: PropTypes.func.isRequired,
        undeleteStyle: PropTypes.func.isRequired,
        loadCollections: PropTypes.func.isRequired,
        updateCollection: PropTypes.func.isRequired,
        deleteCollection: PropTypes.func.isRequired,
        undeleteCollection: PropTypes.func.isRequired,
        loadEditors: PropTypes.func.isRequired,
        updateEditor: PropTypes.func.isRequired,
        deleteEditor: PropTypes.func.isRequired,
        undeleteEditor: PropTypes.func.isRequired,
        notification: PropTypes.object,
        isAuthenticated: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.renderNotification = this.renderNotification.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.dispatchUpdateToBook = this.dispatchUpdateToBook.bind(this);
        this.getCount = this.getCount.bind(this);

        this.state = {filter: '', offset: 0}
    }

    renderNotification() {
        const {notification} = this.props;
        return (
            <Notification
                action={this.undeleteItem}
                actionLabel={notification.actionLabel}
                dismiss={this.props.dismissNotification}
                display={notification.display}
                message={notification.message}
            />
        );
    }

    componentWillMount() {
        this.props.loadBooks();
        this.props.loadAuthors();
        this.props.loadArtists();
        this.props.loadSeries();
        this.props.loadEditors();
        this.props.loadCollections();
        this.props.loadStyles();
        this.props.loadLocations();
    }

    handlePageClick(data) {
        this.setState({offset: data.selected * PAGE_NUMBER})
    }

    dispatchUpdateToBook(updateMethod, label, attribute, changes, isArray) {
        updateMethod(attribute, changes)
            .then(() => this.props.books.map(book => {
                    if (book[label]) {
                        if (isArray) {
                            if (book[label].some(item => item.key === attribute.key)) {
                                const collection = book[label].filter(item => item.key !== attribute.key);
                                this.props.updateBook(book, {[label]: [{key: attribute.key, ...changes}, ...collection]})
                            }
                        } else {
                            if (book[label].key === attribute.key) {
                                this.props.updateBook(book, {[label]: {key: attribute.key, ...changes}})
                            }
                        }
                    }
                    return null;
                })
            )
    }

    getCount(key) {
        return this.props.books.reduce((count, book) => {
            if (book[this.property]) {
                if (this.isArray && book[this.property].some(item => item.key === key)) {
                    return count + 1
                } else if (book[this.property].key === key) {
                    return count + 1;
                }
            }
            return count
        }, 0)
    }

    render() {
        if (!this.props.location.hash) {
            //todo: redirect to 404
            return <div>WHAAAT</div>
        }

        const edition = this.props.location.hash.replace('#', '');

        switch (edition) {
            case 'author':
                this.label = 'Auteurs';
                this.property = 'authors';
                this.isArray = true;
                this.list = this.props.authors;
                this.updateItem = (author, changes) => this.dispatchUpdateToBook(this.props.updateAuthor, 'authors', author, changes, true);
                this.deleteItem = this.props.deleteAuthor;
                this.undeleteItem = this.props.undeleteAuthor;
                break;
            case 'artist':
                this.label = 'Artistes';
                this.property = 'artists';
                this.isArray = true;
                this.list = this.props.artists;
                this.updateItem = (artist, changes) => this.dispatchUpdateToBook(this.props.updateArtist, 'artists', artist, changes, true);
                this.deleteItem = this.props.deleteArtist;
                this.undeleteItem = this.props.undeleteArtist;
                break;
            case 'serie':
                this.label = 'Series';
                this.property = 'serie';
                this.isArray = false;
                this.list = this.props.series;
                this.updateItem = (serie, changes) => this.dispatchUpdateToBook(this.props.updateSerie, 'serie', serie, changes);
                this.deleteItem = this.props.deleteSerie;
                this.undeleteItem = this.props.undeleteSerie;
                break;
            case 'editor':
                this.label = 'Editeurs';
                this.property = 'editor';
                this.isArray = false;
                this.list = this.props.editors;
                this.updateItem = (editor, changes) => this.dispatchUpdateToBook(this.props.updateEditor, 'editor', editor, changes);
                this.deleteItem = this.props.deleteEditor;
                this.undeleteItem = this.props.undeleteEditor;
                break;
            case 'collection':
                this.label = 'Collections';
                this.property = 'collection';
                this.isArray = false;
                this.list = this.props.collections;
                this.updateItem = (collection, changes) => this.dispatchUpdateToBook(this.props.updateCollection, 'collection', collection, changes);
                this.deleteItem = this.props.deleteCollection;
                this.undeleteItem = this.props.undeleteCollection;
                break;
            case 'style':
                this.label = 'Styles';
                this.property = 'style';
                this.isArray = false;
                this.list = this.props.styles;
                this.updateItem = (style, changes) => this.dispatchUpdateToBook(this.props.updateStyle, 'style', style, changes);
                this.deleteItem = this.props.deleteStyle;
                this.undeleteItem = this.props.undeleteStyle;
                break;
            case 'location':
                this.label = 'Localisations';
                this.property = 'location';
                this.isArray = false;
                this.list = this.props.locations;
                this.updateItem = (location, changes) => this.dispatchUpdateToBook(this.props.updateLocation, 'location', location, changes);
                this.deleteItem = this.props.deleteLocation;
                this.undeleteItem = this.props.undeleteLocation;
                break;
            default:
                break;
        }

        if (!this.list.size) {
            return 'no list';
        }

        const filteredList = this.list
            .filter(item => item.label.trim().toUpperCase().includes(this.state.filter.toUpperCase()));
        return (
            <section className="edition">
                <div className="wrapper">
                    <h1 className="edition__header">{this.label}</h1>

                    <div className="search">
                        <input type="text" className="search__input"
                               onChange={event => this.setState({filter: event.target.value})}/>
                        <span className="search__icon"><Search/></span>
                    </div>
                    {
                        filteredList
                            .slice(this.state.offset, this.state.offset + PAGE_NUMBER)
                            .sort((item1, item2) => item1.label > item2.label)
                            .map((attr) => {
                                return (
                                    <EditionItem item={attr} key={attr.key} deleteItem={this.deleteItem}
                                                 updateItem={this.updateItem} count={this.getCount(attr.key)}/>
                                )
                            })
                    }
                    <Pagination previousLabel={<ArrowLeft/>}
                                nextLabel={<ArrowRight/>}
                                breakLabel='...'
                                breakClassName={"break"}
                                pageCount={Math.ceil(filteredList.size / PAGE_NUMBER)}
                                marginPagesDisplayed={1}
                                pageRangeDisplayed={5}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination"}
                                pageClassName={"page-selector"}
                                activeClassName={"active"}/>
                </div>
                {this.props.notification.display ? this.renderNotification() : null}
            </section>
        );
    }
}


//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = createSelector(
    getNotification,
    getAuthorsList,
    getArtistsList,
    getSeriesList,
    getEditorsList,
    getCollectionsList,
    getStylesList,
    getLocationsList,
    getModal,
    isAuthenticated,
    getVisibleBooks,
    (notification, authors, artists, series, editors, collections, styles, locations, modal, isAuthenticated, books) => ({
        notification,
        books,
        authors,
        artists,
        series,
        editors,
        collections,
        styles,
        locations,
        modal,
        isAuthenticated
    })
);

const mapDispatchToProps = Object.assign(
    {},
    booksActions,
    authorActions,
    artistActions,
    serieActions,
    editorActions,
    collectionActions,
    styleActions,
    locationActions,
    notificationActions,
    modalActions
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Editions));
