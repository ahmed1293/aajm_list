import React, {useState} from "react";
import {fetchDjango, shoppingListsUrl} from "../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import List from "./List";
import ListForm from "./forms/ListForm";
import Modal from "./common/Modal";

export default function Tile(props) {

    const instance = props.instance;
    const [name, setName] = useState(instance.name);
    const [modal, setModal] = useState(false);

    function toggleDeleteModal() {
        setModal(m => !m);
    }

    async function _delete(e) {
        e.preventDefault();
        const response = await fetchDjango(
            shoppingListsUrl(instance.id), {
                method: 'DELETE'
            });

        if (response.ok) {
            props.fetchLists();
            setModal(false);
        }
    }

    return <div className="tile is-parent is-vertical is-4">
        <article className="tile is-child notification is-dark">
            <nav className="level">
                <div className="level-left level-is-shrinkable">
                    <p className="title">{name}</p>
                </div>
                <div className="buttons level-right">
                    <ListForm callback={setName} name={instance.name} id={instance.id}/>
                    <a className={"button is-black is-outlined " + (modal ? "is-loading":"")} onClick={toggleDeleteModal} data-testid='delete-list'>
                        <FontAwesomeIcon className="has-text-danger" icon={faTimes}/>
                    </a>
                </div>
            </nav>
            <p className="subtitle">{instance.created_at}</p>
            <List items={instance.items} listId={instance.id} narrow={true}/>
        </article>
        <Modal
            active={modal}
            toggle={toggleDeleteModal}
            modalContent={
                <article className="message is-danger">
                    <div className="message-header">
                       <p>Delete List</p>
                   </div>
                   <div className="message-body">
                       <form onSubmit={_delete}>
                           Are you sure?
                           <div className="control has-text-centered">
                               <button className="button is-danger">Delete</button>
                           </div>
                       </form>
                   </div>
                </article>
            }
        />
    </div>;
}
