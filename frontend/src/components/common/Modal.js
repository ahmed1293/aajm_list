import React from "react";

function Modal(props) {
    return <div>
        <div className={props.active ? "modal is-active" : "modal"}>
            <div className="modal-background" onClick={props.toggle}></div>
            <div className="modal-content">
                {props.modalContent}
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={props.toggle}></button>
        </div>
    </div>;
}

export default Modal;