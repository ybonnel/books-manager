import React from 'react';
import {PropTypes} from 'prop-types';
import {List} from 'immutable';
import BookItem from "../book-item/index";


function BookList({deleteBook, books, updateBook, showItem}) {
    let bookItems = books.map((book, index) => {
        return (
            <BookItem
                deleteBook={deleteBook}
                key={index}
                book={book}
                updateBook={updateBook}
                showItem={showItem}
            />
        );
    });

    return (
        <div className="row book-list">
            {bookItems}
        </div>
    );
}

BookList.propTypes = {
    deleteBook: PropTypes.func.isRequired,
    books: PropTypes.instanceOf(List).isRequired,
    updateBook: PropTypes.func.isRequired
};

export default BookList;
