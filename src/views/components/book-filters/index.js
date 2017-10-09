// import classNames from 'classnames';
import React from 'react';
import {PropTypes} from 'prop-types';
// import { Link } from 'react-router';


function BookFilters({filter}) {
  return (
    <ul className="task-filters">
      {/*<li><Link className={classNames({active: !filter})} to="/">View All</Link></li>*/}
      {/*<li><Link activeClassName="active" to={{pathname: '/', query: {filter: 'active'}}}>Active</Link></li>*/}
      {/*<li><Link activeClassName="active" to={{pathname: '/', query: {filter: 'completed'}}}>Completed</Link></li>*/}
    </ul>
  );
}

BookFilters.propTypes = {
  filter: PropTypes.string
};

export default BookFilters;
