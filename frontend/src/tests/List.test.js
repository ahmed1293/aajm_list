import {fireEvent, render, waitFor, getNodeText} from "@testing-library/react";
import List from "../components/List";
import React from "react";
import {getMockPatchResponse, itemList} from "./testUtil";


test('Render as expected', () => {
    const items = itemList();
    const {getByText} = render(<List items={items} />);

    items.forEach((item) => expect(getByText(`${item.name} (${item.quantity})`)).toBeVisible());
});


describe('List sorting', () => {

    function checkItemText(getByTestId, index, name, quantity) {
        const listItem = getByTestId(`item-${index}`);
        const text = getNodeText(listItem);
        expect(text).toBe(`${name} (${quantity})`);
        return text;
    }

    const mockFetch = jest.fn();
    beforeAll(() => {
        global.fetch = mockFetch.mockReturnValue(
            getMockPatchResponse()
        );
    });

    test('Checked items at bottom on initial sort', () => {
        let items = itemList();
        items[0]['is_checked'] = true;
        const {getByTestId} = render(<List items={items} />);

        checkItemText(getByTestId, items.length-1,'onion', '1g');
    });

    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {getByTestId} = render(<List items={items} />);
        const firstButton = getByTestId('check-btn-0');

        const firstRow = checkItemText(getByTestId, 0, 'onion', '1g');
        const secondRow = checkItemText(getByTestId, 1, 'banana', '100kg');
        const thirdRow = checkItemText(getByTestId, 2, 'milk', '10L');

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
        let mockItems = itemList();
        mockItems[0]['is_checked'] = true;
        mockItems[1]['is_checked'] = true;
        mockItems[2]['is_checked'] = true;

        // fetch must return the correct PATCH response for sorting
        global.fetch = jest.fn()
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[0]}})
            ) // check onion
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[1]}})
            ) // check banana
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[2]}})
            ) // check milk
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {
                    mockItems[0]['is_checked'] = false;
                    return mockItems[0]}})
            ); // check onion again

        const {getByTestId, getAllByTestId} = render(<List items={itemList()} />);

        // check all items
        fireEvent.click(getByTestId('check-btn-0'));
        await waitFor(() => expect(getAllByTestId('undo-btn-', {exact: false}).length).toBe(1));
        fireEvent.click(getByTestId('check-btn-0'));
        await waitFor(() => expect(getAllByTestId('undo-btn-', {exact: false}).length).toBe(2));
        fireEvent.click(getByTestId('check-btn-0'));
        await waitFor(() => expect(getAllByTestId('undo-btn-', {exact: false}).length).toBe(3));

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

    function mockPostResponse() {
        return Promise.resolve({
            ok: true,
            json: () => {
                return {
                    "id": 12,
                    "name": "asparagus",
                    "quantity": "300kg",
                    "added_by": 1,
                    "added_at": "09/10/2019 12:23:51",
                    "is_checked": false
                }
            }
        });
    }

    async function addItem(container, getAllByTestId, getAllByPlaceholderText, getAllByText) {
        const addItemButton = getAllByTestId('add-item-btn')[0];
        fireEvent.click(addItemButton);

        const itemInput = getAllByPlaceholderText('e.g. Chicken')[0];
        const quantityInput = getAllByPlaceholderText('e.g. 81')[0];

        fireEvent.change(itemInput, {target: {value: newItemName}});
        fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

        const submitButton = getAllByText('Save')[0];
        fireEvent.click(submitButton);
        await waitFor(() => expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy());
    }

    test('Form submission adds item to list',async () => {
        global.fetch = jest.fn().mockReturnValue(
            mockPostResponse()
        );

        const {container, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = render(
            <List items={itemList()} />
        );

        await addItem(container, getAllByTestId, getAllByPlaceholderText, getAllByText);
        expect(await findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
    });

    test('Newly added item is sorted above checked items', async () => {
        const items = itemList();
        global.fetch = jest.fn()
            .mockReturnValueOnce(
                getMockPatchResponse() // checking off first item
            ).mockReturnValueOnce(
                mockPostResponse() // creating new item
            );

        const {container, getByTestId, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = render(
            <List items={items} />
        );

        fireEvent.click(getByTestId('check-btn-0'));
        await waitFor(() => expect(getByTestId(`undo-btn-${items.length-1}`)).toBeVisible());

        await addItem(container, getAllByTestId, getAllByPlaceholderText, getAllByText);
        const newItemText = `${newItemName} (${newItemQuantity})`;
        expect(await findByText(newItemText)).toBeVisible();

        const itemsInList = container.getElementsByClassName('list-item');
        const lastItem = itemsInList[itemsInList.length-1];
        expect(lastItem.innerHTML.toString().includes(newItemText)).toBeFalsy();
    });

});


test('Updating an existing item', async () => {
    const itemToBeEdited = itemList()[0];
    const nameBeforeEdit = itemToBeEdited['name'];
    const quantityBeforeEdit = itemToBeEdited['quantity'];

    const newItemName = 'NEW NAME';
    const newItemQuantity = 'NEW QUANTITY';

    global.fetch = jest.fn().mockReturnValue(
        Promise.resolve({
            ok: true,
            json: () => {
                return {
                    "id": itemToBeEdited['id'],
                    "name": newItemName,
                    "quantity": newItemQuantity,
                    "added_by": itemToBeEdited['added_by'],
                    "added_at": itemToBeEdited['added_at'],
                    "is_checked": itemToBeEdited['is_checked']
                }
            }
        })
    );

    const {container, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = render(
        <List items={itemList()} />
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