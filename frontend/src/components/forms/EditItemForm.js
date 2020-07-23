import React, {useContext, useReducer, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
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

export default function EditItemForm(props) {

	const api = useContext(APIContext);

	const [state, dispatch] = useReducer(reducer, {name: props.name, quantity: props.quantity}, init);
	const [active, setActive] = useState(false);

	function toggleModal() {
		setActive(m => !m);
	}

	function handleChange(e) {
		const target = e.target;
		dispatch({type: 'edit value', field: target.name, value: target.value});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		let newItem = await api.PATCH(
			'items',
			props.id,
			{'name': state.name, 'quantity': state.quantity}
		);

		props.callback(newItem);
		toggleModal();
	}

	return <>
		<a className={"button is-small is-black is-outlined"} onClick={toggleModal} data-testid="edit-item-btn">
			<FontAwesomeIcon className={"icon has-text-warning"} icon={faPencilAlt}/>
		</a>
		{active && <Modal toggle={toggleModal} modalContent={
			<div className="message">
				<div className="message-header has-background-black has-text-white">Edit</div>
				<div className="message-body has-background-dark">
					<form onSubmit={handleSubmit}>
						<div className="field">
							<label className="label has-text-white">Name</label>
							<div className="control">
								<input
									className="input has-text-white" name="name" type="text"
									value={state.name || ''} onChange={handleChange} placeholder="e.g. Chicken"
								/>
							</div>
						</div>
						<div className="field">
							<label className="label has-text-white">Quantity</label>
							<div className="control">
								<input className="input has-text-white" name="quantity"
										 type="text" value={state.quantity || ''} onChange={handleChange} placeholder="e.g. 81"
								/>
							</div>
						</div>
						<div className="control">
							<button className="button is-primary" disabled={!(state.name && state.quantity)}>
								Save
							</button>
						</div>
					</form>
				</div>
			</div>
		}/>}
	</>;
}
