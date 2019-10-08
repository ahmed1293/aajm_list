import React from "react";
import Item from "./Item";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {fetchDjango} from "../util";

class Table extends React.Component {
    constructor(props) {
        super(props);
        this.updateAndSort = this.updateAndSort.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.addItem = this.addItem.bind(this);
        this.state = {
            data: this.props.items,
            addingItem: false
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

    toggleForm() {
        this.setState({addingItem: !this.state.addingItem});
    }

    async addItem(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        // TODO: validate data

        let response = await fetchDjango('/api/items/', {
            method: 'POST',
            body: {
                "name": data.get('item'),
                "quantity": data.get('quantity'),
                "list": this.props.listId,
                "added_by": 1,
                "is_checked": false
            }
        });

        if (response.status !== 201) {
            // TODO: do something
        }
        else {
            let newItem = await response.json();
            this.state.data.push(newItem);
            this.toggleForm();
            this.updateAndSort();
        }
    }

    render() {
        const items = this.state.data;
        if (items.length > 0) {
           return <div>
            <table className="table is-striped is-narrow">
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
                    <tr>
                       <td colSpan={5} className="has-text-centered">
                           <a className="button is-small">
                                <FontAwesomeIcon className="has-text-info" icon={faPlus} onClick={this.toggleForm}/>
                            </a>
                       </td>
                    </tr>
                    {items.map(item => <Item key={item['id']} item={item} updateTable={this.updateAndSort} />)}
                </tbody>
            </table>
           <div className={this.state.addingItem ? "modal is-active":"modal"}>
               <div className="modal-background" onClick={this.toggleForm}></div>
               <div className="modal-content">
                   <article className="message is-dark">
                       <div className="message-header">
                           <p>Add Item</p>
                       </div>
                       <div className="message-body">
                           <form onSubmit={this.addItem}>
                               <div className="field">
                                   <label className="label">Item</label>
                                   <div className="control">
                                       <input className="input" name="item" type="text" placeholder="e.g. Chicken"/>
                                   </div>
                               </div>
                               <div className="field">
                                   <label className="label">Quantity</label>
                                   <div className="control">
                                       <input className="input" name="quantity" type="text" placeholder="e.g. 81"/>
                                   </div>
                               </div>
                               <div className="control">
                                   <button className="button is-dark">Add</button>
                               </div>
                           </form>
                       </div>
                   </article>
               </div>
               <button className="modal-close is-large" aria-label="close" onClick={this.toggleForm}></button>
           </div>
           </div>;
        }
        return null;
    }
}

export default Table;