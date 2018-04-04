import styled from "styled-components";
import {grid, borderRadius, colors, size} from "./constants";

function getBackgroundColor({isSelected, isGhosting}) {
    if (isGhosting) {
        return colors.grey.light;
    }

    // if (isSelected) {
    //     return colors.grey.alfred;
    // }

    return colors.grey.light;
}

function getColor({isSelected, isGhosting}) {
    if (isGhosting) {
        return 'darkgrey';
    }
    if (isSelected) {
        return colors.grey.alfred;
    }
    return colors.black;
}

export const List = styled.div`
  padding: ${grid}px;
  height: 200px;
  overflow: auto;
  flex-grow: 1;
  transition: background-color 0.2s ease;
  ${props => (props.isDraggingOver ? `background-color: ${colors.grey.dark}` : '')};
`;

export const ColumnContainer = styled.div`
  width: 300px;
  margin: ${grid}px;
  border-radius: ${borderRadius}px;
  border: 1px solid ${colors.grey.alfred};
  flex-grow: 1;

  /* we want the column to take up its full height */
  display: flex;
  flex-direction: column;
`;

export const SelectionCount = styled.div`
  right: -${grid}px;
  top: -${grid}px;
  color: ${colors.white};
  background: ${colors.grey.alfred};
  border-radius: 50%;
  height: ${size}px;
  width: ${size}px;
  line-height: ${size}px;
  position: absolute;
  text-align: center;
  font-size: 0.8rem;
`;

export const DragItem = styled.div`
  background-color: ${props => getBackgroundColor(props)};
  color: ${props => getColor(props)};
  padding: ${grid}px;
  margin-bottom: ${grid}px;
  border-radius: ${borderRadius}px;4
  font-size: 18px;
  border: 1px solid ${props => props.isSelected ? colors.black : colors.shadow};

  ${props => (props.isDragging ? `box-shadow: 2px 2px 1px ${colors.shadow};` : '')}
  ${props => (props.isGhosting ? 'opacity: 0.8;' : '')}

  /* needed for SelectionCount */
  position: relative;

  /* avoid default outline which looks lame with the position: absolute; */
  &:focus {
    outline: none;
    border-color: ${colors.grey.alfred};
  }
`;

export const MultiDragContainer = styled.div`
  display: flex;
  user-select: none;
  align-items: center;
`;