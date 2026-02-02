import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { applyItemDrag } from "../reorder.js";
import GroupDroppable from "./GroupDroppable.jsx";
import DraggableItem from "./DraggableItem.jsx";

const defaultGetGroupId = (group) => group.id;
const defaultGetItemId = (item) => item.id;

const GroupedList = ({
	groups,
	onGroupsChange,
	renderGroup,
	renderItem,
	getGroupId = defaultGetGroupId,
	getItemId = defaultGetItemId,
	className,
	groupClassName,
	groupBodyClassName,
}) => {
	const handleDragEnd = ({ source, destination }) => {
		if (!source) return;

		const normalizedGroups = groups.map((group) => ({
			id: String(getGroupId(group)),
			items: Array.isArray(group.items) ? group.items : [],
		}));

		const result = applyItemDrag({
			groups: normalizedGroups,
			source,
			destination,
		});

		if (!result.movedItem) return;

		const itemsByGroupId = new Map(result.groups.map((group) => [group.id, group.items]));
		const nextGroups = groups.map((group) => {
			const groupId = String(getGroupId(group));
			const nextItems = itemsByGroupId.get(groupId) ?? (Array.isArray(group.items) ? group.items : []);
			return { ...group, items: nextItems };
		});

		onGroupsChange?.(nextGroups, {
			movedItem: result.movedItem,
			fromGroupId: result.fromGroupId,
			toGroupId: result.toGroupId,
			fromIndex: result.fromIndex,
			toIndex: result.toIndex,
		});
	};

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className={className}>
				{groups.map((group) => {
					const groupId = String(getGroupId(group));
					const items = Array.isArray(group.items) ? group.items : [];
					return (
						<div key={groupId} className={groupClassName}>
							{renderGroup({ group })}
							<GroupDroppable groupId={groupId}>
								{({ innerRef, droppableProps, placeholder }) => (
									<div ref={innerRef} {...droppableProps} className={groupBodyClassName}>
										{items.map((item, index) => {
											const itemId = String(getItemId(item));
											return (
												<DraggableItem key={itemId} itemId={itemId} index={index}>
													{(dragProps) =>
														renderItem({
															item,
															group,
															index,
															...dragProps,
														})
													}
												</DraggableItem>
											);
										})}
										{placeholder}
									</div>
								)}
							</GroupDroppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
};

export default GroupedList;
