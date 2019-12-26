import React from "react";
import Item from "./Item";
import ItemForm from "./forms/ItemForm";

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.sort = this.sort.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    componentDidMount() {
        this.sort();
    }

    sort(updatedItem) {
        let data = this.props.items;

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

    addItem(newItem) {
        this.props.items.push(newItem);
        this.sort();
    }

    render() {
        const items = this.props.items;
        return <div className="table-container">
            <table className={"table is-striped " + (this.props.narrow ? "is-narrow":"")}>
                <thead>
                <tr>
                    <th></th>
                    <th></th>
                    <th>name</th>
                    <th>quantity</th>
                    <th>who</th>
                    <th>when</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                   <td colSpan={6} className="has-text-centered">
                       <ItemForm listId={this.props.listId} updateParent={this.addItem} smallButton={this.props.narrow}/>
                   </td>
                </tr>
                {items.map(item => <Item key={item['id']} item={item} updateTable={this.sort} />)}
            </tbody>
            </table>
        </div>;
    }
}

export default Table;