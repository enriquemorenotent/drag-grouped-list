import { describe, it, expect } from "vitest";
import { reorderList, moveItemBetweenLists, applyItemDrag } from "../src/reorder.js";

describe("reorderList", () => {
	it("reorders items within a list", () => {
		const list = ["a", "b", "c"];
		const result = reorderList(list, 0, 2);
		expect(result).toEqual(["b", "c", "a"]);
		expect(list).toEqual(["a", "b", "c"]);
	});
});

describe("moveItemBetweenLists", () => {
	it("moves an item between lists", () => {
		const source = ["a", "b", "c"];
		const destination = ["d", "e"];
		const result = moveItemBetweenLists(source, destination, 1, 1);
		expect(result.sourceItems).toEqual(["a", "c"]);
		expect(result.destinationItems).toEqual(["d", "b", "e"]);
		expect(source).toEqual(["a", "b", "c"]);
		expect(destination).toEqual(["d", "e"]);
	});
});

describe("applyItemDrag", () => {
	it("reorders items in the same column", () => {
		const itemsByColumn = {
			a: [{ id: "1" }, { id: "2" }, { id: "3" }],
		};
		const result = applyItemDrag({
			itemsByColumn,
			source: { droppableId: "a", index: 0 },
			destination: { droppableId: "a", index: 2 },
		});
		expect(result.itemsByColumn.a.map((item) => item.id)).toEqual(["2", "3", "1"]);
		expect(itemsByColumn.a.map((item) => item.id)).toEqual(["1", "2", "3"]);
	});

	it("moves items across columns", () => {
		const itemsByColumn = {
			a: [{ id: "1" }, { id: "2" }],
			b: [{ id: "3" }],
		};
		const result = applyItemDrag({
			itemsByColumn,
			source: { droppableId: "a", index: 1 },
			destination: { droppableId: "b", index: 1 },
		});
		expect(result.itemsByColumn.a.map((item) => item.id)).toEqual(["1"]);
		expect(result.itemsByColumn.b.map((item) => item.id)).toEqual(["3", "2"]);
		expect(result.movedItem.id).toBe("2");
	});

	it("returns original data when there is no destination", () => {
		const itemsByColumn = {
			a: [{ id: "1" }],
		};
		const result = applyItemDrag({
			itemsByColumn,
			source: { droppableId: "a", index: 0 },
			destination: null,
		});
		expect(result.itemsByColumn).toBe(itemsByColumn);
		expect(result.movedItem).toBeNull();
	});
});
