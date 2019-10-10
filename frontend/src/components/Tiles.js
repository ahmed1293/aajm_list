import React from "react";
import key from "weak-key";
import List from "./List";
import ListForm from "./forms/ListForm";

class Tiles extends React.Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);

        this.state = {
            data: [],
            loaded: false,
            errorOccurred: false
        };
    }

    componentDidMount() {
        this.update();
    }

    async update() {
        let response = await fetch('api/shopping-lists/');

        if (response.status !== 200) {
            this.setState({ errorOccurred: true });
        }
        else {
            let data = await response.json();
            this.setState({ data: data, loaded: true });
        }
    }

    render() {
        const lists = this.state.data;

        if (this.state.loaded) {
            return <div>
                <ListForm updateParent={this.update}/>
                <section className="section">
                    <div className="container">
                        <div className="tile is-ancestor flex-wrap">
                            {lists.map(list => <List key={key(list)} list={list} updateLists={this.update}/>)}
                        </div>
                    </div>
                </section>
            </div>
        }
        return <progress
            className={"progress is-small " + (this.state.errorOccurred ? "is-danger":"is-dark")}
            value={this.state.errorOccurred ? "100":""}
            max="100"
        ></progress>;
    }
}

export default Tiles;