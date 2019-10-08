import React from "react";
import {fetchDjango} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";


class AddItemForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.addItem = this.addItem.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.state = {
            addingItem: false,
            itemFormError: false,
            quantityFormError: false
        };
    }

    toggleForm() {
        this.setState({addingItem: !this.state.addingItem});
    }

    async addItem(event) {
        event.preventDefault();
        this.setState({itemFormError: false, quantityFormError: false});
        const data = new FormData(event.target);

        if (!this.validateForm(data)) {
            return null;
        }

        let response = await fetchDjango('/api/items/', {
            method: 'POST',
            body: {
                "name": data.get('item'),
                "quantity": data.get('quantity'),
                "list": this.props.listId,
                "added_by": 1,
                "is_checked": false
            }
        });

        let newItem = await response.json();
        this.props.updateItemList(newItem);
        this.setState({itemFormError: false, quantityFormError: false});
        this.toggleForm();
    }

    validateForm(data) {
        let valid = true;

        if (!data.get('item')) {
            this.setState({itemFormError: true});
            valid = false;
        }

        if (!data.get('quantity')) {
            this.setState({quantityFormError: true});
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
                       <form onSubmit={this.addItem}>
                           <div className="field">
                               <label className="label">Item</label>
                               <div className="control">
                                   <input
                                       className={this.state.itemFormError ? "input is-danger":"input"}
                                       name="item" type="text"
                                       placeholder="e.g. Chicken"
                                   />
                               </div>
                           </div>
                           <div className="field">
                               <label className="label">Quantity</label>
                               <div className="control">
                                   <input
                                       className={this.state.quantityFormError ? "input is-danger":"input"}
                                       name="quantity" type="text"
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