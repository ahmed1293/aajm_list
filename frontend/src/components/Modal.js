import React from "react";

function Modal(props) {
	return <>
		<div className={"modal is-active"} data-testid="modal">
			<div className="modal-background" onClick={props.toggle}/>
			<div className="modal-content">
				{props.modalContent}
			</div>
			<button className="modal-close is-large" aria-label="close" onClick={props.toggle}/>
		</div>
	</>;
}

export default Modal;
