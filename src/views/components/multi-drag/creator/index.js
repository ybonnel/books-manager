import React from 'react';
import {PropTypes} from "prop-types";
import {Draggable} from "react-beautiful-dnd";
import {Trash2} from 'react-feather';

import {DragItem, SelectionCount} from "../wrappers";

import './creator.css';

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;
const keyCodes = {
    enter: 13,
    escape: 27,
    arrowDown: 40,
    arrowUp: 38,
    tab: 9,
};

export class Creator extends React.Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.performAction = this.performAction.bind(this);
    }

    onKeyDown(event, provided, snapshot) {
        if (provided.dragHandleProps) {
            provided.dragHandleProps.onKeyDown(event);
        }

        if (event.defaultPrevented) {
            return;
        }

        if (snapshot.isDragging) {
            return;
        }

        if (event.keyCode !== keyCodes.enter) {
            return;
        }

        // we are using the event for selection
        event.preventDefault();

        const wasMetaKeyUsed = event.metaKey;
        const wasShiftKeyUsed = event.shiftKey;

        this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
    }

    // Using onClick as it will be correctly
    // preventing if there was a drag
    onClick(event) {
        if (event.defaultPrevented) {
            return;
        }

        if (event.button !== primaryButton) {
            return;
        }

        // marking the event as used
        event.preventDefault();

        const wasMetaKeyUsed = event.metaKey;
        const wasShiftKeyUsed = event.shiftKey;

        this.performAction(wasMetaKeyUsed, wasShiftKeyUsed);
    };

    onTouchEnd(event) {
        if (event.defaultPrevented) {
            return;
        }

        // marking the event as used
        // we would also need to add some extra logic to prevent the click
        // if this element was an anchor
        event.preventDefault();
        this.props.toggleSelectionInGroup(this.props.creator.id);
    }

    performAction(wasMetaKeyUsed, wasShiftKeyUsed) {
        const {
            creator,
            toggleSelection,
            toggleSelectionInGroup,
            multiSelectTo,
        } = this.props;

        if (wasMetaKeyUsed) {
            toggleSelectionInGroup(creator.id);
            return;
        }

        if (wasShiftKeyUsed) {
            multiSelectTo(creator.id);
            return;
        }

        toggleSelection(creator.id);
    }

    render() {
        const creator = this.props.creator;
        const index = this.props.index;
        const isSelected = this.props.isSelected;
        const selectionCount = this.props.selectionCount;
        const isGhosting = this.props.isGhosting;
        return (
            <Draggable draggableId={creator.id} index={index}>
                {(provided, snapshot) => {
                    const shouldShowSelection = snapshot.isDragging && selectionCount > 1;

                    return (
                        <div>
                            <DragItem
                                className="drag__item"
                                innerRef={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={this.onClick}
                                onTouchEnd={this.onTouchEnd}
                                onKeyDown={(event) => this.onKeyDown(event, provided, snapshot)}
                                isDragging={snapshot.isDragging}
                                isSelected={isSelected}
                                isGhosting={isGhosting}
                            >
                                <div className="creator__delete" onClick={() => this.props.deleteCreator(creator.id)}><Trash2/></div>
                                <div className="creator__content">{creator.label}</div>
                                {shouldShowSelection ?
                                    <SelectionCount className="creator__selection_count">{selectionCount}</SelectionCount> : null}
                            </DragItem>
                            {provided.placeholder}
                        </div>
                    )
                        ;
                }}
            </Draggable>
        );
    }
}

Creator.propTypes = {
    creator: PropTypes.shape({id: PropTypes.string, label: PropTypes.string}),
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    isGhosting: PropTypes.bool,
    selectionCount: PropTypes.number,
    toggleSelection: PropTypes.func,
    toggleSelectionInGroup: PropTypes.func,
    multiSelectTo: PropTypes.func,
    deleteCreator: PropTypes.func,
};