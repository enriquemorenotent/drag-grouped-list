# @dbugger/drag-grouped-list

React components and helpers for grouped list drag-and-drop. This package provides UI wiring with `@hello-pangea/dnd`, a stable layout component, and headless helpers for data transforms.

## Install

```bash
npm install @dbugger/drag-grouped-list
```

Peer dependencies:

```bash
npm install react react-dom @hello-pangea/dnd
```

## Data Model

The components and helpers expect an array of groups:

```js
const groups = [
	{
		id: "group-1",
		title: "Group One",
		items: [
			{ id: "item-1", title: "Item 1" },
			{ id: "item-2", title: "Item 2" },
		],
	},
	{
		id: "group-2",
		title: "Group Two",
		items: [{ id: "item-3", title: "Item 3" }],
	},
];
```

Group order is the array order. Each group and item must have a stable `id`.

## Components

### `GroupedBoard`

Owns the drag-and-drop layout structure used for stable regroup/reorder. It renders the group container and droppable body with Tailwind classes that match the working board layout. You provide the header and item rendering (including the drag handle).

Props:

- `groups` (array, required)
- `onGroupsChange(nextGroups, meta)` (required)
- `renderGroupHeader({ group })` (required)
- `renderItem({ item, group, index, innerRef, draggableProps, dragHandleProps, isDragging })` (required)
- `getGroupId(group)` (optional, default `group.id`)
- `getItemId(item)` (optional, default `item.id`)
- `className` (optional, default `flex gap-4 overflow-x-auto`)
- `groupClassName` (optional, default `flex w-72 flex-col group`)
- `groupBodyClassName` (optional, overrides the default droppable body classes)

### `GroupedList`

Props:

- `groups` (array, required)
- `onGroupsChange(nextGroups, meta)` (required)
- `renderGroup({ group })` (required)
- `renderItem({ item, group, index, innerRef, draggableProps, dragHandleProps, isDragging })` (required)
- `getGroupId(group)` (optional, default `group.id`)
- `getItemId(item)` (optional, default `item.id`)
- `className` (optional)
- `groupClassName` (optional)
- `groupBodyClassName` (optional)

### `GroupDroppable`

Props:

- `groupId` (string | number, required)
- `children({ innerRef, droppableProps, placeholder, isDraggingOver })` (required)

### `DraggableItem`

Props:

- `itemId` (string | number, required)
- `index` (number, required)
- `children({ innerRef, draggableProps, dragHandleProps, isDragging })` (required)

## Helpers

### `reorderList(list, startIndex, endIndex)`

Reorders a single list.

Returns:

- `list` (array): the reordered list

### `moveItemBetweenGroups(groups, source, destination)`

Moves an item within or across groups using `@hello-pangea/dnd` `source` and `destination` shapes.

Returns:

- `groups` (array): updated groups array
- `movedItem` (object | null): the item that moved
- `fromGroupId` (string)
- `toGroupId` (string)
- `fromIndex` (number)
- `toIndex` (number)

### `applyItemDrag({ groups, source, destination })`

High-level helper for drag-and-drop libraries that expose `source` and `destination` in the shape used by `@hello-pangea/dnd`.

Returns:

- `groups` (array): updated groups array
- `movedItem` (object | null): the item that moved
- `fromGroupId` (string | null)
- `toGroupId` (string | null)
- `fromIndex` (number | null)
- `toIndex` (number | null)

If `destination` is missing, returns the original `groups` with all other fields set to `null`.

## Example

```jsx
import { GroupedBoard } from "@dbugger/drag-grouped-list";

const Board = ({ groups, setGroups, renderColumnHeader }) => (
	<GroupedBoard
		groups={groups}
		onGroupsChange={(nextGroups) => setGroups(nextGroups)}
		renderGroupHeader={({ group }) => renderColumnHeader(group)}
		renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
			<div ref={innerRef} {...draggableProps}>
				<span {...dragHandleProps}>drag</span>
				{item.title}
			</div>
		)}
	/>
);
```

## Legacy Example

```jsx
import { GroupedList } from "@dbugger/drag-grouped-list";

const Board = ({ groups, setGroups }) => (
	<GroupedList
		groups={groups}
		onGroupsChange={(nextGroups) => setGroups(nextGroups)}
		renderGroup={({ group }) => <h3>{group.title}</h3>}
		renderItem={({ item, innerRef, draggableProps, dragHandleProps }) => (
			<div ref={innerRef} {...draggableProps} {...dragHandleProps}>
				{item.title}
			</div>
		)}
	/>
);
```

The package is ESM only.
