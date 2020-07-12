import React, {useContext, useState} from "react";
import {APIContext} from "../../api";


export default function AddItemForm(props) {

	const api = useContext(APIContext);

	const [item, setItem] = useState('');
	const [quantity, setQuantity] = useState('');

	return <div className="field is-horizontal">
		<div className="field-body">
			<div className="field">
				<div className="control">
					<input
						value={item}
						onChange={(e) => setItem(e.target.value)}
						className="input has-text-white"
						type="text"
						placeholder="Item"
						autoFocus={true}
					/>
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
					className="button is-primary"
					disabled={!item || !quantity}
					onClick={async () => {
						let response = await api.POST('items', {
							'name': item,
							'quantity': quantity,
							'list': props.listId,
							'is_checked': false
						})
						props.callback(await response.data);
						setItem(''); setQuantity('');
					}}
				>
					Add
				</button>
			</div>
		</div>
	</div>

}
