import React from "react";
import styled from 'styled-components';
import {PropTypes} from 'prop-types';
import {Droppable} from "react-beautiful-dnd";
import {Creator} from "../creator";
import memoizeOne from 'memoize-one';

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
const borderRadius = 4;
const grid = 8;

const Container = styled.div`
  width: 300px;
  margin: ${grid}px;
  border-radius: ${borderRadius}px;
  border: 1px solid ${colors.grey.dark};
  background-color: ${colors.grey.medium};

  /* we want the column to take up its full height */
  display: flex;
  flex-direction: column;
`;
const getSelectedMap = memoizeOne((selectedTaskIds) =>
    selectedTaskIds.reduce((previous, current) => {
        previous[current] = true;
        return previous;
    }, {}));

const TaskList = styled.div`
  padding: ${grid}px;
  min-height: 200px;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  ${props => (props.isDraggingOver ? `background-color: ${colors.grey.darker}` : '')};
`;

export class Column extends React.Component {
    render() {
        const column = this.props.column;
        const tasks = this.props.tasks;
        const selectedTaskIds = this.props.selectedTaskIds;
        const draggingTaskId = this.props.draggingTaskId;

        return (
            <Container className="creator__choice__container__column creators">
                <h3>{column.title}</h3>
                <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                        <TaskList
                            className="creators__list"
                            innerRef={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            {...provided.droppableProps}
                        >
                            {tasks.map((task, index) => {
                                const isSelected = Boolean(getSelectedMap(selectedTaskIds)[task.id]);
                                const isGhosting = isSelected && Boolean(draggingTaskId) && draggingTaskId !== task.id;
                                return (
                                    <Creator
                                        task={task}
                                        index={index}
                                        key={task.id}
                                        isSelected={isSelected}
                                        isGhosting={isGhosting}
                                        selectionCount={selectedTaskIds.length}
                                        toggleSelection={this.props.toggleSelection}
                                        toggleSelectionInGroup={this.props.toggleSelectionInGroup}
                                        multiSelectTo={this.props.multiSelectTo}
                                    />
                                );
                            })}
                            {provided.placeholder}
                        </TaskList>
                    )}
                </Droppable>
            </Container>
        );
    }
}
//
// Column.propTypes = {
//     column: PropTypes.shape({id: PropTypes.string, title: PropTypes.string, creatorsIds: PropTypes.arrayOf(PropTypes.string)}),
//     tasks: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, label: PropTypes.string})),
//     selectedTaskIds: PropTypes.arrayOf(PropTypes.string),
//     multiSelectTo: PropTypes.func,
//     draggingTaskId: PropTypes.string,
//     toggleSelection: PropTypes.func,
//     toggleSelectionInGroup: PropTypes.func
// };