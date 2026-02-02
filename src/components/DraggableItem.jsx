import React from "react";
import { Draggable } from "@hello-pangea/dnd";

const DraggableItem = ({ itemId, index, children }) => (
	<Draggable draggableId={String(itemId)} index={index}>
		{(provided, snapshot) =>
			children({
				innerRef: provided.innerRef,
				draggableProps: provided.draggableProps,
				dragHandleProps: provided.dragHandleProps,
				isDragging: snapshot.isDragging,
			})
		}
	</Draggable>
);

export default DraggableItem;
