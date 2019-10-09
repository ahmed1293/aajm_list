import React from "react";
import {fetchDjango, itemsUrl} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modal";


class ItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.activateFormButton = this.activateFormButton.bind(this);
        this.state = {
            activeModal: false,
            item: this.props.item,
            quantity: this.props.quantity,
            itemInvalid: false,
            quantityInvalid: false
        };
    }

    toggleForm() {
        this.setState({activeModal: !this.state.activeModal});
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({itemInvalid: false, quantityInvalid: false});

        if (!this.validateForm()) {
            return null;
        }

        let response = await fetchDjango(
            itemsUrl(this.props.id), {
                method: this.props.id ? 'PATCH':'POST',
                body: this.props.id ? {
                        "name": this.state.item,
                        "quantity": this.state.quantity,
                    } : {
                        "name": this.state.item,
                        "quantity": this.state.quantity,
                        "list": this.props.listId,
                        "is_checked": false
                    }
        });

        let newItem = await response.json();
        this.props.updateParent(newItem);
        this.toggleForm();
    }

    validateForm() {
        let valid = true;

        if (!this.state.item) {
            this.setState({itemInvalid: true});
            valid = false;
        }

        if (!this.state.quantity) {
            this.setState({quantityInvalid: true});
            valid = false;
        }
        return valid;
    }

    activateFormButton() {
        if (!this.props.id) {
            return <a className={"button is-small " + (this.state.activeModal ? "is-loading":"")} onClick={this.toggleForm}>
                <FontAwesomeIcon className="has-text-info" icon={faPlus}/>
            </a>
        }
        else {
            return <a className={"button is-small " + (this.state.activeModal ? "is-loading":"")} onClick={this.toggleForm}>
                <FontAwesomeIcon className="icon has-text-warning" icon={faPencilAlt}/>
            </a>
        }
    }

    render() {

        const form = <article className="message is-dark">
            <div className="message-header">
               <p>Item</p>
            </div>
            <div className="message-body">
               <form onSubmit={this.handleSubmit}>
                   <div className="field">
                       <label className="label">Item</label>
                       <div className="control">
                           <input
                               className={this.state.itemInvalid ? "input is-danger":"input"}
                               name="item" type="text"
                               value={this.state.item || ''}
                               onChange={this.handleChange}
                               placeholder="e.g. Chicken"
                           />
                       </div>
                   </div>
                   <div className="field">
                       <label className="label">Quantity</label>
                       <div className="control">
                           <input
                               className={this.state.quantityInvalid ? "input is-danger":"input"}
                               name="quantity" type="text"
                               value={this.state.quantity || ''}
                               onChange={this.handleChange}
                               placeholder="e.g. 81"
                           />
                       </div>
                   </div>
                   <div className="control">
                       <button className="button is-dark">Save</button>
                   </div>
               </form>
           </div>
        </article>;

        return <div>
            {this.activateFormButton()}
            <Modal
                modalContent={form}
                active={this.state.activeModal}
                toggle={this.toggleForm}
            />
        </div>;
    }
}

export default ItemForm;