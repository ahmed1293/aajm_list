import React from "react";
import {fetchDjango, shoppingListsUrl} from "../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import Table from "./Table";
import ListForm from "./forms/ListForm";
import Modal from "./common/Modal";

class List extends React.Component {

    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.deleteConfirmation = this.deleteConfirmation.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            name: this.props.list['name'],
            activeModal: false
        }
    }

    update(name) {
        this.setState({name: name});
    }

    async delete(event) {
        event.preventDefault();
        const id = this.props.list['id'];

        const response = await fetchDjango(
            shoppingListsUrl(id), {
                method: 'DELETE'
            });

        if (response.ok) {
            this.props.updateLists();
            this.setState({activeModal: false})
        }
    }

    toggleModal() {
        this.setState({activeModal: !this.state.activeModal});
    }

    deleteConfirmation() {
        return <article className="message is-danger">
            <div className="message-header">
               <p>Delete List</p>
           </div>
           <div className="message-body">
               <form onSubmit={this.delete}>
                   Are you sure?
                   <div className="control has-text-centered">
                       <button className="button is-danger">Delete</button>
                   </div>
               </form>
           </div>
        </article>;
    }

    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical is-4">
            <article className="tile is-child box">
                <nav className="level">
                    <div className="level-left">
                        <p className="title">{this.state.name}</p>
                    </div>
                    <div className="buttons level-right">
                        <ListForm updateParent={this.update} name={list['name']} id={list['id']}/>
                        <a className={"button " + (this.state.activeModal ? "is-loading":"")} onClick={this.toggleModal}>
                            <FontAwesomeIcon className="has-text-danger" icon={faTimes}/>
                        </a>
                    </div>
                </nav>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']} listId={list['id']}/>
            </article>
            <Modal
                modalContent={this.deleteConfirmation()}
                active={this.state.activeModal}
                toggle={this.toggleModal}
            />
        </div>;
    }
}

export default List;