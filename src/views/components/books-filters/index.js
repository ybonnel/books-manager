import React from 'react';
import {PropTypes} from 'prop-types';
import classNames from "classnames";

import {ALL, IN, OUT} from "../../../core/books";

import './books-filters.css';


class BookFilters extends React.Component {
    constructor(props) {
        super(props);

        this.handleFilter = this.handleFilter.bind(this);
        this.state = {filter: ALL}
    }

    handleFilter(event) {
        event.target.classList.toggle("selected");


        const filter = event.target.getAttribute('data-filter');
        this.setState({filter});
        this.props.filter(filter)
    }

    render() {
        return (
            <ul className="books__filters">
                <li className="filter">
                    <a className={classNames({
                        button: true,
                        selected: this.state.filter === ALL
                    })} data-filter={ALL} onClick={this.handleFilter}>View All</a>
                </li>
                <li className="filter">
                    <a className={classNames({
                        button: true,
                        selected: this.state.filter === IN
                    })} data-filter={IN} onClick={this.handleFilter}>Present</a>
                </li>
                <li className="filter">
                    <a className={classNames({
                        button: true,
                        selected: this.state.filter === OUT
                    })} data-filter={OUT} onClick={this.handleFilter}>Loaned</a>
                </li>
            </ul>
        );
    }
}

BookFilters.propTypes = {
    filter: PropTypes.func.isRequired
};

export default BookFilters;
