import React from "react";
import key from "weak-key";
import Table from "./Table";
import NewListButton from "./buttons/NewList";

class Tiles extends React.Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);

        this.state = {
            data: [],
            loaded: false,
            placeholder: 'Loading...'
        };
    }

    componentDidMount() {
        this.update();
    }

    update() {
        fetch('api/shopping-lists/')
            .then(response => {
                if (response.status !== 200) {
                    return this.setState({ placeholder: "Something went wrong" });
                }
                return response.json();
            })
            .then(data =>
                this.setState({ data: data, loaded: true })
            );
    }

    render() {
        const lists = this.state.data;

        if (!this.state.loaded) {
            return <p>{this.state.placeholder}</p>
        }
        return <div>
            <NewListButton updateLists={this.update}/>
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


class Tile extends React.Component {
    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical box is-4">
            <article className="tile is-child is-primary">
                <p className="title">{list['name']}</p>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']}/>
            </article>
        </div>;
    }
}

export default Tiles;