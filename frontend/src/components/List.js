import React, {useContext} from "react";
import Item from "./Item";
import ItemForm from "./forms/ItemForm";
import {ACTIONS, DataContext} from "../dataReducer";


export default function List(props) {

	const dispatch = useContext(DataContext);

	return <div>
		<div className="has-text-centered">
			<ItemForm
				listId={props.listId}
				callback={(newItem) => dispatch({type: ACTIONS.addItem, listId: props.listId, item: newItem})}
			/>
		</div>
		<br/>
		<div className="list has-background-dark">
			{sort(props.items).map((item, index) => <Item key={item.id} instance={item} index={index}/>)}
		</div>
	</div>;
}


function sort(array) {
	let arrayCopy = [...array];
	return arrayCopy.sort((item_1, item_2) => {
		return item_1.is_checked - item_2.is_checked // false values first
	});
}
