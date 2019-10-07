import React from "react";
import key from "weak-key";
import Table from "./Table";

class Tiles extends React.Component {
    render() {
        const noOfLists = this.props.data.length;

        if (noOfLists === 0) {
            return <p>Nothing to show</p>;  // TODO: add list button
        }
        return <div className="tile is-ancestor">
            <div className="tile flex-wrap">
                {this.props.data.map(list => <Tile key={key(list)} list={list}/>)}
            </div>
        </div>;
    }
}


class Tile extends React.Component {
    render() {
        const list = this.props.list;
        return <div className="tile is-parent is-vertical">
            <article className="tile is-child is-primary">
                <p className="title">{list['name']}</p>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']}/>
            </article>
        </div>;
    }
}

export default Tiles;