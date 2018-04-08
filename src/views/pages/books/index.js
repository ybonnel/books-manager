import {List} from "immutable";
import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {withRouter} from 'react-router-dom';
import {PlusSquare, Search, X} from 'react-feather';
import MediaQuery from 'react-responsive';

import {getNotification, notificationActions} from "../../../core/notification";
import {authorActions} from "../../../core/authors";
import {artistActions} from "../../../core/artists";
import {serieActions} from "../../../core/serie";
import {locationActions} from "../../../core/location";
import {styleActions} from "../../../core/style";
import {collectionActions} from "../../../core/collection";
import {editorActions} from "../../../core/editor";
import {getModal, modalActions} from "../../../core/modal";
import {isAuthenticated} from "../../../core/auth/selectors";
import {CREATION_MODAL} from "../../../core/modal/variables";
import {booksActions, getBookFilter, getVisibleBooks, getBookSearch, getBookSort, getMobileSelection} from "../../../core/books";

import BookList from "../../components/book-list";
import BookFilters from "../../components/books-filters";
import BookSorters from "../../components/books-sorters";
import Modal from "../../components/modal";
import Notification from "../../components/notification/index";

import * as constants from "../../../utils/constants";

import "./books.css";
import "../../styles/buttons.css";

export class Books extends Component {
    static propTypes = {
        createBook: PropTypes.func.isRequired,
        deleteBook: PropTypes.func.isRequired,
        dismissNotification: PropTypes.func.isRequired,
        filterBooks: PropTypes.func.isRequired,
        sortBooks: PropTypes.func.isRequired,
        filterType: PropTypes.string.isRequired,
        loadBooks: PropTypes.func.isRequired,
        loadAuthors: PropTypes.func.isRequired,
        loadArtists: PropTypes.func.isRequired,
        loadSeries: PropTypes.func.isRequired,
        loadLocations: PropTypes.func.isRequired,
        loadStyles: PropTypes.func.isRequired,
        loadCollections: PropTypes.func.isRequired,
        loadEditors: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        notification: PropTypes.object,
        books: PropTypes.instanceOf(List).isRequired,
        mobileSelection: PropTypes.instanceOf(Map).isRequired,
        undeleteBook: PropTypes.func.isRequired,
        unloadBooks: PropTypes.func.isRequired,
        updateBook: PropTypes.func.isRequired,
        selectBook: PropTypes.func.isRequired,
        toggleMobileSelection: PropTypes.func.isRequired,
        resetMobileSelection: PropTypes.func.isRequired,
        loadBook: PropTypes.func.isRequired,
        unselectBook: PropTypes.func.isRequired,
        searchBooks: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.selectForUpdate = this.selectForUpdate.bind(this);
        this.renderNotification = this.renderNotification.bind(this);
        this.handleClearSearch = this.handleClearSearch.bind(this);
    }

    componentWillMount() {
        this.props.loadBooks();
        this.props.loadAuthors();
        this.props.loadArtists();
        this.props.loadSeries();
        this.props.loadCollections();
        this.props.loadLocations();
        this.props.loadStyles();
        this.props.loadEditors();
    }

    componentWillUnmount() {
        this.props.unloadBooks();
    }

    selectForUpdate(book) {
        this.props.loadBook(book);
        this.props.openModal();
    }

    renderNotification() {
        const {notification} = this.props;
        return (
            <Notification
                action={this.props.undeleteBook}
                actionLabel={notification.actionLabel}
                dismiss={this.props.dismissNotification}
                display={notification.display}
                message={notification.message}
            />
        );
    }

    handleClearSearch() {
        this.searchInput.value = '';
        this.props.searchBooks('');
    }

    render() {
        return (
            <section className="books">
                <div className="wrapper">
                    <h1 className="books__header">Books</h1>
                    <div className="books__actions">
                        <MediaQuery query={constants.minNavigationMobileBreakpoint}>
                            <a className="button button__icon button--add"
                               onClick={() => this.props.openModal(CREATION_MODAL)}>
                                <PlusSquare/>
                                Ajouter un Livre
                            </a>
                        </MediaQuery>
                        <div className="search__wrapper">
                            <div className="search__box__icon__wrapper">
                                <Search className="search__box__icon"/>
                            </div>
                            <input type="text" required className="search__box form__input"
                                   placeholder="Rechercher un livre"
                                   ref={ref => this.searchInput = ref}
                                   onChange={event => this.props.searchBooks(event.target.value)}/>
                            <span className="form__input__border--focus"/>
                                <X className="clear__search" onClick={this.handleClearSearch}/>
                        </div>
                        <BookSorters sort={this.props.sortBooks} sortOption={this.props.sortOption}/>
                        <BookFilters filter={this.props.filterBooks} currentFilter={this.props.filterType}/>

                    </div>
                    <Modal/>
                    <BookList
                        deleteBook={this.props.deleteBook}
                        books={this.props.books}
                        updateBook={book => this.selectForUpdate(book)}
                        selectBook={this.props.selectBook}
                        openModal={this.props.openModal}
                        mobileSelection={this.props.mobileSelection}
                        toggleMobileSelection={this.props.toggleMobileSelection}
                        resetMobileSelection={this.props.resetMobileSelection}
                        search={this.props.search}
                        openCreationModal={() => this.props.openModal(CREATION_MODAL)}
                    />
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
    getBookFilter,
    getVisibleBooks,
    getMobileSelection,
    getModal,
    isAuthenticated,
    getBookSearch,
    getBookSort,
    (notification, filterType, books, mobileSelection, modal, isAuthenticated, search, sortOption) => ({
        notification,
        filterType,
        books,
        mobileSelection,
        modal,
        isAuthenticated,
        search,
        sortOption
    })
);

const mapDispatchToProps = Object.assign(
    {},
    booksActions,
    authorActions,
    artistActions,
    serieActions,
    collectionActions,
    locationActions,
    styleActions,
    editorActions,
    notificationActions,
    modalActions
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Books));
