import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import List from "./List";
import EditListForm from "./forms/EditListForm";
import Modal from "./Modal";
import {APIContext} from "../api";

export default function Tile(props) {

    const api = useContext(APIContext);

    const instance = props.instance;
    const [name, setName] = useState(instance.name);
    const [modal, setModal] = useState(false);

    let controller;

    function toggleDeleteModal() {
        setModal(m => !m);
    }

    async function _delete(e) {
        e.preventDefault();
        controller = await api.DELETE('shopping-lists', instance.id);
        props.deleteCallback(instance.id);
        setModal(false);
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <div className="tile is-parent is-vertical is-4">
        <article className="tile is-child notification is-dark">
            <nav className="level">
                <div className="level-left level-is-shrinkable">
                    <p className="title">{name}</p>
                </div>
                <div className="buttons level-right">
                    <EditListForm callback={setName} name={instance.name} id={instance.id}/>
                    <a className={"button is-black is-outlined " + (modal ? "is-loading":"")} onClick={toggleDeleteModal}
                       data-testid='delete-list'>
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
                <article className="message">
                    <div className="message-header has-background-black">
                       <p>Delete List</p>
                   </div>
                   <div className="message-body has-background-dark has-text-white">
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
