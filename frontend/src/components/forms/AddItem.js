import React from "react";
import {fetchDjango} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";


class AddItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.state = {
            addingItem: false,
            item: '',
            quantity: '',
            itemInvalid: false,
            quantityInvalid: false
        };
    }

    toggleForm() {
        this.setState({addingItem: !this.state.addingItem});
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

        let response = await fetchDjango('/api/items/', {
            method: 'POST',
            body: {
                "name": this.state.item,
                "quantity": this.state.quantity,
                "list": this.props.listId,
                "added_by": 1,
                "is_checked": false
            }
        });

        let newItem = await response.json();
        this.props.updateItemList(newItem);
        this.setState({itemInvalid: false, quantityInvalid: false});
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

    render() {
       return <div>
        <a className="button is-small" onClick={this.toggleForm}>
            <FontAwesomeIcon className="has-text-info" icon={faPlus}/>
        </a>
        <div className={this.state.addingItem ? "modal is-active":"modal"}>
           <div className="modal-background" onClick={this.toggleForm}></div>
           <div className="modal-content">
               <article className="message is-dark">
                   <div className="message-header">
                       <p>Add Item</p>
                   </div>
                   <div className="message-body">
                       <form onSubmit={this.handleSubmit}>
                           <div className="field">
                               <label className="label">Item</label>
                               <div className="control">
                                   <input
                                       className={this.state.itemInvalid ? "input is-danger":"input"}
                                       name="item" type="text"
                                       value={this.state.item}
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
                                       value={this.state.quantity}
                                       onChange={this.handleChange}
                                       placeholder="e.g. 81"
                                   />
                               </div>
                           </div>
                           <div className="control">
                               <button className="button is-dark">Add</button>
                           </div>
                       </form>
                   </div>
               </article>
           </div>
           <button className="modal-close is-large" aria-label="close" onClick={this.toggleForm}></button>
        </div>
       </div>;
    }
}

export default AddItemForm;