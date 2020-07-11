import React from "react";


export default function AddItemForm(props) {

	return <div className="field is-horizontal">
		<div className="field-body">
			<div className="field">
				<div className="control">
					<input className="input has-text-white" type="text" placeholder="Item"/>
				</div>
			</div>
			<div className="field">
				<div className="control">
					<input className="input has-text-white" type="text" placeholder="Quantity"/>
				</div>
			</div>
			<div className="field">
				<button className="button is-primary">
					Add
				</button>
			</div>
		</div>
	</div>

}
