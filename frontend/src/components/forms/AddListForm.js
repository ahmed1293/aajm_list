import React, {useContext, useEffect, useState} from "react";
import Modal from "../Modal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import {APIContext} from "../../api";
import {useListModalForm} from "../../hooks/useListModalForm";


export default function AddListForm(props) {

    const api = useContext(APIContext);
    const [formRender, listName, setError, toggle] = useListModalForm(
        props.name, handleSubmit, 'new-list-name-input', 'new-list-save'
    );
    let controller;

    async function handleSubmit(e) {
        e.preventDefault();
        setError(false);

        if (!listName) {
            setError(true);
            return;
        }
        let response = await api.POST('shopping-lists', {'name': listName});
        controller = response.controller;
        props.callback(await response.data);
        toggle();
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <div>
        <div className="container has-text-centered">
            <a className="button is-dark is-large is-rounded" onClick={toggle}>New list</a>
        </div>
        {formRender}
    </div>
}