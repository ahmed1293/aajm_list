import React, {useContext, useEffect, useState} from "react";
import Modal from "../common/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {APIContext} from "../../api";


export default function ListForm(props) {
    // TODO: should be two separate components

    const api = useContext(APIContext);

    const [modal, setModal] = useState(false);
    const [name, setName] = useState(props.name);
    const [nameInvalid, setNameInvalid] = useState(false);

    let controller;

    function toggleForm() {
        setModal(m => !m);
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setNameInvalid(false);

        if (!name) {
            setNameInvalid(true);
            return null;
        }

        const endpoint = 'shopping-lists';
        const body = {'name': name};
        let response = props.id ? await api.PATCH(endpoint, props.id, body) : await api.POST(endpoint, body);
        controller = response.controller;
        props.callback(name);
        toggleForm();
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    function renderActivateFormButton() {
        if (!props.id) {
            return <div className="container has-text-centered">
                <a className={"button is-dark is-large is-rounded " + (modal ? "is-loading":"")} onClick={toggleForm}>
                    New list
                </a>
            </div>
        }
        else {
            return <a className={"button is-black is-outlined" + (modal ? "is-loading":"")} onClick={toggleForm} data-testid="edit-list-button">
                <FontAwesomeIcon className="has-text-warning" icon={faPencilAlt}/>
            </a>
        }
    }

    return <div>
        {renderActivateFormButton()}
        <Modal
            active={modal}
            toggle={toggleForm}
            modalContent={
                <article className="message is-dark">
                    <div className="message-header">
                       <p>List</p>
                   </div>
                   <div className="message-body">
                       <form onSubmit={handleSubmit}>
                           <div className="field">
                               <label className="label">Name</label>
                               <div className="control">
                                   <input
                                       className={nameInvalid ? "input is-danger":"input"}
                                       name="name" type="text"
                                       value={name || ''}
                                       onChange={handleChange}
                                       placeholder="e.g. Food shop"
                                       data-testid={props.id ? 'existing-list-name-input':'new-list-name-input'}
                                   />
                               </div>
                           </div>
                           <div className="control">
                               <button className="button is-dark"
                                       data-testid={props.id ? 'existing-list-save':'new-list-save'}>Save
                               </button>
                           </div>
                       </form>
                   </div>
                </article>
            }
        />
    </div>
}