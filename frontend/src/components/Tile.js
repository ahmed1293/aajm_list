import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import List from "./List";
import Modal from "./Modal";
import {APIContext} from "../api";
import ListForm from "./forms/ListForm";
import {ACTIONS, DataContext} from "../dataReducer";

export default function Tile(props) {

    const api = useContext(APIContext);
    const dispatch = useContext(DataContext);

    const [modal, setModal] = useState(false);

    let controller;

    function toggleDeleteModal() {
        setModal(m => !m);
    }

    async function _delete(e) {
        e.preventDefault();
        controller = await api.DELETE('shopping-lists', props.list.id);
        setModal(false);
        dispatch({type: ACTIONS.deleteList, listId: props.list.id});
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <div className="tile is-parent is-vertical is-4">
        <article className="tile is-child notification is-dark" style={{padding: '10px'}}>
            <nav className="level is-mobile">
                <div className="level-left level-is-shrinkable">
                    <p className="title">{props.list.name}</p>
                </div>
                <div className="buttons level-right">
                    <ListForm name={props.list.name} id={props.list.id}/>
                    <a className={"button is-black is-outlined " + (modal ? "is-loading":"")} onClick={toggleDeleteModal}
                       data-testid='delete-list'>
                        <FontAwesomeIcon className="has-text-danger" icon={faTimes}/>
                    </a>
                </div>
            </nav>
            <p className="subtitle">{props.list.created_at}</p>
            <List items={props.list.items} listId={props.list.id}/>
        </article>
        {modal && <Modal toggle={toggleDeleteModal} modalContent={
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
        }/>}
    </div>;
}
