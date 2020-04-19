import {createContext} from "react";

export const ACTIONS = {
    setData: 'set data',
    addList: 'add list',
    editList: 'edit list attribute',
    deleteList: 'delete list',
    addItem: 'add item to list',
    editItem: 'edit item in list'
}

// todo: may need to speed some of these up when there's a huge no of lists
export function dataReducer(state, action) {
    let _data = [...state.data];
    switch (action.type) {
        case ACTIONS.setData:
            return {data: action.data}
        case ACTIONS.addList:
            _data.unshift(action.list);
            return {data: _data}
        case ACTIONS.editList:
            const index = _data.findIndex(d => d.id === action.listId)
            _data[index][action.attr] = action.value;
            return {data: _data}
        case ACTIONS.deleteList:
            return {data: state.data.filter((l) => l.id !== action.listId)}
        case ACTIONS.addItem:
            _data.find(l => l.id === action.listId).items.push(action.item);
            return {data: _data}
        case ACTIONS.editItem:
            let item = _data.find(l => l.id === action.item.list).items.find(i => i.id === action.item.id)
             // check if not undefined in case the intended value is literally 'false'
            action.values.forEach(v => v.value !== undefined ? item[v.lookup] = v.value:null)
            return {data: _data}
        default:
            throw new Error('Unexpected action type!')
    }
}

export const DataContext = createContext(null);
