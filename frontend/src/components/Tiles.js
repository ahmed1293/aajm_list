import React from "react";
import "bulma/css/bulma.css";


class Tiles extends React.Component {
    render() {
        const noOfLists = this.props.data.length

        if (noOfLists == 0) {
            return <p>Nothing to show</p>;
        }
        return <div className="tile is-ancestor">{this.props.data.map(list => <Tile list={list}/>)}</div>;

    }
}


class Tile extends React.Component {
    render() {
        const list = this.props.list;
        return <div className="tile">{list.name}</div>;
    }
}


export default Tiles;