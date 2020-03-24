import React, {useContext, useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";
import ItemForm from "./forms/ItemForm";
import {APIContext} from "../api";


export default function Item(props) {

    const api = useContext(APIContext);

    const instance = props.instance;
    const [name, setName] = useState(instance.name);
    const [quantity, setQuantity] = useState(instance.quantity);
    const [checked, setChecked] = useState(instance.is_checked);

    let controller;

    async function checkItem() {
        const newState = !checked;
        setChecked(newState);

        let response = await api.PATCH('items', instance.id, {'is_checked': newState});
        let data = await response.data;
        controller = response.controller;
        props.callback(data);
    }

    useEffect(() => {
       return (() => {controller && controller.abort()})
    });

    return <div className="list-item">
        <nav className="level">
            <div className="level-left">
                <div className="buttons">
                    <ItemForm id={instance.id} item={name} quantity={quantity}
                      callback={(item) => {setName(item.name); setQuantity(item.quantity)}}/>
                    <a className="button is-small is-black is-outlined" onClick={checkItem} data-testid={checked ? 'undo-button':'check-button'}>
                        <FontAwesomeIcon
                            className={"icon" + (checked ? " has-text-info":" has-text-primary")}
                            icon={checked ? faUndo:faCheck}
                            data-testid={`${checked ? 'undo':'check'}-btn-${props.index}`}
                        />
                    </a>
                </div>

            </div>
            <div className="level-item">
                <div className={"has-text-white" + (checked ? " line-through":"")} data-testid={`item-${props.index}`}>
                    {name} ({quantity})
                </div>
            </div>
        </nav>
    </div>;
}
