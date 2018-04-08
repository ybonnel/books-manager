import React from 'react';
import {PropTypes} from 'prop-types';
import classNames from "classnames";
import Popover from 'react-popover'

import {FILTERS} from "../../../core/books";

import './books-filters.css';


class BookFilters extends React.Component {
    constructor(props) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
        this.getFilterLabel = this.getFilterLabel.bind(this);
        this.state = {
            filter: this.props.currentFilter,
            popoverIsOpen: false
        }
    }

    togglePopover() {
        const popoverIsOpen = !this.state.popoverIsOpen;
        this.setState({
            popoverIsOpen
        })
    }

    handleFilter(event) {
        const chosenFilter = event.target.getAttribute('data-filter');
        if (this.props.currentFilter !== chosenFilter) {
            event.target.classList.toggle("selected");

            this.props.filter(chosenFilter)
        }
    }

    getFilterLabel(filter) {
        switch (filter) {
            case FILTERS.ALL:
                return 'Tous';
            case FILTERS.IN:
                return 'Présent';
            case FILTERS.OUT:
                return 'En prêt';
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
            className: 'popover__books__filters',
            body: <div className="books__filters">
                {Object.keys(FILTERS).map(FILTER => {
                    return <div className="filter">
                        <a key={FILTER} className={classNames({
                            button: true,
                            'button--filter': true,
                            selected: this.props.currentFilter === FILTERS[FILTER]
                        })} data-filter={FILTERS[FILTER]} onClick={this.handleFilter}>{this.getFilterLabel(FILTERS[FILTER])}</a>
                    </div>
                })}
            </div>
        };

        return (
            <Popover {...popoverProps}>
                <div className={classNames({
                    'popover__button': true,
                    'popover__button--open': this.state.popoverIsOpen
                })}>
                    <a className='button' onClick={this.togglePopover}>Filtrer</a>
                </div>
            </Popover>
        )
    }
}

BookFilters.propTypes = {
    filter: PropTypes.func.isRequired,
    currentFilter: PropTypes.string.isRequired
};

export default BookFilters;
