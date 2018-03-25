import React from 'react';
import {PropTypes} from "prop-types";
import {Draggable} from "react-beautiful-dnd";
import styled from 'styled-components';

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
const primaryButton = 0;
const size = 30;
const grid = 8;
const borderRadius = 4;

const keyCodes = {
    enter: 13,
    escape: 27,
    arrowDown: 40,
    arrowUp: 38,
    tab: 9,
};

const colors = {
    blue: {
        deep: 'rgb(0, 121, 191)',
        light: 'lightblue',
        lighter: '#d9fcff',
        soft: '#E6FCFF',
    },
    black: '#4d4d4d',
    shadow: 'rgba(0,0,0,0.2)',
    grey: {
        darker: '#C1C7D0',
        dark: '#E2E4E6',
        medium: '#DFE1E5',
        N30: '#EBECF0',
        light: '#F4F5F7',
    },
    green: 'rgb(185, 244, 188)',
    white: 'white',
    purple: 'rebeccapurple',
};

function getBackgroundColor({
                                isSelected,
                                isGhosting,
                            }) {
    if (isGhosting) {
        return colors.grey.light;
    }

    if (isSelected) {
        return colors.blue.light;
    }

    return colors.grey.light;
}

function getColor({
                      isSelected,
                      isGhosting,
                  }) {
    if (isGhosting) {
        return 'darkgrey';
    }
    if (isSelected) {
        return colors.blue.deep;
    }
    return colors.black;
}

const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  color: ${colors.white};
  background: ${colors.blue.deep};
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

const Container = styled.div`
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;4
  font-size: 18px;
  border: 1px solid ${colors.shadow};

  ${props => (props.isDragging ? `box-shadow: 2px 2px 1px ${colors.shadow};` : '')}
  ${props => (props.isGhosting ? 'opacity: 0.8;' : '')}

  /* needed for SelectionCount */
  position: relative;

  /* avoid default outline which looks lame with the position: absolute; */
  &:focus {
    outline: none;
    border-color: ${colors.blue.deep};
  }
`;

export class Creator extends React.Component {
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
        this.props.toggleSelectionInGroup(this.props.task.id);
    }

    performAction(wasMetaKeyUsed, wasShiftKeyUsed) {
        const {
            task,
            toggleSelection,
            toggleSelectionInGroup,
            multiSelectTo,
        } = this.props;

        if (wasMetaKeyUsed) {
            toggleSelectionInGroup(task.id);
            return;
        }

        if (wasShiftKeyUsed) {
            multiSelectTo(task.id);
            return;
        }

        toggleSelection(task.id);
    }

    render() {
        const task = this.props.task;
        const index = this.props.index;
        const isSelected = this.props.isSelected;
        const selectionCount = this.props.selectionCount;
        const isGhosting = this.props.isGhosting;
        return (
            <Draggable draggableId={task.id} index={index}>
                {(provided, snapshot) => {
                    const shouldShowSelection = snapshot.isDragging && selectionCount > 1;

                    return (
                        <div>
                            <Container
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
                                <div className="creator__content">{task.label}</div>
                                {shouldShowSelection ?
                                    <SelectionCount className="creator__selection_count">{selectionCount}</SelectionCount> : null}
                            </Container>
                            {provided.placeholder}
                        </div>
                    )
                        ;
                }}
            </Draggable>
        );
    }
}

// Creator.propTypes = {
//     task: PropTypes.shape({id: PropTypes.string, label: PropTypes.string}),
//     index: PropTypes.number,
//     isSelected: PropTypes.bool,
//     isGhosting: PropTypes.bool,
//     selectionCount: PropTypes.number,
//     toggleSelection: PropTypes.func,
//     toggleSelectionInGroup: PropTypes.func,
//     multiSelectTo: PropTypes.func,
// };