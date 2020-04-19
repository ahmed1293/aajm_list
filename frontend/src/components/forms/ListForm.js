import React, {useContext, useEffect, useState} from "react";
import {APIContext} from "../../api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import {ACTIONS, DataContext} from "../../dataReducer";


export default function ListForm(props) {

    const api = useContext(APIContext);
    const dispatch = useContext(DataContext);

    const [name, setName] = useState(props.name);
    const [active, setActive] = useState(false);

    let controller;

    function toggleModal() {
        setActive(m => !m);
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const endpoint = 'shopping-lists';
        const data = {'name': name};

        let response = props.id ? await api.PATCH(endpoint, props.id, data) : await api.POST(endpoint, data);
        controller = response.controller;

        props.id ? dispatch({type: ACTIONS.editList, listId: props.id, attr: 'name', value: name}) :
            dispatch({type: ACTIONS.addList, list: await response.data});
        !props.id && setName('');
        toggleModal();
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <>
        {props.id ?
            <a className="button is-black is-outlined" onClick={toggleModal} data-testid="edit-list-button">
                <FontAwesomeIcon className="has-text-warning" icon={faPencilAlt}/>
            </a>
            :
            <div className="container has-text-centered">
                <a className="button is-dark is-large is-rounded" onClick={toggleModal}>New list</a>
            </div>
        }
        {active && <Modal toggle={toggleModal} modalContent={
            <article className="message">
                <div className="message-header has-background-black">
                   <p>List</p>
               </div>
               <div className="message-body has-background-dark">
                   <form onSubmit={handleSubmit}>
                       <div className="field">
                           <label className="label has-text-white" htmlFor="list-name">Name</label>
                           <div className="control">
                               <input
                                   className="input has-background-black has-text-white" name="name" id="list-name"
                                   type="text" value={name || ''} onChange={handleChange} placeholder="e.g. Food shop"
                               />
                           </div>
                       </div>
                       <div className="control">
                           <button className="button is-black" disabled={!name}>Save</button>
                       </div>
                   </form>
               </div>
            </article>
        }/>}
    </>
}