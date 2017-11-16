import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {Eye, EyeOff, Edit2, Trash2, Compass} from 'react-feather';


import {Book} from "../../../core/books";

import './boookItem.css';
import '../../styles/card.css'


class BookItem extends Component {
    static propTypes = {
        book: PropTypes.instanceOf(Book).isRequired
    };

    constructor(props, context) {
        super(props, context);
        this.state = {toggle: false};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.book !== this.props.book ||
            nextState.toggle !== this.state.toggle;
    }

    buildTitle() {
        const {book} = this.props;
        if (book.serie && book.serie.label) {
            return (
                <div className="card__right__header">
                    <h2 className="book__title">{book.serie.label} Tome {book.tome}</h2>
                    {book.title && <div className="book__subtitle">{book.title}</div>}
                </div>
            );
        }
        return (
            <div className="card__right__header">
                <h2 className="book__title">{book.title}</h2>
            </div>
        )
    }

    render() {
        const {book} = this.props;

        return (
            <div className={`books__list__item book card ${this.state.toggle ? 'toggled' : ''}`} key={book.key}>
                <div className="card__left">
                    <img className="book__cover"
                         src={`${book.cover ? book.cover : 'https://lorempixel.com/100/190/cats'}`}
                         alt="couverture"/>
                    {this.state.toggle ? <div className="book__location"><p>{book.location.name}</p></div> :
                        <div className="book__style"><p>{book.style.label}</p></div>}

                </div>
                <div className="card__right book__informations">
                    {this.buildTitle()}
                    <div className="separator"/>
                    <div className="card__right__content">
                        <div className="book__authors">
                            {book.authors.map((author, index) =>
                                <div className="badge" key={index}>{author.name}</div>)}
                        </div>
                        <div className="book__artists">
                            {book.artists.map((artist, index) =>
                                <div className="badge" key={index}>{artist.name}</div>)}
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
                            this.props.openModal();
                        }}>
                            <a><Edit2/></a>
                        </li>
                        <li><a><Compass/></a></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default BookItem;
