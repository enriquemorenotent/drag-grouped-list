import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

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
			{ isDraggingOver: false },
		),
	Draggable: ({ children, draggableId }) =>
		children(
			{
				innerRef: () => {},
				draggableProps: { "data-draggable-id": draggableId },
				dragHandleProps: { "data-drag-handle": draggableId },
			},
			{ isDragging: false },
		),
}));

import GroupedBoard from "../src/components/GroupedBoard.jsx";

describe("GroupedBoard", () => {
	it("renders layout and items", () => {
		const groups = [
			{ id: "g1", title: "Group One", items: [{ id: "i1", title: "Item 1" }] },
			{ id: "g2", title: "Group Two", items: [] },
		];

		const { getByTestId } = render(
			<GroupedBoard
				groups={groups}
				onGroupsChange={() => {}}
				renderGroupHeader={({ group }) => (
					<div data-testid={`header-${group.id}`}>{group.title}</div>
				)}
				renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
					<div
						ref={innerRef}
						{...draggableProps}
						{...dragHandleProps}
						data-testid={`item-${item.id}`}
					>
						{item.title}
					</div>
				)}
			/>,
		);

		expect(getByTestId("header-g1")).toBeInTheDocument();
		expect(getByTestId("header-g2")).toBeInTheDocument();
		expect(getByTestId("item-i1")).toBeInTheDocument();

		const container = getByTestId("dnd-context").firstChild;
		expect(container).toHaveClass("flex", "gap-4", "overflow-x-auto");
	});

	it("updates groups and meta on drag end", () => {
		const groups = [
			{
				id: "g1",
				items: [
					{ id: "i1", title: "A" },
					{ id: "i2", title: "B" },
				],
			},
		];
		const onGroupsChange = vi.fn();

		render(
			<GroupedBoard
				groups={groups}
				onGroupsChange={onGroupsChange}
				renderGroupHeader={({ group }) => <div>{group.id}</div>}
				renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
					<div ref={innerRef} {...draggableProps} {...dragHandleProps}>
						{item.title}
					</div>
				)}
			/>,
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
		expect(meta.fromIndex).toBe(0);
		expect(meta.toIndex).toBe(1);
	});
});
