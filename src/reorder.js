const getItems = (group) => (Array.isArray(group?.items) ? group.items : []);

export const reorderList = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

export const moveItemBetweenGroups = (groups, source, destination) => {
	const fromGroupId = String(source.droppableId);
	const toGroupId = String(destination.droppableId);
	const fromIndex = source.index;
	const toIndex = destination.index;

	const fromGroupIndex = groups.findIndex((group) => String(group.id) === fromGroupId);
	const toGroupIndex = groups.findIndex((group) => String(group.id) === toGroupId);

	if (fromGroupIndex === -1 || toGroupIndex === -1) {
		return {
			groups,
			movedItem: null,
			fromGroupId,
			toGroupId,
			fromIndex,
			toIndex,
		};
	}

	const fromGroup = groups[fromGroupIndex];
	const toGroup = groups[toGroupIndex];
	const fromItems = getItems(fromGroup);
	const toItems = getItems(toGroup);
	const movedItem = fromItems[fromIndex];

	if (!movedItem) {
		return {
			groups,
			movedItem: null,
			fromGroupId,
			toGroupId,
			fromIndex,
			toIndex,
		};
	}

	let nextGroups = groups;

	if (fromGroupId === toGroupId) {
		if (fromIndex !== toIndex) {
			const reordered = reorderList(fromItems, fromIndex, toIndex);
			nextGroups = groups.map((group, index) => (index === fromGroupIndex ? { ...group, items: reordered } : group));
		}
	} else {
		const sourceClone = Array.from(fromItems);
		const destClone = Array.from(toItems);
		sourceClone.splice(fromIndex, 1);
		destClone.splice(toIndex, 0, movedItem);
		nextGroups = groups.map((group, index) => {
			if (index === fromGroupIndex) return { ...group, items: sourceClone };
			if (index === toGroupIndex) return { ...group, items: destClone };
			return group;
		});
	}

	return {
		groups: nextGroups,
		movedItem,
		fromGroupId,
		toGroupId,
		fromIndex,
		toIndex,
	};
};

export const applyItemDrag = ({ groups, source, destination }) => {
	if (!destination) {
		return {
			groups,
			movedItem: null,
			fromGroupId: null,
			toGroupId: null,
			fromIndex: null,
			toIndex: null,
		};
	}

	return moveItemBetweenGroups(groups, source, destination);
};
