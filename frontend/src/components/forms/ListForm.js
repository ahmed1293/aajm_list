import React, {useState} from "react";
import {fetchDjango, shoppingListsUrl} from "../../util";
import Modal from "../common/Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";


export default function ListForm(props) {
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');
    const [nameInvalid, setNameInvalid] = useState(false);

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

        // TODO: pass a service prop
        let response = await fetchDjango(
            shoppingListsUrl(props.id), {
                method: props.id ? 'PATCH':'POST',
                body: {
                    "name": name,
                }
        });

        if (response.ok) {
            props.fetchLists();
            toggleForm();
        }
    }

    function renderActivateFormButton() {
        if (!props.id) {
            return <div className="container has-text-centered">
                <a className={"button is-dark is-large is-rounded " + (modal ? "is-loading":"")} onClick={toggleForm}>
                    New list
                </a>
            </div>
        }
        else {
            return <a className={"button " + (modal ? "is-loading":"")} onClick={toggleForm} data-testid="edit-list-button">
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