# @dbugger/drag-grouped-list

Headless helpers for grouped list reordering with drag-and-drop. This package only handles data transforms and expects the host app to render UI and own persistence.

## Install

```bash
npm install @dbugger/drag-grouped-list
```

Peer dependency:

```bash
npm install @hello-pangea/dnd
```

## Data Model

The helpers expect a grouped list structure:

```js
const itemsByColumn = {
  "column-1": [
    { id: "item-1", title: "Item 1" },
    { id: "item-2", title: "Item 2" },
  ],
  "column-2": [
    { id: "item-3", title: "Item 3" },
  ],
};
```

Each item must have a stable `id`. The helpers do not mutate the original arrays.

## API

### `reorderList(list, fromIndex, toIndex)`

Reorders a single list.

Returns:

- `list` (array): the reordered list
- `movedItem` (object | undefined): the item that moved

### `moveItemBetweenLists({ itemsByColumn, fromColumnId, toColumnId, fromIndex, toIndex })`

Moves an item across two lists.

Returns:

- `itemsByColumn` (object): updated map of lists
- `movedItem` (object | undefined): the item that moved

### `applyItemDrag({ itemsByColumn, source, destination })`

High-level helper for drag-and-drop libraries that expose `source` and `destination` in the shape used by `@hello-pangea/dnd`.

Returns:

- `itemsByColumn` (object): updated map of lists
- `movedItem` (object | undefined): the item that moved
- `toColumnId` (string | undefined): destination column id
- `toIndex` (number | undefined): destination index

If `destination` is missing, returns the original `itemsByColumn` with `movedItem` undefined.

## Example

Usage example with `@hello-pangea/dnd` result shapes:

```js
import { applyItemDrag } from "@dbugger/drag-grouped-list";

const onDragEnd = ({ source, destination }) => {
	const result = applyItemDrag({
		itemsByColumn,
		source,
		destination,
	});

	if (!result.movedItem) return;

	setItemsByColumn(result.itemsByColumn);
	onMoveTask({
		taskId: result.movedItem.id,
		columnId: result.toColumnId,
		position: result.toIndex,
	});
};
```

The package is ESM only and declares `@hello-pangea/dnd` as a peer dependency.
