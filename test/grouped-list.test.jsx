import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

let lastOnDragEnd = null;

vi.mock("@hello-pangea/dnd", () => ({
	DragDropContext: ({ children, onDragEnd }) => {
		lastOnDragEnd = onDragEnd;
		return <div data-testid="dnd-context">{children}</div>;
	},
	Droppable: ({ children, droppableId }) =>
		children(
			{
				innerRef: () => {},
				droppableProps: { "data-droppable-id": droppableId },
				placeholder: null,
			},
			{ isDraggingOver: false }
		),
	Draggable: ({ children, draggableId }) =>
		children(
			{
				innerRef: () => {},
				draggableProps: { "data-draggable-id": draggableId },
				dragHandleProps: { "data-drag-handle": draggableId },
			},
			{ isDragging: false }
		),
}));

import GroupedList from "../src/components/GroupedList.jsx";

describe("GroupedList", () => {
	it("reorders items within a group on drag end", () => {
		const groups = [
			{
				id: "g1",
				title: "Group One",
				items: [
					{ id: "i1", title: "A" },
					{ id: "i2", title: "B" },
				],
			},
		];
		const onGroupsChange = vi.fn();
		render(
			<GroupedList
				groups={groups}
				onGroupsChange={onGroupsChange}
				renderGroup={({ group }) => <div>{group.title}</div>}
				renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
					<div ref={innerRef} {...draggableProps} {...dragHandleProps}>
						{item.title}
					</div>
				)}
			/>
		);

		lastOnDragEnd({
			source: { droppableId: "g1", index: 0 },
			destination: { droppableId: "g1", index: 1 },
		});

		expect(onGroupsChange).toHaveBeenCalledTimes(1);
		const [nextGroups, meta] = onGroupsChange.mock.calls[0];
		expect(nextGroups[0].items.map((item) => item.id)).toEqual(["i2", "i1"]);
		expect(meta.fromGroupId).toBe("g1");
		expect(meta.toGroupId).toBe("g1");
	});

	it("moves items across groups on drag end", () => {
		const groups = [
			{
				id: "g1",
				items: [{ id: "i1", title: "A" }],
			},
			{
				id: "g2",
				items: [{ id: "i2", title: "B" }],
			},
		];
		const onGroupsChange = vi.fn();
		render(
			<GroupedList
				groups={groups}
				onGroupsChange={onGroupsChange}
				renderGroup={({ group }) => <div>{group.id}</div>}
				renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
					<div ref={innerRef} {...draggableProps} {...dragHandleProps}>
						{item.title}
					</div>
				)}
			/>
		);

		lastOnDragEnd({
			source: { droppableId: "g1", index: 0 },
			destination: { droppableId: "g2", index: 1 },
		});

		const [nextGroups] = onGroupsChange.mock.calls[0];
		expect(nextGroups[0].items).toHaveLength(0);
		expect(nextGroups[1].items.map((item) => item.id)).toEqual(["i2", "i1"]);
	});

	it("passes draggable props to renderItem", () => {
		const groups = [{ id: "g1", items: [{ id: "i1", title: "A" }] }];
		let lastItemArgs = null;
		render(
			<GroupedList
				groups={groups}
				onGroupsChange={() => {}}
				renderGroup={() => <div>Group</div>}
				renderItem={(args) => {
					lastItemArgs = args;
					return (
						<div ref={args.innerRef} {...args.draggableProps} {...args.dragHandleProps}>
							{args.item.title}
						</div>
					);
				}}
			/>
		);

		expect(lastItemArgs).not.toBeNull();
		expect(lastItemArgs.dragHandleProps).toBeDefined();
		expect(lastItemArgs.draggableProps).toBeDefined();
	});
});
