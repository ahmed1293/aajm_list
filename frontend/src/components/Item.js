import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";
import {fetchDjango} from "../util";
import ItemForm from "./forms/ItemForm";


export default function Item(props) {

    const instance = props.instance;
    const [name, setName] = useState(instance.name);
    const [quantity, setQuantity] = useState(instance.quantity);
    const [checked, setChecked] = useState(instance.is_checked);

    function checkItem() {
        const newState = !checked;
        setChecked(newState);

        return fetchDjango('/api/items/' + instance.id + '/', {
            method: 'PATCH',
            body: {
                "is_checked": newState
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            props.callback(data);
        });
    }

    return <tr className={checked ? "line-through":null}>
        <td>
            <ItemForm id={instance.id} item={name} quantity={quantity}
                      callback={(item) => {setName(item.name); setQuantity(item.quantity)}}/>
        </td>
        <td>
            <a className="button is-small" onClick={checkItem} data-testid={checked ? 'undo-button':'check-button'}>
                <FontAwesomeIcon
                    className={checked ? "icon has-text-info":"icon has-text-primary"}
                    icon={checked ? faUndo:faCheck}
                />
            </a>
        </td>
        <td>{name}</td>
        <td>{quantity}</td>
        <td>{instance.added_by}</td>
        <td>{instance.added_at}</td>
    </tr>
}
