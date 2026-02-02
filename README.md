# @dbugger/drag-grouped-list

Headless helpers for grouped list reordering with drag-and-drop. This package only handles data transforms and expects the host app to render UI and own persistence.

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
