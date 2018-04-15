export function multiDragAwareReorder(args) {
    if (args.selectedCreatorIds.length > 1) {
        return reorderMultiDrag(args);
    }
    return reorderSingleDrag(args);
}

function reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

function reorderSingleDrag({entities, selectedCreatorIds, source, destination}) {
    // moving in the same list
    if (source.droppableId === destination.droppableId) {
        const column = entities.columns[source.droppableId];
        const reordered = reorder(
            column.creatorIds,
            source.index,
            destination.index,
        );

        // $ExpectError - using spread
        const updated = {
            ...entities,
            columns: {
                ...entities.columns,
                [column.id]: withNewCreatorIds(column, reordered),
            },
        };

        return {
            entities: updated,
            selectedCreatorIds,
        };
    }

    // moving to a new list
    const home = entities.columns[source.droppableId];
    const foreign = entities.columns[destination.droppableId];

    // the id of the creator to be moved
    const creatorId = home.creatorIds[source.index];

    // remove from home column
    const newHomeCreatorIds = [...home.creatorIds];
    newHomeCreatorIds.splice(source.index, 1);

    // add to foreign column
    const newForeignCreatorIds = [...foreign.creatorIds];
    newForeignCreatorIds.splice(destination.index, 0, creatorId);

    // $ExpectError - using spread
    const updated = {
        ...entities,
        columns: {
            ...entities.columns,
            [home.id]: withNewCreatorIds(home, newHomeCreatorIds),
            [foreign.id]: withNewCreatorIds(foreign, newForeignCreatorIds),
        },
    };

    return {
        entities: updated,
        selectedCreatorIds
    };
}

function reorderMultiDrag({entities, selectedCreatorIds, source, destination}) {
    const start = entities.columns[source.droppableId];
    const dragged = start.creatorIds[source.index];

    const insertAtIndex = (() => {
        const destinationIndexOffset = selectedCreatorIds.reduce(
            (previous, current) => {
                if (current === dragged) {
                    return previous;
                }

                const final = entities.columns[destination.droppableId];
                const column = getHomeColumn(entities, current);

                if (column !== final) {
                    return previous;
                }

                const index = column.creatorIds.indexOf(current);

                if (index >= destination.index) {
                    return previous;
                }

                // the selected item is before the destination index
                // we need to account for this when inserting into the new location
                return previous + 1;
            }, 0);

        return destination.index - destinationIndexOffset;
    })();

    // doing the ordering now as we are required to look up columns
    // and know original ordering
    const orderedSelectedCreatorIds = [...selectedCreatorIds];
    orderedSelectedCreatorIds.sort((a, b) => {
        // moving the dragged item to the top of the list
        if (a === dragged) {
            return -1;
        }
        if (b === dragged) {
            return 1;
        }

        // sorting by their natural indexes
        const columnForA = getHomeColumn(entities, a);
        const indexOfA = columnForA.creatorIds.indexOf(a);
        const columnForB = getHomeColumn(entities, b);
        const indexOfB = columnForB.creatorIds.indexOf(b);

        if (indexOfA !== indexOfB) {
            return indexOfA - indexOfB;
        }

        // sorting by their order in the selectedCreatorIds list
        return -1;
    });

    // we need to remove all of the selected creators from their columns
    const withRemovedCreators = entities.columnOrder.reduce(
        (previous, columnId) => {
            const column = entities.columns[columnId];

            // remove the id's of the items that are selected
            const remainingCreatorIds = column.creatorIds.filter(
                (id) => !selectedCreatorIds.includes(id)
            );

            previous[column.id] = withNewCreatorIds(column, remainingCreatorIds);
            return previous;
        }, entities.columns);

    const final = withRemovedCreators[destination.droppableId];
    const withInserted = (() => {
        const base = [...final.creatorIds];
        base.splice(insertAtIndex, 0, ...orderedSelectedCreatorIds);
        return base;
    })();

    // insert all selected creators into final column
    const withAddedCreators = {
        ...withRemovedCreators,
        [final.id]: withNewCreatorIds(final, withInserted),
    };

    // $ExpectError - using spread
    const updated = {
        ...entities,
        columns: withAddedCreators,
    };

    return {
        entities: updated,
        selectedCreatorIds: orderedSelectedCreatorIds,
    };
}

function getHomeColumn(entities, creatorId) {
    const columnId = entities.columnOrder.find((id) => {
        const column = entities.columns[id];
        return column.creatorIds.includes(creatorId);
    });

    if (!columnId) {
        console.error('Count not find column for creator', creatorId, entities);
        throw new Error('boom');
    }

    return entities.columns[columnId];
}

export function withNewCreatorIds(column, creatorIds) {
    return {
        id: column.id,
        title: column.title,
        creatorIds
    };
}

export function multiSelectTo(entities, selectedCreatorIds, newCreatorId,) {
    // Nothing already selected
    if (!selectedCreatorIds.length) {
        return [newCreatorId];
    }

    const columnOfNew = getHomeColumn(entities, newCreatorId);
    const indexOfNew = columnOfNew.creatorIds.indexOf(newCreatorId);

    const lastSelected = selectedCreatorIds[selectedCreatorIds.length - 1];
    const columnOfLast = getHomeColumn(entities, lastSelected);
    const indexOfLast = columnOfLast.creatorIds.indexOf(lastSelected);

    // multi selecting to another column
    // select everything up to the index of the current item
    if (columnOfNew !== columnOfLast) {
        return columnOfNew.creatorIds.slice(0, indexOfNew + 1);
    }

    // multi selecting in the same column
    // need to select everything between the last index and the current index inclusive

    // nothing to do here
    if (indexOfNew === indexOfLast) {
        return null;
    }

    const isSelectingForwards = indexOfNew > indexOfLast;
    const start = isSelectingForwards ? indexOfLast : indexOfNew;
    const end = isSelectingForwards ? indexOfNew : indexOfLast;

    const inBetween = columnOfNew.creatorIds.slice(start, end + 1);

    // everything inbetween needs to have it's selection toggled.
    // with the exception of the start and end values which will always be selected

    const toAdd = inBetween
        .filter((creatorId) => {
            // if already selected: then no need to select it again
            return !selectedCreatorIds.includes(creatorId);

        });

    const sorted = isSelectingForwards ? toAdd : [...toAdd].reverse();
    return [...selectedCreatorIds, ...sorted];
}