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
        return <div className="tile is-parent">
            <article class="tile is-child is-primary">
                <p class="title">{list['name']}</p>
                <p class="subtitle">{list['created_at']}</p>
                <Table items={list['items']}/>
            </article>
        </div>;
    }
}


class Table extends React.Component {
    render() {
        const items = this.props.items;
        return <table className="table is-striped is-narrow">
            <thead>
                <tr>
                    {Object.entries(items[0]).map(h => <th>{h[0]}</th>)}
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr>
                        {Object.entries(item).map((field => <td>{field[1]}</td>))}
                    </tr>
                ))}
            </tbody>
        </table>
    }
}


export default Tiles;