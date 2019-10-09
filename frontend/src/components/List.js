import React from "react";
import {fetchDjango} from "../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faPencilAlt} from "@fortawesome/free-solid-svg-icons";
import Table from "./Table";
import ListForm from "./forms/ListForm";

class List extends React.Component {

    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.state = {
            name: this.props.list['name']
        }
    }

    delete() {
        const id = this.props.list['id'];
        return fetchDjango('/api/shopping-lists/' + id + '/', {
                method: 'DELETE'
            }
        ).then(() => {
            this.props.updateLists();
        })
    }

    update(name) {
        this.setState({name: name});
    }

    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical is-4">
            <article className="tile is-child box">
                <nav className="level">
                    <div className="level-left">
                        <p className="title">{this.state.name}</p>
                    </div>
                    <div className="buttons level-right">
                        <ListForm updateParent={this.update} name={list['name']} id={list['id']}/>
                        <a className="button" onClick={this.delete}>
                            <FontAwesomeIcon className="has-text-danger" icon={faTimes}/>
                        </a>
                    </div>
                </nav>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']} listId={list['id']}/>
            </article>
        </div>;
    }
}

export default List;