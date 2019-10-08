import React from "react";
import {fetchDjango} from "../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import Table from "./Table";

class List extends React.Component {

    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
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

    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical box is-4">
            <article className="tile is-child is-primary">
                <nav className="level">
                    <div className="level-left">
                        <p className="title">{list['name']}</p>
                    </div>
                    <div className="level-right">
                        <a className="button">
                            <FontAwesomeIcon className="has-text-danger" icon={faTimes} onClick={this.delete}/>
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