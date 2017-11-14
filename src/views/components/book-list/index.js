import React from 'react';
import {PropTypes} from 'prop-types';
import {List} from 'immutable';
import BookItem from "../book-item/index";


function BookList({deleteBook, books, updateBook, showItem, selectBook, openModal}) {
    let bookItems = books.map((book, index) => {
        return (
            <BookItem
                deleteBook={deleteBook}
                key={index}
                book={book}
                updateBook={updateBook}
                showItem={showItem}
                selectBook={selectBook}
                openModal={openModal}
            />
        );
    });

    return (
        <div className="books__list">
            {bookItems}
        </div>
    );
}

BookList.propTypes = {
    deleteBook: PropTypes.func.isRequired,
    books: PropTypes.instanceOf(List).isRequired,
    updateBook: PropTypes.func.isRequired,
    selectBook: PropTypes.func.isRequired
};

export default BookList;
