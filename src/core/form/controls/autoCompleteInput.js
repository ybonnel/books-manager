import React, {PropTypes} from 'react';
import cn from 'classnames';
import omit from 'lodash/omit';
import Autosuggest from 'react-autosuggest';

import {getErrors, getIconColor, getLabelClassName} from '../helpers/inputHelpers'

const autosuggestTheme = {
    suggestionsContainer: {
        position: 'absolute',
        zIndex: 100
    },
    suggestionsList: 'autocomplete-content dropdown-content'
};

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value, list) {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('\\b' + escapedValue, 'i');

    return list.filter(person => regex.test(defaultAutosuggest.getSuggestionValue(person)));
}

const defaultAutosuggest = {
    renderSuggestion: ({name}, {isHighlighted, query}) => {
        return <span className={`${isHighlighted ? 'highlighted' : ''}`}>{name}</span>;
    },
    onSuggestionsFetchRequested: () => {
    },
    onSuggestionsClearRequested: () => {
    },
    getSuggestionValue: ({name}) => name
};

const AutocompleteInput = (props) => {
    const fieldClass = cn('input-field', props.className);
    const errors = getErrors(props);
    const iconColor = getIconColor(props);
    const inputClassName = cn('autocomplete', 'validate', {
        'invalid': errors.length
    });
    const labelClassName = getLabelClassName(props, errors);
    const autosuggestProps = Object.assign({
        theme: Object.assign({
            input: inputClassName
        }, autosuggestTheme),
        onSuggestionSelected: (event, {suggestionValue}) => props.onChange(suggestionValue),
        onSuggestionsFetchRequested: ({value}) => {
            this.setState({
                suggestions: getSuggestions(value, props.autosuggestProps.suggestions)
            });
        },
    }, defaultAutosuggest, omit(props.autosuggestProps, ['inputProps']));

    const inputProps = Object.assign({
        onChange: props.onChange,
        onFocus: props.onFocus,
        onBlur: props.onBlur,
        onKeyPress: props.onKeyPress,
        value: props.value,
        id: props.id,
        className: inputClassName
    }, props.inputProps);

    return (
        <div className={fieldClass}>
            {
                (() => {
                    if (props.iconPrefix) {
                        const PrefixIcon = props.iconFactory(props.iconPrefix);
                        return <PrefixIcon className="prefix" color={iconColor} style={{left: 0}}/>
                    }
                })()
            }
            <Autosuggest {...autosuggestProps} inputProps={inputProps}/>
            <input type="text" style={{display: 'none'}} className={inputClassName}/>
            <label htmlFor={props.id} className={labelClassName} style={{pointerEvents: 'none'}}
                   data-error={errors}>{props.placeholder}</label>
        </div>
    )
};

AutocompleteInput.propTypes = {
    innerState: PropTypes.object.isRequired,
    iconPrefix: PropTypes.string,
    iconFactory: PropTypes.func,
    messages: PropTypes.object,
    autosuggestProps: PropTypes.object
};

export default AutocompleteInput