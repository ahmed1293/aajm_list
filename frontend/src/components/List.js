import React, {useEffect, useState} from "react";
import Item from "./Item";
import ItemForm from "./forms/ItemForm";


export default function List(props) {

    const [data, setData] = useState(props.items);

    function sort(updatedItem) {
        let newData = [...data];

        if (updatedItem) {
            const itemIndex = newData.findIndex(item => item['id'] === updatedItem['id']);
            if (itemIndex !== -1) {
                newData.splice(itemIndex, 1, updatedItem);
            }
        }

        newData.sort((item_1, item_2) => {
            return item_1['is_checked'] - item_2['is_checked'] // false values first
        });
        setData(newData);
    }

    useEffect(() => sort(), [data.length]);

    function addItem(item) {
        const newData = [...data];
        newData.push(item);
        setData(newData);
    }

    return <div>
        <div className="has-text-centered">
            <ItemForm listId={props.listId} callback={addItem}/>
        </div>
        <br/>
        <div className="list has-background-dark">
            {data.map((item, index) => <Item key={item.id} instance={item} callback={sort} index={index} />)}
        </div>
    </div>;
}
