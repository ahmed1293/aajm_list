import {fireEvent, waitFor, getNodeText} from "@testing-library/react";
import List from "../components/List";
import React from "react";
import {itemList, renderWithMockApi} from "./mockApi";


test('Render as expected', () => {
    const items = itemList();
    const {getByText} = renderWithMockApi(<List items={items} />);

    items.forEach((item) => expect(getByText(`${item.name} (${item.quantity})`)).toBeVisible());
});


describe('List sorting', () => {

    function expectCorrectItemText(getByTestId, index, name, quantity) {
        const listItem = getByTestId(`item-${index}`);
        const text = getNodeText(listItem);
        expect(text).toBe(`${name} (${quantity})`);
        return text;
    }

    test('Checked items at bottom on initial sort', () => {
        let items = itemList();
        items[0]['is_checked'] = true;
        const {getByTestId} = renderWithMockApi(<List items={items} />);

        expectCorrectItemText(getByTestId, items.length-1,'onion', '1g');
    });

    // TODO this only fails if whole describe block is ran...
    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {getByTestId} = renderWithMockApi(<List items={items} />);
        const firstButton = getByTestId('check-btn-0');

        const firstRow = expectCorrectItemText(getByTestId, 0, 'onion', '1g');
        const secondRow = expectCorrectItemText(getByTestId, 1, 'banana', '100kg');
        const thirdRow = expectCorrectItemText(getByTestId, 2, 'milk', '10L');

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

        const {getByTestId} = renderWithMockApi(<List items={items} />);

        const itemBeingUnchecked = getNodeText(getByTestId('item-2'));
        fireEvent.click(getByTestId('undo-btn-2'));
        await waitFor(() => {
            expect(getNodeText(getByTestId('item-0'))).toBe(itemBeingUnchecked);
        })
    });

});


describe('Creating item', () => {

    const newItemName = "asparagus";
    const newItemQuantity = "300kg";

    async function addItem(queryByTestId, getAllByTestId, getAllByPlaceholderText, getAllByText) {
        const addItemButton = getAllByTestId('add-item-btn')[0];
        fireEvent.click(addItemButton);

        const itemInput = getAllByPlaceholderText('e.g. Chicken')[0];
        const quantityInput = getAllByPlaceholderText('e.g. 81')[0];

        fireEvent.change(itemInput, {target: {value: newItemName}});
        fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

        const submitButton = getAllByText('Save')[0];
        fireEvent.click(submitButton);
        await waitFor(() => expect(queryByTestId('active-modal')).toBeFalsy());
    }

    test('Form submission adds item to list',async () => {
        let items = itemList();

        const {queryByTestId, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = renderWithMockApi(
            <List items={items} />
        );

        await addItem(queryByTestId, getAllByTestId, getAllByPlaceholderText, getAllByText);
        expect(await findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
    });

    test('Newly added item is sorted above checked items', async () => {
        let items = itemList();

        const {
            container,
            getByTestId,
            getAllByTestId,
            getAllByPlaceholderText,
            getAllByText,
            findByText,
            queryByTestId
        } = renderWithMockApi(<List items={items} />);

        fireEvent.click(getByTestId('check-btn-0'));
        await waitFor(() => expect(getByTestId(`undo-btn-${items.length-1}`)).toBeVisible());

        await addItem(queryByTestId, getAllByTestId, getAllByPlaceholderText, getAllByText);
        const newItemText = `${newItemName} (${newItemQuantity})`;
        expect(await findByText(newItemText)).toBeVisible();

        const itemsInList = container.getElementsByClassName('list-item');
        const lastItem = itemsInList[itemsInList.length-1];
        expect(lastItem.innerHTML.toString().includes(newItemText)).toBeFalsy();
    });

});


test('Updating an existing item', async () => {
    const items = itemList();
    const itemToBeEdited = items[0];
    const nameBeforeEdit = itemToBeEdited['name'];
    const quantityBeforeEdit = itemToBeEdited['quantity'];

    const newItemName = 'NEW NAME';
    const newItemQuantity = 'NEW QUANTITY';

    const {container, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = renderWithMockApi(
        <List items={items} />
    );

    fireEvent.click(getAllByTestId('edit-item-btn')[0]);

    // using index 1 because 0 is add form (need to get rid of modal hell)
    const itemInput = getAllByPlaceholderText('e.g. Chicken')[1];
    const quantityInput = getAllByPlaceholderText('e.g. 81')[1];

    expect(itemInput.value).toBe(nameBeforeEdit);
    expect(quantityInput.value).toBe(quantityBeforeEdit);

    fireEvent.change(itemInput, {target: {value: newItemName}});
    fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

    fireEvent.click(getAllByText('Save')[1]);

    await waitFor(() => expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy());
    expect(await findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
});