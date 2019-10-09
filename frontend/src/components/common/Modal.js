import React from "react";

class Modal extends React.Component {

    render() {
       return <div>
        <div className={this.props.active ? "modal is-active":"modal"}>
           <div className="modal-background" onClick={this.props.toggle}></div>
           <div className="modal-content">
               {this.props.modalContent}
           </div>
           <button className="modal-close is-large" aria-label="close" onClick={this.props.toggle}></button>
        </div>
       </div>;
    }
}

export default Modal;