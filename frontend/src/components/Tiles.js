import React from "react";
import key from "weak-key";


class Tiles extends React.Component {
    render() {
        const noOfLists = this.props.data.length

        if (noOfLists == 0) {
            return <p>Nothing to show</p>;
        }
        return <div className="tile is-ancestor">
            {this.props.data.map(list => <Tile key={key(list)} list={list}/>)}
        </div>;

    }
}


class Tile extends React.Component {
    render() {
        const list = this.props.list;
        return <div className="tile is-parent">
            <article className="tile is-child is-primary">
                <p className="title">{list['name']}</p>
                <p className="subtitle">{list['created_at']}</p>
                <Table items={list['items']}/>
            </article>
        </div>;
    }
}


class Table extends React.Component {
    render() {
        const items = this.props.items;
        if (items.length > 0) {
           return <table className="table is-striped is-narrow">
            <thead>
                <tr>
                    {Object.entries(items[0]).map(h => <th key={key(h)}>{h[0]}</th>)}
                </tr>
            </thead>
            <tbody>
                {items.map(item => (
                    <tr key={key(item)}>
                        {Object.entries(item).map(field => <td key={key(field)}>{field[1]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>;
        }
        return null;
    }
}


export default Tiles;