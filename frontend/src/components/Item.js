import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";
import EditItemForm from "./forms/EditItemForm";
import {APIContext} from "../api";
import {ACTIONS, DataContext} from "../dataReducer";


export default function Item(props) {

	const api = useContext(APIContext);
	const dispatch = useContext(DataContext);

	const item = props.instance;

	async function checkItem() {
		await api.PATCH('items', item.id, {'is_checked': !item.is_checked});
		dispatch({
			type: ACTIONS.editItem, item: item, values: [{lookup: 'is_checked', value: !item.is_checked}]
		})
	}

	return <div className="list-item" style={{padding: '0.5em 0.3em'}}>
		<nav className="level is-mobile">
			<div className="level-left">
				<div className="buttons" style={{marginRight: '8px'}}>
					<EditItemForm
						id={item.id} name={item.name} quantity={item.quantity}
						callback={(newItem) => dispatch({
							type: ACTIONS.editItem,
							item: item,
							values: [
								{lookup: 'name', value: newItem.name},
								{lookup: 'quantity', value: newItem.quantity}
							 ]
						 })
						}
					/>
					<a className="button is-small is-black is-outlined" onClick={checkItem}
						data-testid={item.is_checked ? 'undo-button' : 'check-button'}>
						<FontAwesomeIcon
							className={"icon" + (item.is_checked ? " has-text-info" : " has-text-success")}
							icon={item.is_checked ? faUndo : faCheck}
							data-testid={`${item.is_checked ? 'undo' : 'check'}-btn-${props.index}`}
						/>
					</a>
				</div>
			</div>
			<div className="level-item level-is-shrinkable">
				<div className={"has-text-white" + (item.is_checked ? " line-through" : "")}
					  data-testid={`item-${props.index}`}>
					{item.name} ({item.quantity})
				</div>
			</div>
		</nav>
	</div>;
}
