import React from 'react';
import {PropTypes} from 'prop-types';
import {IN, OUT, ALL} from "../../../core/books";


class BookFilters extends React.Component {
    constructor(props) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
    }

    handleFilter(event) {
        event.target.classList.toggle("selected");
        this.props.filter(event.target.getAttribute('data-filter'))
    }

    render() {
        return (
            <ul className="book-filters">
                <li><a className="button" data-filter={ALL} onClick={this.handleFilter}>View All</a></li>
                <li><a className="button" data-filter={IN} onClick={this.handleFilter}>Present</a></li>
                <li><a className="button" data-filter={OUT} onClick={this.handleFilter}>Loaned</a></li>
            </ul>
        );
    }
}

BookFilters.propTypes = {
    filter: PropTypes.func.isRequired
};

export default BookFilters;
