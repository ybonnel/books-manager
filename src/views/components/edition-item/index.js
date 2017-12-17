import React from 'react';
import {PropTypes} from 'prop-types';
import classNames from 'classnames';

import {Trash2, Edit2, X} from 'react-feather';

import './edition-item.css';


class EditionItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        deleteItem: PropTypes.func.isRequired,
        updateItem: PropTypes.func.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {editing: false};

        this.delete = this.delete.bind(this);
        this.editItem = this.editItem.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.stopEditing = this.stopEditing.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.item !== this.props.item ||
            nextState.editing !== this.state.editing;
    }

    delete() {
        if (this.props.count === 0) {
            this.props.deleteItem(this.props.item);
        }
    }

    editItem() {
        this.setState({editing: true});
    }

    saveItem(event) {
        if (this.state.editing) {
            const label = event.target.value.trim();

            if (label.length && label !== this.props.item.label) {
                this.props.updateItem(this.props.item, {label});
            }

            this.stopEditing();
        }
    }

    stopEditing() {
        this.setState({editing: false});
    }

    onKeyUp(event) {
        if (event.keyCode === 13) {
            this.saveItem(event);
        }
        else if (event.keyCode === 27) {
            this.stopEditing();
        }
    }

    renderTitle(item) {
        return (
            <div
                className="edition-item__label"
                ref={c => this.titleText = c}
                tabIndex="0">{`${item.label} (${this.props.count})`}
            </div>
        );
    }

    renderTitleInput(item) {
        return (
            <input
                autoComplete="off"
                autoFocus
                className="edition-item__input form__input"
                defaultValue={item.label || item.name}
                onBlur={this.saveItem}
                onKeyUp={this.onKeyUp}
                ref={c => this.titleInput = c}
                type="text"
            />
        );
    }

    render() {
        const {editing} = this.state;
        const {item} = this.props;

        return (
            <div className="edition-item" tabIndex="0">

                <div className="edition-item__cell__label">
                    {editing ? this.renderTitleInput(item) : this.renderTitle(item)}
                </div>

                <div className="edition-item__cell__actions">
                    <button
                        aria-hidden={!editing}
                        aria-label="Cancel editing"
                        className={classNames('button button__icon button__icon--alone  edition-item__button', {'hide': !editing})}
                        onClick={this.stopEditing}
                        type="button">
                        <X/>
                    </button>
                    <button
                        aria-hidden={editing}
                        aria-label="Edit task"
                        className={classNames('button button__icon button__icon--alone edition-item__button', {'hide': editing})}
                        onClick={this.editItem}
                        ref={c => this.editButton = c}
                        type="button">
                        <Edit2/>
                    </button>
                    <button
                        aria-hidden={editing}
                        aria-label="Delete task"
                        className={classNames('button button__icon button__icon--alone edition-item__button',
                            {'hide': editing, 'button--disabled': !!this.props.count})}
                        onClick={this.delete}
                        ref={c => this.deleteButton = c}
                        type="button">
                        <Trash2/>
                    </button>
                </div>
            </div>
        );
    }
}

export default EditionItem;
