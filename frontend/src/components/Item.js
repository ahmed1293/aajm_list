import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";
import {fetchDjango} from "../util";


class Item extends React.Component {

    constructor(props) {
        super(props);
        this.id = props.item['id'];
        this.checkItem = this.checkItem.bind(this);
        this.state = {
            checked: props.item['is_checked']
        };
    }

    checkItem() {
        const newState = !this.state.checked;
        this.setState({checked: newState});

        return fetchDjango('/api/items/' + this.id + '/', {
            method: 'PATCH',
            body: {
                "is_checked": newState
            }
        }).then(response => {
            return response.json();
        }).then(data => {
            this.props.updateTable(data);
        }); // TODO: handle errors
    }

    render() {
        const item = this.props.item;
        return <tr className={this.state.checked ? "line-through":null}>
            <td>{item['name']}</td>
            <td>{item['quantity']}</td>
            <td>{item['added_by']}</td>
            <td>{item['added_at']}</td>
            <td>
                <a className="button is-small">
                    <FontAwesomeIcon
                        className={this.state.checked ? "icon has-text-info":"icon has-text-primary"}
                        icon={this.state.checked ? faUndo:faCheck}
                        onClick={this.checkItem}/>
                </a>
            </td>
        </tr>
    }
}

export default Item;