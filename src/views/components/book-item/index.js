import React, {Component} from "react";
import {PropTypes} from 'prop-types';
import {Book} from "../../../core/books";


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

    buildheader() {
        const result = [];
        const {book} = this.props;
        if (book.serie && book.serie.label) {
            result.push(book.serie.label);
            result.push('-');
            result.push(book.tome);
        }

        if (book.title) {
            if (result.length) {
                result.push('-');
            }
            result.push(book.title);
        }
        return result.join(' ');
    }

    render() {
        const {book} = this.props;

        return (
            <div className="col s12 m4 l3" key={book.key}>
                <div className="card horizontal">
                    <div className="card-image">
                        <img src={`${book.cover ? book.cover : 'https://lorempixel.com/100/190/nature/6'}`} alt="couverture"/>
                    </div>
                    <div className="card-stacked">
                        <div className="card-content book">
                            <div className="book-header">
                                {this.buildheader()}
                            </div>
                            <div className="book-authors">
                                <div
                                    className="authors">{book.authors.reduce((acc, author, index) => acc.concat(author.name), []).join(', ')}{book.artists ? ' - ' : ''}</div>
                                <div
                                    className="artists">{book.artists.reduce((acc, author, index) => acc.concat(author.name), []).join(', ')}</div>
                            </div>
                            <div className="book-informations">
                                <div className="book-editor">
                                    {book.editor.name}
                                    {book.collection && book.editor ? ', ' : ''}
                                    {book.collection.label}
                                </div>
                                <div className="book-style">{book.style.label}</div>
                                <div className="book-location">{book.location.name}</div>
                            </div>
                        </div>
                        <div className="card-action right-align">
                            <a onClick={() => this.showItem()}>Voir</a>
                            <a onClick={() => this.props.updateBook(this.props.book)}>Modifier</a>
                            <a onClick={() => this.props.deleteBook(this.props.book)}>Supprimer</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BookItem;
