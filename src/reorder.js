export const reorderList = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

export const moveItemBetweenLists = (sourceItems, destinationItems, sourceIndex, destinationIndex) => {
	const sourceClone = Array.from(sourceItems);
	const destClone = Array.from(destinationItems);
	const [moved] = sourceClone.splice(sourceIndex, 1);
	if (moved === undefined) {
		return { sourceItems, destinationItems };
	}
	destClone.splice(destinationIndex, 0, moved);
	return { sourceItems: sourceClone, destinationItems: destClone, movedItem: moved };
};

export const applyItemDrag = ({ itemsByColumn, source, destination }) => {
	if (!destination) {
		return {
			itemsByColumn,
			movedItem: null,
			fromColumnId: null,
			toColumnId: null,
			fromIndex: null,
			toIndex: null,
		};
	}

	const fromColumnId = source.droppableId;
	const toColumnId = destination.droppableId;
	const fromItems = itemsByColumn[fromColumnId] || [];
	const toItems = itemsByColumn[toColumnId] || [];
	const movedItem = fromItems[source.index];

	if (!movedItem) {
		return {
			itemsByColumn,
			movedItem: null,
			fromColumnId,
			toColumnId,
			fromIndex: source.index,
			toIndex: destination.index,
		};
	}

	let nextItemsByColumn = itemsByColumn;

	if (fromColumnId === toColumnId) {
		if (source.index !== destination.index) {
			const reordered = reorderList(fromItems, source.index, destination.index);
			nextItemsByColumn = { ...itemsByColumn, [fromColumnId]: reordered };
		}
	} else {
		const moved = moveItemBetweenLists(fromItems, toItems, source.index, destination.index);
		nextItemsByColumn = {
			...itemsByColumn,
			[fromColumnId]: moved.sourceItems,
			[toColumnId]: moved.destinationItems,
		};
	}

	return {
		itemsByColumn: nextItemsByColumn,
		movedItem,
		fromColumnId,
		toColumnId,
		fromIndex: source.index,
		toIndex: destination.index,
	};
};
