import {List} from "immutable";
import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";

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
import BookFilters from "../../components/book-filters/index";
import {LetterSelector} from "../../components/letter-selector"
import BookButtons from "../../components/book-buttons";
import BookList from "../../components/book-list";
import CreationModal from "../../components/creation-modal/index";
import BookModal from "../../components/book-modal/index";

import "../../styles/books.css";

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
        openDetailModal: PropTypes.func.isRequired
    };

    componentWillMount() {
        this.props.loadBooks();
        this.props.loadAuthors();
        this.props.loadArtists();
        this.props.loadSeries();
        this.props.loadCollections();
        this.props.loadLocations();
        this.props.loadStyles();
        this.props.loadEditors();
        this.props.filterBooks(this.props.location.query.filter);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.query.filter !== this.props.location.query.filter) {
            this.props.filterBooks(nextProps.location.query.filter);
        }
    }

    componentWillUnmount() {
        this.props.unloadBooks();
    }

    openModal() {
        this.props.openModal()
    }

    selectAndSeeBook(book) {
        this.props.selectBook(book);
        this.props.openDetailModal();
    }

    selectAndUpdate(book) {
        this.props.loadBook(book);
        this.props.openModal();
    }

    render() {
        return (
            <div className="g-row">
                <div className="g-col">
                    <BookButtons openModal={this.props.openModal}/>
                </div>

                <div className="g-col">
                    <BookFilters filter={this.props.filterType}/>
                    <LetterSelector filter={this.props.filterBooks}/>
                    <BookList
                        deleteBook={this.props.deleteBook}
                        books={this.props.books}
                        updateBook={book => this.selectAndUpdate(book)}
                        showItem={(book) => this.selectAndSeeBook(book)}
                        unselectItem={this.props.unselectBook}
                    />
                    <CreationModal />
                    <BookModal />
                </div>

            </div>
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
    (notification, filterType, books, modal) => ({
        notification,
        filterType,
        books,
        modal
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Books);
