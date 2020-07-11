import React, {useContext, useEffect, useReducer, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import {APIContext} from "../../api";

function init(initialValues) {
	return {
		name: initialValues.name,
		quantity: initialValues.quantity
	}
}

function reducer(state, action) {
	switch (action.type) {
		case 'edit value':
			return {...state, [action.field]: action.value}
		case 'reset':
			return init({name: '', quantity: ''})
		default:
			throw new Error('Unexpected action type!')
	}
}

export default function ItemForm(props) {

	const api = useContext(APIContext);

	const [state, dispatch] = useReducer(reducer, {name: props.name, quantity: props.quantity}, init);
	const [active, setActive] = useState(false);

	let controller;

	function toggleModal() {
		setActive(m => !m);
	}

	function handleChange(e) {
		const target = e.target;
		dispatch({type: 'edit value', field: target.name, value: target.value});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		const endpoint = 'items';
		const values = {'name': state.name, 'quantity': state.quantity};
		const body = props.id ? values : {...values, 'list': props.listId, 'is_checked': false};

		let response = props.id ? await api.PATCH(endpoint, props.id, body) : await api.POST(endpoint, body);

		let newItem = await response.data;
		controller = response.controller;

		props.callback(newItem);
		!props.id && dispatch({type: 'reset'});
		toggleModal();
	}

	useEffect(() => {
		return (() => {
			controller && controller.abort()
		})
	});

	return <>
		<a className={"button is-small is-black is-outlined"} onClick={toggleModal}
			data-testid={props.id ? "edit-item-btn" : "add-item-btn"}>
			<FontAwesomeIcon
				className={"icon " + (props.id ? "has-text-warning" : "has-text-info")}
				icon={props.id ? faPencilAlt : faPlus}
			/>
		</a>
		{active && <Modal toggle={toggleModal} modalContent={
			<div className="message">
				<div className="message-header has-background-black"><p>Item</p></div>
				<div className="message-body has-background-dark">
					<form onSubmit={handleSubmit}>
						<div className="field">
							<label className="label has-text-white">Name</label>
							<div className="control">
								<input
									className="input has-background-black has-text-white" name="name" type="text"
									value={state.name || ''} onChange={handleChange} placeholder="e.g. Chicken"
								/>
							</div>
						</div>
						<div className="field">
							<label className="label has-text-white">Quantity</label>
							<div className="control">
								<input className="input has-background-black has-text-white" name="quantity"
										 type="text" value={state.quantity || ''} onChange={handleChange} placeholder="e.g. 81"
								/>
							</div>
						</div>
						<div className="control">
							<button className="button is-black" disabled={!(state.name && state.quantity)}>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		}/>}
	</>;
}
