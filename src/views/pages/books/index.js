import {List} from "immutable";
import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {withRouter} from 'react-router-dom';
import {PlusSquare} from 'react-feather';

import {getNotification, notificationActions} from "../../../core/notification";
import {booksActions, getBookFilter, getVisibleBooks} from "../../../core/books/index";
import {authorActions} from "../../../core/authors/index";
import {artistActions} from "../../../core/artists/index";
import {serieActions} from "../../../core/serie/index";
import {locationActions} from "../../../core/location/index";
import {styleActions} from "../../../core/style/index";
import {collectionActions} from "../../../core/collection/index";
import {editorActions} from "../../../core/editor/index";
import {getModal, modalActions} from "../../../core/modal/index";

import BookList from "../../components/book-list";
import CreationModal from "../../components/creation-modal";

import {isAuthenticated} from "../../../core/auth/selectors";
import "./books.css";
import "../../styles/buttons.css"

export class Books extends Component {
    static propTypes = {
        createBook: PropTypes.func.isRequired,
        deleteBook: PropTypes.func.isRequired,
        dismissNotification: PropTypes.func.isRequired,
        filterBooks: PropTypes.func.isRequired,
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
        undeleteBook: PropTypes.func.isRequired,
        unloadBooks: PropTypes.func.isRequired,
        updateBook: PropTypes.func.isRequired,
        selectBook: PropTypes.func.isRequired,
        loadBook: PropTypes.func.isRequired,
        unselectBook: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.selectForUpdate = this.selectForUpdate.bind(this);
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

    render() {
        return (
            <section className="books">
                <div className="wrapper">
                    <h1 className="books__header">Books</h1>
                    <div className="books__actions">
                        <a className="button button__icon" onClick={this.props.openModal}>
                            <PlusSquare/>
                            Ajouter un Livre
                        </a>
                    </div>
                    <CreationModal/>
                    <BookList
                        deleteBook={this.props.deleteBook}
                        books={this.props.books}
                        updateBook={book => this.selectForUpdate(book)}
                        selectBook={this.props.selectBook}
                        openModal={this.props.openModal}
                    />
                </div>
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
    getModal,
    isAuthenticated,
    (notification, filterType, books, modal, isAuthenticated) => ({
        notification,
        filterType,
        books,
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
