import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {Eye, EyeOff, Edit2, Trash2, Compass} from 'react-feather';
import classNames from "classnames";


import {Book} from "../../../core/books";

import './boookItem.css';
import '../../styles/card.css'
import {CREATION_MODAL, LOAN_MODAL} from "../../../core/modal/variables";


class BookItem extends Component {
    static propTypes = {
        book: PropTypes.instanceOf(Book).isRequired,
        selectBookForMobile: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {toggle: false};
    }

    buildTitle() {
        const {book} = this.props;
        if (book.serie && book.serie.label) {
            return (
                <div className="card__right__header">
                    <h2 className="book__title">{book.serie.label} {book.isSpecialIssue ? 'H.S. ' : ''}{book.tome ? `Tome ${book.tome}` : ''}</h2>
                    {book.title && <div className="book__subtitle"><p>{book.title}</p></div>}
                </div>
            );
        }
        return (
            <div className="card__right__header">
                <h2 className="book__title">{book.title}</h2>
            </div>
        )
    }

    handleSelect(book) {
        this.props.selectBookForMobile(book)
    }

    render() {
        const {book} = this.props;
        return (
            <div key={book.key}
                 className={classNames({
                     'books__list__item book': true,
                     'card': true,
                     'toggled': this.state.toggle,
                     'selected': this.props.mobileSelection.get(book.key)
                 })}>
                <div className="book-selector" onClick={() => this.handleSelect(book)}/>
                <div className="card__left">
                    <img className="book__cover"
                         src={`${book.cover ? book.cover : 'https://lorempixel.com/100/190/cats'}`}
                         alt="couverture"/>
                    {this.state.toggle ? book.location &&
                        <div className="book__location"><p>{book.location.label}</p></div> :
                        book.style && <div className="book__style"><p>{book.style.label}</p></div>}

                </div>
                <div className="card__right book__informations">
                    {this.buildTitle()}
                    <div className="separator"/>
                    <div className="card__right__content">
                        <div className="book__authors">
                            {book.authors.map((author, index) =>
                                <div className="badge" key={index}>{author.label}</div>)}
                        </div>
                        <div className="book__artists">
                            {book.artists && book.artists.map((artist, index) =>
                                <div className="badge" key={index}>{artist.label}</div>)}
                        </div>

                    </div>
                    <ul className="book__actions">
                        <li onClick={() => this.setState({toggle: !this.state.toggle})}>
                            <a>{this.state.toggle ? <EyeOff/> : <Eye/>}</a>
                        </li>
                        <li onClick={() => this.props.deleteBook(book)}>
                            <a><Trash2/></a></li>
                        <li onClick={() => {
                            this.props.selectBook(book);
                            this.props.openModal(CREATION_MODAL);
                        }}>
                            <a><Edit2/></a>
                        </li>
                        <li onClick={() => {
                            this.props.selectBook(book);
                            this.props.openModal(LOAN_MODAL);
                        }}><a><Compass/></a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default BookItem;
