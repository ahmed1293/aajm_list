import React from "react";
import {fetchDjango, shoppingListsUrl} from "../../util";
import Modal from "../common/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";


class ListForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.activateFormButton = this.activateFormButton.bind(this);
        this.state = {
            activeModal: false,
            name: this.props.name,
            nameInvalid: false
        }
    }

    toggleForm() {
        this.setState({activeModal: !this.state.activeModal});
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState({name: value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({nameInvalid: false});

        if (!this.state.name) {
            this.setState({nameInvalid: true});
            return null;
        }

        let response = await fetchDjango(
            shoppingListsUrl(this.props.id), {
                method: this.props.id ? 'PATCH':'POST',
                body: {
                    "name": this.state.name,
                    "created_by": 1, // TODO: get from request
                }
        });

        if (response.ok) {
            this.props.updateParent(this.state.name);
            this.toggleForm();
        }
    }

    activateFormButton() {
        if (!this.props.id) {
            return <div className="container has-text-centered">
                <a className="button is-dark is-large is-rounded" onClick={this.toggleForm}>
                    New list
                </a>
            </div>
        }
        else {
            return <a className="button" onClick={this.toggleForm}>
                <FontAwesomeIcon className="has-text-warning" icon={faPencilAlt}/>
            </a>
        }
    }

    render() {

        const form = <article className="message is-dark">
            <div className="message-header">
               <p>List</p>
           </div>
           <div className="message-body">
               <form onSubmit={this.handleSubmit}>
                   <div className="field">
                       <label className="label">Name</label>
                       <div className="control">
                           <input
                               className={this.state.nameInvalid ? "input is-danger":"input"}
                               name="name" type="text"
                               value={this.state.name || ''}
                               onChange={this.handleChange}
                               placeholder="e.g. Food shop"
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
        </div>
    }
}

export default ListForm