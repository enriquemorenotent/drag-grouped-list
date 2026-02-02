import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { applyItemDrag } from "../reorder.js";
import GroupDroppable from "./GroupDroppable.jsx";
import DraggableItem from "./DraggableItem.jsx";

const defaultGetGroupId = (group) => group.id;
const defaultGetItemId = (item) => item.id;

const GroupedBoard = ({
	groups,
	onGroupsChange,
	renderGroupHeader,
	renderItem,
	getGroupId = defaultGetGroupId,
	getItemId = defaultGetItemId,
	className = "flex gap-4 overflow-x-auto",
	groupClassName = "flex w-72 flex-col group",
	groupBodyClassName,
}) => {
	const handleDragEnd = ({ source, destination }) => {
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

		const itemsByGroupId = new Map(
			result.groups.map((group) => [group.id, group.items]),
		);
		const nextGroups = groups.map((group) => {
			const groupId = String(getGroupId(group));
			const nextItems =
				itemsByGroupId.get(groupId) ??
				(Array.isArray(group.items) ? group.items : []);
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
							{renderGroupHeader({ group })}
							<GroupDroppable groupId={groupId}>
								{({
									innerRef,
									droppableProps,
									placeholder,
									isDraggingOver,
								}) => {
									const bodyClassName =
										groupBodyClassName ||
										`rounded-xl border border-slate-200 p-2 transition-colors duration-200 ${
											isDraggingOver ? "bg-slate-200/80" : "bg-slate-100"
										}`;
									return (
										<div
											ref={innerRef}
											{...droppableProps}
											className={bodyClassName}
										>
											{items.map((item, index) => {
												const itemId = String(getItemId(item));
												return (
													<DraggableItem
														key={itemId}
														itemId={itemId}
														index={index}
													>
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
									);
								}}
							</GroupDroppable>
						</div>
					);
				})}
			</div>
		</DragDropContext>
	);
};

export default GroupedBoard;
