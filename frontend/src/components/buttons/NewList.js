import React from "react";
import {fetchDjango} from "../../util";


class NewListButton extends React.Component {

    constructor(props) {
        super(props);
        this.createList = this.createList.bind(this);
    }

    createList() {
        return fetchDjango('/api/shopping-lists/', {
            method: 'POST',
            body: {
                "name": "TEST", // TODO: make editable
                "created_by": 1, // TODO: get from request
            }
        }).then(() => {
            this.props.updateLists();
        });  // TODO: handle errors
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

export default NewListButton