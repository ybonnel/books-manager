import React from 'react';
import {PropTypes} from 'prop-types';
import classNames from "classnames";
import Popover from 'react-popover';

import {SORT_OPTIONS} from '../../../core/books'

import './books-sorters.css';


class BookSorters extends React.Component {
    constructor(props) {
        super(props);

        this.handleSort = this.handleSort.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
        this.getSortOptionLabel = this.getSortOptionLabel.bind(this);
        this.state = {
            popoverIsOpen: false
        }
    }

    togglePopover() {
        const popoverIsOpen = !this.state.popoverIsOpen;
        this.setState({
            popoverIsOpen
        })
    }

    handleSort(event) {
        const chosenSortOption = event.target.getAttribute('data-sort');
        if (chosenSortOption !== this.props.sortOption) {
            event.target.classList.toggle("selected");

            this.props.sort(chosenSortOption);
        }
    }

    getSortOptionLabel(option) {
        switch (option) {
            case SORT_OPTIONS.SERIE:
                return 'Série';
            case SORT_OPTIONS.TITLE:
                return 'Titre';
            case SORT_OPTIONS.DATE:
                return 'Date';
            default:
                return undefined;
        }
    }


    render() {
        const popoverProps = {
            isOpen: this.state.popoverIsOpen,
            preferPlace: 'below',
            place: 'below',
            onOuterAction: () => this.togglePopover(false),
            className: 'popover__books__sorters',
            body: <div className="books__sorters">
                {Object.keys(SORT_OPTIONS).map(OPTION => {
                    return <a key={OPTION} className={classNames({
                        button: true,
                        'button--sorter': true,
                        selected: this.props.sortOption === SORT_OPTIONS[OPTION]
                    })} data-sort={SORT_OPTIONS[OPTION]}
                              onClick={this.handleSort}>{this.getSortOptionLabel(SORT_OPTIONS[OPTION])}</a>
                })}
            </div>
        };

        return (
            <Popover {...popoverProps}>
                <div className={classNames({
                    'popover__button': true,
                    'popover__button--open': this.state.popoverIsOpen
                })}>
                    <a className='button' onClick={this.togglePopover}>Trier</a>
                </div>
            </Popover>
        )
    }
}

BookSorters.propTypes = {
    sort: PropTypes.func.isRequired,
    sortOption: PropTypes.string.isRequired
};

export default BookSorters;
