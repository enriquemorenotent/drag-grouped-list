import { describe, it, expect } from "vitest";
import { reorderList, moveItemBetweenGroups, applyItemDrag } from "../src/reorder.js";

describe("reorderList", () => {
	it("reorders items within a list", () => {
		const list = ["a", "b", "c"];
		const result = reorderList(list, 0, 2);
		expect(result).toEqual(["b", "c", "a"]);
		expect(list).toEqual(["a", "b", "c"]);
	});
});

describe("moveItemBetweenGroups", () => {
	it("moves an item across groups", () => {
		const groups = [
			{ id: "a", items: [{ id: "1" }, { id: "2" }] },
			{ id: "b", items: [{ id: "3" }] },
		];
		const result = moveItemBetweenGroups(
			groups,
			{ droppableId: "a", index: 1 },
			{ droppableId: "b", index: 1 }
		);
		expect(result.groups[0].items.map((item) => item.id)).toEqual(["1"]);
		expect(result.groups[1].items.map((item) => item.id)).toEqual(["3", "2"]);
		expect(result.movedItem.id).toBe("2");
		expect(groups[0].items.map((item) => item.id)).toEqual(["1", "2"]);
		expect(groups[1].items.map((item) => item.id)).toEqual(["3"]);
	});

	it("reorders items in the same group", () => {
		const groups = [{ id: "a", items: [{ id: "1" }, { id: "2" }, { id: "3" }] }];
		const result = moveItemBetweenGroups(
			groups,
			{ droppableId: "a", index: 0 },
			{ droppableId: "a", index: 2 }
		);
		expect(result.groups[0].items.map((item) => item.id)).toEqual(["2", "3", "1"]);
		expect(result.movedItem.id).toBe("1");
		expect(groups[0].items.map((item) => item.id)).toEqual(["1", "2", "3"]);
	});
});

describe("applyItemDrag", () => {
	it("returns original data when there is no destination", () => {
		const groups = [{ id: "a", items: [{ id: "1" }] }];
		const result = applyItemDrag({
			groups,
			source: { droppableId: "a", index: 0 },
			destination: null,
		});
		expect(result.groups).toBe(groups);
		expect(result.movedItem).toBeNull();
		expect(result.fromGroupId).toBeNull();
		expect(result.toGroupId).toBeNull();
	});
});
