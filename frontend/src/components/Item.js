import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";
import {fetchDjango} from "../util";
import ItemForm from "./forms/ItemForm";


function Item2(props) {

    const [checked, setChecked] = useState(props.item.is_checked);

    function checkItem() {
        const newState = !checked;
        setChecked(newState);

        return fetchDjango('/api/items/' + props.item['id'] + '/', {
            method: 'PATCH',
            body: {
                "is_checked": newState
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            props.updateTable(data);
        });
    }

    return <tr className={checked ? "line-through":null}>
        <td>
            <ItemForm id={props.item.id} item={props.item.name} quantity={props.item.quantity}
                      updateParent={this.update}/>
        </td>
        <td>
            <a className="button is-small" onClick={checkItem}>
                <FontAwesomeIcon
                    className={checked ? "icon has-text-info":"icon has-text-primary"}
                    icon={checked ? faUndo:faCheck}
                />
            </a>
        </td>
        <td>{props.item.name}</td>
        <td>{props.item.quantity}</td>
        <td>{props.item.added_by}</td>
        <td>{props.item.added_at}</td>
    </tr>

}


class Item extends React.Component {

    constructor(props) {
        super(props);
        this.checkItem = this.checkItem.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            name: props.item['name'],
            quantity: props.item['quantity'],
            checked: props.item['is_checked']
        };
    }

    checkItem() {
        const newState = !this.state.checked;
        this.setState({checked: newState});

        return fetchDjango('/api/items/' + this.props.item['id'] + '/', {
            method: 'PATCH',
            body: {
                "is_checked": newState
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            this.props.updateTable(data);
        });
    }

    update(item) {
        this.setState({name: item['name'], quantity: item['quantity']});
    }

    render() {
        const item = this.props.item;
        return <tr className={this.state.checked ? "line-through":null}>
            <td>
                <ItemForm id={item['id']} item={item['name']} quantity={item['quantity']} updateParent={this.update}/>
            </td>
            <td>
                <a className="button is-small" onClick={this.checkItem}>
                    <FontAwesomeIcon
                        className={this.state.checked ? "icon has-text-info":"icon has-text-primary"}
                        icon={this.state.checked ? faUndo:faCheck}
                    />
                </a>
            </td>
            <td>{this.state.name}</td>
            <td>{this.state.quantity}</td>
            <td>{item['added_by']}</td>
            <td>{item['added_at']}</td>
        </tr>
    }
}

export default Item;