import React from "react";
import { Droppable } from "@hello-pangea/dnd";

const GroupDroppable = ({ groupId, children }) => (
	<Droppable droppableId={String(groupId)}>
		{(provided, snapshot) =>
			children({
				innerRef: provided.innerRef,
				droppableProps: provided.droppableProps,
				placeholder: provided.placeholder,
				isDraggingOver: snapshot.isDraggingOver,
			})
		}
	</Droppable>
);

export default GroupDroppable;
