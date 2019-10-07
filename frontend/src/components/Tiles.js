import React from "react";
import key from "weak-key";
import Table from "./Table";
import Cookies from "js-cookie";

class Tiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
    }

    render() {
        const lists = this.state.data;

        return <div>
            <NewListButton/>
            <section className="section">
                <div className="container">
                    <div className="tile is-ancestor">
                        <div className="tile flex-wrap">
                            {lists.map(list => <Tile key={key(list)} list={list}/>)}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    }
}

class NewListButton extends React.Component {

    constructor(props) {
        super(props);
        this.createList = this.createList.bind(this);
    }

    createList() {
        return fetch('/api/shopping-lists/', {
            method: 'POST',
            headers: {
              'X-CSRFToken': Cookies.get("csrftoken"),
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": "TEST", // TODO: make editable
                "created_by": 1, // TODO: get from request
            })
        }).then(response => {
            return response.json();
        }).then(data => {
            // TODO Update tiles
        }).catch(err => console.error(err));  // TODO: handle errors
    }

    render() {
        return <section className="section">
            <div className="container">
                <a className="button is-dark is-large is-fullwidth has-text-warning" onClick={this.createList}>
                    New List
                </a>
            </div>
        </section>
    }
}


class Tile extends React.Component {
    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical box">
            <article className="tile is-child is-primary">
                <p className="title">{list['name']}</p>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']}/>
            </article>
        </div>;
    }
}

export default Tiles;