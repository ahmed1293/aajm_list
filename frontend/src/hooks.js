import React, {useState} from "react";
import Modal from "./components/common/Modal";

export function useListModalForm(initialName, handleSubmit, inputTestId, saveTestId) {

    const [active, setActive] = useState(false);
    const [name, setName] = useState(initialName);
    const [nameInvalid, setNameInvalid] = useState(false);

    function toggle() {
        setActive(a => !a);
    }

    function handleChange(e) {
        setName(e.target.value);
    }

    let render = <Modal
        active={active}
        toggle={toggle}
        modalContent={
            <article className="message">
                <div className="message-header has-background-black">
                   <p>List</p>
               </div>
               <div className="message-body has-background-dark">
                   <form onSubmit={handleSubmit}>
                       <div className="field">
                           <label className="label has-text-white">Name</label>
                           <div className="control">
                               <input
                                   className={nameInvalid ? "input is-danger":"input"}
                                   name="name" type="text"
                                   value={name || ''}
                                   onChange={handleChange}
                                   placeholder="e.g. Food shop"
                                   data-testid={inputTestId}
                               />
                           </div>
                       </div>
                       <div className="control">
                           <button className="button is-black" data-testid={saveTestId}>Save</button>
                       </div>
                   </form>
               </div>
            </article>
        }
    />;

    return [render, name, setNameInvalid, toggle];

}