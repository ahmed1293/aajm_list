import React from "react";

function Modal(props) {
    return <>
        <div className={props.active ? "modal is-active" : "modal"}
             data-testid={props.active ? "active-modal" : "inactive-modal"}>
            <div className="modal-background" onClick={props.toggle}/>
            <div className="modal-content">
                {props.modalContent}
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={props.toggle}/>
        </div>
    </>;
}

export default Modal;