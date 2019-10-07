import React from "react";
import Item from "./Item";

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.updateAndSort = this.updateAndSort.bind(this);
        this.state = {
            data: this.props.items
        };
    }

    componentDidMount() {
        this.updateAndSort();
    }

    updateAndSort(updatedItem) {
        let data = this.state.data;

        if (updatedItem) {
            const itemIndex = data.findIndex(item => item['id'] === updatedItem['id']);
            if (itemIndex !== -1) {
                data.splice(itemIndex, 1, updatedItem);
            }
        }

        data.sort(function (item_1, item_2) {
            return item_1['is_checked'] - item_2['is_checked'] // false values first
        });
        this.setState({data: data});
    }

    render() {
        const items = this.state.data;
        if (items.length > 0) {
           return <table className="table is-striped is-narrow">
            <thead>
                <tr>
                    <th>name</th>
                    <th>quantity</th>
                    <th>who</th>
                    <th>when</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {items.map(item => <Item key={item['id']} item={item} updateTable={this.updateAndSort} />)}
            </tbody>
        </table>;
        }
        return null;
    }
}

export default Table;