import React, {useContext, useState} from "react";
import {APIContext} from "../../api";


export default function AddItemForm(props) {

	const api = useContext(APIContext);

	const [name, setName] = useState('');
	const [quantity, setQuantity] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	async function onNameChange(e) {
		const value = e.target.value;
		setName(value);

		if (value.length <= 2) {
			setSuggestions([]);
		} else {
			let response = await api.GET('items', {'search': value});
			setSuggestions(response.results);
		}
	}

	return <div>
		<div className="field is-horizontal has-text-centered">
			<div className="field-body">
				<div className="field">
					<div className="control">
						<input
							value={name}
							onChange={(e) => onNameChange(e)}
							className="input has-text-white"
							type="text"
							placeholder="Item"
							autoFocus={true}
						/>
					</div>
					<div className='has-text-grey-light my-2'>
						{suggestions.map(s => <div
							key={s.id}
							className='mt-1 is-clickable'
							onClick={() => {
								setName(s.name);
								setQuantity(s.quantity);
								setSuggestions([]);
							}}
						>
							{s.name} ({s.quantity})
						</div>)}
					</div>
				</div>
				<div className="field">
					<div className="control">
						<input
							value={quantity}
							onChange={(e) => setQuantity(e.target.value)}
							className="input has-text-white"
							type="text"
							placeholder="Quantity"
						/>
					</div>
				</div>
				<div className="field">
					<button
						className={"button is-primary"}
						disabled={!name || !quantity}
						onClick={async () => {
							let response = await api.POST('items', {
								'name': name,
								'quantity': quantity,
								'list': props.listId,
								'is_checked': false
							})
							props.callback(response);
							setName(''); setQuantity('');
						}}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	</div>

}
