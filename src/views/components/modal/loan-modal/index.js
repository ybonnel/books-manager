import 'react-dates/initialize';
import React from "react";
import {PropTypes} from 'prop-types';
import {connect} from "react-redux";
import {createSelector} from "reselect";
import Modal from 'react-modal';
import Select from 'react-select';


import {getModal, modalActions} from "../../../../core/modal/index";
import {booksActions} from "../../../../core/books/index";
import {getLocationsList, locationActions} from "../../../../core/location/index";
import {getSelectedBook} from "../../../../core/books/selectors";

import {mapToObj} from "../../../../utils/utils"
import 'react-select/dist/react-select.css';
import './loan-modal.css';

class LoanModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleCloseButton = this.handleCloseButton.bind(this);
        this.handleRetrieve = this.handleRetrieve.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.replaceUndefinedOrNull = this.replaceUndefinedOrNull.bind(this);
        this.getAutocompleteData = this.getAutocompleteData.bind(this);

        const book = this.props.selectedBook;
        this.state = {key: book.key, location: book.location}
    }

    handleCloseButton(e) {
        e.preventDefault();
        this.setState({key: null, location: null});
        this.props.unselectBook();
        this.props.closeModal();
    }

    handleRetrieve() {
        this.setState({location: undefined}, this.handleSubmit);
        // this.handleSubmit();
    }

    createAttributeIfNeeded(attr, labelKey, create) {
        if (!!attr && !!attr.className) {
            return create({[labelKey]: attr[labelKey]})
                .then(key => ({key, [labelKey]: attr[labelKey]}));
        }
        return Promise.resolve(attr);
    }

    replaceUndefinedOrNull(key, value) {
        if (value === undefined || value === '') {
            return null;
        }
        return value;
    }

    cleanJson(jsonValues) {
        return JSON.parse(JSON.stringify(jsonValues, this.replaceUndefinedOrNull));
    }

    handleSubmit() {
        this.createAttributeIfNeeded(this.state.location, 'name', this.props.createLocation)
            .then(location => this.setState({location}))
            .then(() => this.props.updateBook(this.props.selectedBook, this.cleanJson(this.state)))
            .then(() => this.props.unselectBook())
            .then(() => {
                this.setState({key: null, location: null});
                this.props.closeModal();
            })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedBook) {
            const selectedBook = mapToObj(nextProps.selectedBook);
            this.setState({key: selectedBook.key, location: selectedBook.location});
        }
    }

    getAutocompleteData(recordList) {
        if (!recordList) {
            return [];
        }

        return recordList.reduce((acc, item, index) => acc.concat(item), [])
    }

    getTitle() {
        if (!this.props.selectedBook) {
            return null;
        }

        if (this.props.selectedBook.serie) {
            return `${this.props.selectedBook.serie.label} - tome ${this.props.selectedBook.tome}`;
        }
        return this.props.selectedBook.title
    }

    render() {
        return (
            <Modal
                onRequestClose={() => {
                    this.setState({key: null, location: null});
                    this.props.closeModal();
                }}
                className="modal creation-modal"
                isOpen={this.props.modal.isOpen}>
                <div className="wrapper modal__wrapper">
                    <div className="modal__title">Prêter {this.getTitle()}</div>
                    <div className="modal__content">
                        <form className="form loan-form">
                            <div className="input__group input__group--half">
                                <Select.Creatable
                                    multi={false}
                                    name="location"
                                    className={`form__input ${this.state.location ? 'form__input--has-content' : ''}`}
                                    options={this.getAutocompleteData(this.props.locations)}
                                    onChange={location => this.setState({location, modified: true})}
                                    value={this.state.location}
                                    labelKey="name" valueKey="key"
                                />
                                <label htmlFor="location">Location</label>
                                <span className="form__input__border--focus"/>
                            </div>
                        </form>
                    </div>
                    <div className="modal__footer">
                        {this.props.selectedBook && this.props.selectedBook.location ?
                            <a className="button" onClick={this.handleRetrieve}>Récupérer</a> : undefined}
                        <a className="button"
                           onClick={this.handleSubmit}>Prêter</a>
                        <a className="button" onClick={this.handleCloseButton}>
                            Annuler
                        </a>
                    </div>
                </div>
            </Modal>
        )
    }
}

LoanModal.propTypes = {
    modal: PropTypes.shape({isOpen: PropTypes.bool.isRequired}).isRequired,
    closeModal: PropTypes.func.isRequired,
    updateBook: PropTypes.func.isRequired,
    createLocation: PropTypes.func.isRequired,
    unselectBook: PropTypes.func.isRequired
};

const mapStateToProps = createSelector(
    getModal,
    getSelectedBook,
    getLocationsList,
    (modal, selectedBook, locations) => ({
        modal,
        locations,
        selectedBook
    })
);

const mapDispatchToProps = Object.assign(
    {},
    modalActions,
    booksActions,
    locationActions
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoanModal);