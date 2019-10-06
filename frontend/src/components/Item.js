import React from "react";
import Cookies from "js-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons";


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

        fetch('/api/items/' + this.id + '/', {
            method: 'PATCH',
            headers: {
              'X-CSRFToken': Cookies.get("csrftoken"),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "is_checked": newState
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            this.props.updateTable(data);
        }).catch(err => console.error(err));
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