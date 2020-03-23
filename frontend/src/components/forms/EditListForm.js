import React, {useContext, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {APIContext} from "../../api";
import {useListModalForm} from "../../hooks/useListModalForm";


export default function EditListForm(props) {

    const api = useContext(APIContext);
    const [formRender, listName, setError, toggle] = useListModalForm(
        props.name, handleSubmit, 'edit-list-name-input', 'existing-list-save'
    );
    let controller;

    async function handleSubmit(e) {
        e.preventDefault();
        setError(false);

        if (!listName) {
            setError(true);
            return;
        }
        let response = await api.PATCH('shopping-lists', props.id, {'name': listName});
        controller = response.controller;
        props.callback(listName);
        toggle();
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <div>
        <a className="button is-black is-outlined" onClick={toggle} data-testid="edit-list-button">
            <FontAwesomeIcon className="has-text-warning" icon={faPencilAlt}/>
        </a>
        {formRender}
    </div>
}