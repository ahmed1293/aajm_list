import React from "react";
import {fetchDjango} from "../../util";
import Modal from "../common/Modal";


class AddListForm extends React.Component {

    constructor(props) {
        super(props);
        this.toggleForm = this.toggleForm.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            activeModal: false,
            name: '',
            nameInvalid: false
        }
    }

    toggleForm() {
        this.setState({activeModal: !this.state.activeModal});
    }

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({nameInvalid: false});

        if (!this.state.name) {
            this.setState({nameInvalid: true});
            return null;
        }

        let response = await fetchDjango('/api/shopping-lists/', {
            method: 'POST',
            body: {
                "name": this.state.name,
                "created_by": 1, // TODO: get from request
            }
        });

        if (response.status === 201) {
            this.props.updateLists();
            this.setState({name: '', nameInvalid: false});
            this.toggleForm();
        }
    }

    render() {

        const form = <article className="message is-dark">
            <div className="message-header">
               <p>New List</p>
           </div>
           <div className="message-body">
               <form onSubmit={this.handleSubmit}>
                   <div className="field">
                       <label className="label">Name</label>
                       <div className="control">
                           <input
                               className={this.state.nameInvalid ? "input is-danger":"input"}
                               name="name" type="text"
                               value={this.state.name}
                               onChange={this.handleChange}
                               placeholder="e.g. Food shop"
                           />
                       </div>
                   </div>
                   <div className="control">
                       <button className="button is-dark">Add</button>
                   </div>
               </form>
           </div>
        </article>;

        return <section className="section">
            <div className="container">
                <a className="button is-dark is-large is-fullwidth has-text-warning" onClick={this.toggleForm}>
                    New List
                </a>
            </div>
            <Modal
                modalContent={form}
                active={this.state.activeModal}
                toggle={this.toggleForm}
            />
        </section>
    }
}

export default AddListForm