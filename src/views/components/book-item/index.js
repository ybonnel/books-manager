import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import { Eye, Edit2, Trash2, Share } from 'react-feather';


import {Book} from "../../../core/books";

import './boookItem.css';
import '../../styles/card.css'


class BookItem extends Component {
    static propTypes = {
        deleteBook: PropTypes.func.isRequired,
        book: PropTypes.instanceOf(Book).isRequired,
        updateBook: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.book !== this.props.book ||
            nextState.editing !== this.state.editing;
    }

    delete() {
        this.props.deleteBook(this.props.book);
    }

    showItem() {
        this.props.showItem(this.props.book);
    }

    editTitle() {
        this.setState({editing: true});
    }

    saveTitle(event) {
        if (this.state.editing) {
            const {book} = this.props;
            const title = event.target.value.trim();

            if (title.length && title !== book.title) {
                this.props.updateBook(book, {title});
            }

            this.stopEditing();
        }
    }

    stopEditing() {
        this.setState({editing: false});
    }

    toggleStatus() {
        let checked = !this.props.book.completed;
        this.props.updateBook(this.props.book, {completed: checked});
    }

    onKeyUp(event) {
        if (event.keyCode === 13) {
            this.saveTitle(event);
        }
        else if (event.keyCode === 27) {
            this.stopEditing();
        }
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
            <div className="books__list__item book card" key={book.key}>
                <div className="card__left">
                    <img className="book__cover" src={`${book.cover ? book.cover : 'https://lorempixel.com/100/190/cats'}`}
                         alt="couverture"/>
                    <div className="book__location">{book.location.name}</div>

                </div>
                <div className="card__right book__informations">
                    {this.buildTitle()}
                    <div className="separator"/>
                    <div className="card__right__content">
                        <div className="card__right__part">
                            <div className="book__authors">{book.authors.reduce((acc, author, index) => acc.concat(author.name), []).join(', ')}</div>
                            <div className="book__style">{book.style.label}</div>
                        </div>
                        <div className="card__right__part">
                            <div className="book__artists">{book.artists.reduce((acc, author, index) => acc.concat(author.name), []).join(', ')}</div>
                            <div className="book__editor">{book.editor.name}</div>
                            <div className="book__collection">{book.collection.label}</div>
                        </div>
                    </div>
                    <ul className="book__actions">
                        <li><a><Eye/></a></li>
                        <li><a><Trash2/></a></li>
                        <li><a><Edit2/></a></li>
                        <li><a><Share/></a></li>
                    </ul>
                </div>

                {/*<div className="book__actions">*/}
                    {/*<a onClick={() => this.showItem()}>Voir</a>*/}
                    {/*<a onClick={() => this.props.updateBook(this.props.book)}>Modifier</a>*/}
                    {/*<a onClick={() => this.props.deleteBook(this.props.book)}>Supprimer</a>*/}
                    {/*<a onClick={() => console.debug(`pret: ${this.props.book}`)}>Preter</a>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default BookItem;
