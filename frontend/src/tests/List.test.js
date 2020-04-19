import {fireEvent, waitFor, getNodeText, render} from "@testing-library/react";
import List from "../components/List";
import React, {useReducer, useState} from "react";
import {api, itemList} from "./mockApi";
import {renderWithMockContexts} from "./util";
import {DataContext, dataReducer} from "../dataReducer";
import {APIContext} from "../api";


function ComponentToTest({items}) {
    const [state, dispatch] = useReducer(dataReducer, {data: [{id: 1, items: items}]})

    return <APIContext.Provider value={api}>
        <DataContext.Provider value={dispatch}>
            <List items={state.data[0].items} listId={1}/>
        </DataContext.Provider>
    </APIContext.Provider>
}


test('Render as expected', () => {
    const items = itemList();
    const {getByText} = render(<ComponentToTest items={items}/>)

    items.forEach((item) => expect(getByText(`${item.name} (${item.quantity})`)).toBeVisible());
});


describe('List sorting', () => {

    function expectCorrectItemPosition(getByTestId, index, name, quantity) {
        const listItem = getByTestId(`item-${index}`);
        const text = getNodeText(listItem);
        expect(text).toBe(`${name} (${quantity})`);
        return text;
    }

    test('Checked items at bottom on initial sort', () => {
        let items = itemList();
        items[0]['is_checked'] = true;

        const {getByTestId} = render(<ComponentToTest items={items}/>)

        expectCorrectItemPosition(getByTestId, items.length-1, items[0].name, items[0].quantity);
    });

    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {getByTestId} = render(<ComponentToTest items={items} />);
        const firstButton = getByTestId('check-btn-0');

        const firstRow = expectCorrectItemPosition(getByTestId, 0, items[0].name, items[0].quantity);
        const secondRow = expectCorrectItemPosition(getByTestId, 1, items[1].name, items[1].quantity);
        const thirdRow = expectCorrectItemPosition(getByTestId, 2, items[2].name, items[2].quantity);

        fireEvent.click(firstButton);

        await waitFor(() => {
            const newFirstRow = getNodeText(getByTestId('item-0'));
            const newSecondRow = getNodeText(getByTestId('item-1'));
            const newThirdRow = getNodeText(getByTestId('item-2'));

            expect(newFirstRow).toBe(secondRow);
            expect(newSecondRow).toBe(thirdRow);
            expect(newThirdRow).toBe(firstRow);
        });
    });

    test('Items move away from bottom if check is undone', async () => {
        const items = itemList();
        items[0]['is_checked'] = true;
        items[1]['is_checked'] = true;
        items[2]['is_checked'] = true;

        const {getByTestId} = renderWithMockContexts(<ComponentToTest items={items} />);

        const itemBeingUnchecked = getNodeText(getByTestId('item-2'));
        fireEvent.click(getByTestId('undo-btn-2'));
        await waitFor(() => {
            expect(getNodeText(getByTestId('item-0'))).toBe(itemBeingUnchecked);
        })
    });

});


test('Adding a new item',async () => {
    let items = itemList();
    const newItemName = "asparagus";
    const newItemQuantity = "300kg";

    const {queryByTestId, getByTestId, getByPlaceholderText, getByText, findByText} = render(
        <ComponentToTest items={items} />
    );

    fireEvent.click(getByTestId('add-item-btn'));
    fireEvent.change(getByPlaceholderText('e.g. Chicken'), {target: {value: newItemName}});
    fireEvent.change(getByPlaceholderText('e.g. 81'), {target: {value: newItemQuantity}});
    fireEvent.click(getByText('Save'))

    await waitFor(() => expect(queryByTestId('modal')).toBeFalsy());
    expect(await findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
});


test('Updating an existing item', async () => {
    const items = itemList();
    const itemToBeEdited = items[0];
    const nameBeforeEdit = itemToBeEdited['name'];
    const quantityBeforeEdit = itemToBeEdited['quantity'];

    const newItemName = 'NEW NAME';
    const newItemQuantity = 'NEW QUANTITY';

    const {queryByTestId, getAllByTestId, getByPlaceholderText, getByText, findByText} = render(
        <ComponentToTest items={items} />
    );

    fireEvent.click(getAllByTestId('edit-item-btn')[0]);

    // using index 1 because 0 is add form (need to get rid of modal hell)
    const itemInput = getByPlaceholderText('e.g. Chicken');
    const quantityInput = getByPlaceholderText('e.g. 81');

    expect(itemInput.value).toBe(nameBeforeEdit);
    expect(quantityInput.value).toBe(quantityBeforeEdit);

    fireEvent.change(itemInput, {target: {value: newItemName}});
    fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

    fireEvent.click(getByText('Save'));

    await waitFor(() => expect(queryByTestId('modal')).toBeFalsy());
    expect(await findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
});