import React from "react";
import {PropTypes} from 'prop-types';
import {Droppable} from "react-beautiful-dnd";
import {Creator} from "../creator";
import memoizeOne from 'memoize-one';

import {ColumnContainer, List} from "../wrappers";

import './column.css';

const getSelectedMap = memoizeOne(selectedCreatorIds =>
    selectedCreatorIds.reduce((previous, current) => {
        previous[current] = true;
        return previous;
    }, {}));

export class Column extends React.Component {
    render() {
        const column = this.props.column;
        const creators = this.props.creators;
        const selectedCreatorIds = this.props.selectedCreatorIds;
        const draggingCreatorId = this.props.draggingCreatorId;

        return (
            <ColumnContainer className="multi-drag__column creators">
                <h3 className="multi-drag__column__title">{column.title}</h3>
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <List
                            className="creators__list"
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                        >
                            {creators.map((creator, index) => {
                                const isSelected = Boolean(getSelectedMap(selectedCreatorIds)[creator.id]);
                                const isGhosting = isSelected && Boolean(draggingCreatorId) && draggingCreatorId !== creator.id;
                                return (
                                    <Creator
                                        creator={creator}
                                        index={index}
                                        key={creator.id}
                                        isSelected={isSelected}
                                        isGhosting={isGhosting}
                                        selectionCount={selectedCreatorIds.length}
                                        toggleSelection={this.props.toggleSelection}
                                        toggleSelectionInGroup={this.props.toggleSelectionInGroup}
                                        multiSelectTo={this.props.multiSelectTo}
                                        deleteCreator={this.props.deleteCreator}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </ColumnContainer>
        );
    }
}

Column.propTypes = {
    column: PropTypes.shape({id: PropTypes.string, title: PropTypes.string, creatorsIds: PropTypes.arrayOf(PropTypes.string)}),
    creators: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, label: PropTypes.string})),
    selectedCreatorIds: PropTypes.arrayOf(PropTypes.string),
    multiSelectTo: PropTypes.func,
    draggingCreatorId: PropTypes.string,
    toggleSelection: PropTypes.func,
    toggleSelectionInGroup: PropTypes.func,
    deleteCreator: PropTypes.func
};