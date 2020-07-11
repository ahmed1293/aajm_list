import React from "react";

export default function Modal(props) {
	return <>
		<div className="modal is-active" data-testid="modal" style={{padding: '10px'}}>
			<div className="modal-background" onClick={props.toggle}/>
			<div className="modal-content">
				{props.modalContent}
			</div>
			<button className="modal-close is-large" aria-label="close" onClick={props.toggle}/>
		</div>
	</>;
}
