import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {booksActions} from '../../../core/books';
const data = {
    // used to populate "account" reducer when "Load" is clicked
    title: 'Jane',
    style: {key: '1', label: 'Doe'},
    serie: {key: 1, label: 'test'},
    tome: 1,
    isbn: 'toto'
};

const renderField = ({ input, label, type, meta: { touched, error }, id, className }) => {
    return <div className={`input-field ${className}`}>
        <label htmlFor={id} className='active'>{label}</label>
        <input {...input} placeholder={label} className={`validate ${touched && error ? 'invalid' : 'valid'}`}
               type={type} id={id} />
        {touched && error && <span>{error}</span>}
    </div>
}

let BookForm = props => {
    const { handleSubmit, load, pristine, reset, submitting } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <button type="button" onClick={() => load(data)}>Load Account</button>
            </div>
            <Field name="title" id="title" component={renderField} className="col s9" type="text"
                   label="Titre" />
            <Field name="style.label" id="style" component={renderField} className="col s3"
                   type="text" label="Style"
                   validate={() => 'error'}
                   getItemValue={item => item.label} />
            <div className="row">
                <Field name="serie.label" id="serie" component={renderField}
                       className="col s6"
                       type="text" label="Série"
                       getItemValue={item => item.label} />
                <Field name="tome" id="tome" component={renderField} className="col s3"
                       type="number" label="Tome" />
                <Field name="isbn" id="isbn" component={renderField} className="col s3"
                       type="text" label="ISBN" />
            </div>
            <div>
                <button type="submit" disabled={pristine || submitting}>Submit</button>
                <button type="button" disabled={pristine || submitting} onClick={reset}>
                    Undo Changes
                </button>
            </div>
        </form>
    );
};

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
BookForm = reduxForm({
    form: 'book-form', // a unique identifier for this form
})(BookForm);

// You have to connect() to any reducers that you wish to connect to yourself
BookForm = connect(
    state => ({
        initialValues: state.books.bookToUpdate, // pull initial values from account reducer
    }),
    { load: booksActions.loadBook }, // bind account loading action creator
)(BookForm);

export default BookForm;
