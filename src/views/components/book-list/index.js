import React from 'react';
import classNames from "classnames";
import {PropTypes} from 'prop-types';
import {List} from 'immutable';
import BookItem from "../book-item/index";
import {CREATION_MODAL, LOAN_MODAL} from "../../../core/modal/variables";
import {Compass, Edit2, Trash2} from "react-feather";


class BookList extends React.Component {

    bookItems() {
        return this.props.books.map((book, index) => {
            return (
                <BookItem
                    deleteBook={this.props.deleteBook}
                    key={index}
                    book={book}
                    updateBook={this.props.updateBook}
                    selectBook={this.props.selectBook}
                    openModal={this.props.openModal}
                    selectBookForMobile={this.props.toggleMobileSelection}
                    mobileSelection={this.props.mobileSelection}
                />
            );
        });
    }

    render() {
        return (
            <div className="books__list">
                {this.bookItems()}
                <ul className="book__actions__mobile">
                    <li onClick={() => {
                        if (this.props.mobileSelection.size > 0) {
                            const book = this.props.mobileSelection.values().next().value;
                            this.props.deleteBook(book);
                            this.setState({selectedBooks: new Map()});
                        }
                    }} className={classNames({
                        'enabled': this.props.mobileSelection.size === 1,
                        'disabled': this.props.mobileSelection.size !== 1
                    })}>
                        <a><Trash2/></a></li>
                    <li onClick={() => {
                        if (this.props.mobileSelection.size === 1) {
                            const book = this.props.mobileSelection.values().next().value;
                            this.props.selectBook(book);
                            this.props.openModal(CREATION_MODAL);
                        }
                    }} className={classNames({
                        'enabled': this.props.mobileSelection.size === 1,
                        'disabled': this.props.mobileSelection.size !== 1
                    })}>
                        <a><Edit2/></a>
                    </li>
                    <li onClick={() => {
                        if (this.props.mobileSelection.size === 1) {
                            const book = this.props.mobileSelection.values().next().value;
                            this.props.selectBook(book);
                            this.props.openModal(LOAN_MODAL);
                        }
                    }} className={classNames({
                        'enabled': this.props.mobileSelection.size === 1,
                        'disabled': this.props.mobileSelection.size !== 1
                    })}><a><Compass/></a></li>
                </ul>
            </div>
        );
    }
}

BookList.propTypes = {
    deleteBook: PropTypes.func.isRequired,
    // deleteBooks: PropTypes.func.isRequired,
    books: PropTypes.instanceOf(List).isRequired,
    updateBook: PropTypes.func.isRequired,
    selectBook: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    mobilSelection: PropTypes.instanceOf(Map).isRequired,
    toggleMobileSelection: PropTypes.func.isRequired,
    resetMobileSelection: PropTypes.func.isRequired,
};

export default BookList;
