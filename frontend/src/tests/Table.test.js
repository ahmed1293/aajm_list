import {fireEvent, render, waitFor, waitForDomChange} from "@testing-library/react";
import Table from "../components/Table";
import React from "react";
import {getMockPatchResponse, itemList} from "./testUtil";


test('Render as expected', () => {
    const items = itemList();
    const {getByText} = render(<Table items={items} />);

    expect(getByText('name')).toBeVisible();
    expect(getByText('quantity')).toBeVisible();
    expect(getByText('who')).toBeVisible();
    expect(getByText('when')).toBeVisible();
    items.forEach((item) => expect(getByText(item.name)).toBeVisible());
});


describe('Table sorting', () => {

    function checkRowValues(container, rowIndex, first, second, third, fourth) {
        const row = container.getElementsByTagName('tr')[rowIndex];
        const rowData = row.getElementsByTagName('td');
        expect(rowData[2].innerHTML).toBe(first);
        expect(rowData[3].innerHTML).toBe(second);
        expect(rowData[4].innerHTML).toBe(third);
        expect(rowData[5].innerHTML).toBe(fourth);

        return row;
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
        const {container} = render(<Table items={items} />);

        checkRowValues(container, 4,'onion', '1g', '1', '29/09/2019 19:03:59');
    });

    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {container} = render(<Table items={items} />);
        const firstButton = container.getElementsByClassName('fa-check')[0];

        const firstRow = checkRowValues(
            container, 2, 'onion', '1g', '1', '29/09/2019 19:03:59'
        );
        const secondRow = checkRowValues(
            container, 3, 'banana', '100kg', '1', '02/01/2010 20:03:59'
        );
        const thirdRow = checkRowValues(
            container, 4, 'milk', '10L', '1', '04/01/2018 21:03:59'
        );

        fireEvent.click(firstButton);
        //await waitForDomChange({container});

        await waitFor(() => {
            const newFirstRow = container.getElementsByTagName('tr')[2];
            const newSecondRow = container.getElementsByTagName('tr')[3];
            const newThirdRow = container.getElementsByTagName('tr')[4];

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

        const {container} = render(<Table items={itemList()} />);

        // check all items
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        await waitFor(() => expect(container.getElementsByClassName('fa-undo').length).toBe(1));
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        await waitFor(() => expect(container.getElementsByClassName('fa-undo').length).toBe(2));
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        await waitFor(() => expect(container.getElementsByClassName('fa-undo').length).toBe(3));

        const rowBeingUnchecked = container.getElementsByTagName('tr')[4];
        const uncheckButton = rowBeingUnchecked.getElementsByClassName('fa-undo')[0].parentElement;

        fireEvent.click(uncheckButton);
        await waitFor(() => {
            const newFirstRow = container.getElementsByTagName('tr')[2];
            expect(newFirstRow).toBe(rowBeingUnchecked);
        })
    });

});


describe('Creating item', () => {

    const newItemName = "asparagus";
    const newItemQuantity = "300kg";
    const newItemAddedAt = "09/10/2019 12:23:51";

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

    function submitForm(getAllByTestId, getAllByPlaceholderText, getAllByText) {
        const addItemButton = getAllByTestId('add-item-btn')[0];
        fireEvent.click(addItemButton);

        const itemInput = getAllByPlaceholderText('e.g. Chicken')[0];
        const quantityInput = getAllByPlaceholderText('e.g. 81')[0];

        fireEvent.change(itemInput, {target: {value: newItemName}});
        fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

        const submitButton = getAllByText('Save')[0];
        fireEvent.click(submitButton);
    }

    test('Form submission adds item to list',async () => {
        global.fetch = jest.fn().mockReturnValue(
            mockPostResponse()
        );

        const {container, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = render(
            <Table items={itemList()} />
        );

        submitForm(getAllByTestId, getAllByPlaceholderText, getAllByText);

        await waitFor(() => expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy());

        await findByText(newItemName);
        await findByText(newItemQuantity);
        await findByText(newItemAddedAt);
    });

    test('Newly added item is sorted', async () => {
        global.fetch = jest.fn()
            .mockReturnValueOnce(
                getMockPatchResponse() // checking off first item
            ).mockReturnValueOnce(
                mockPostResponse() // creating new item
            );

        const {container, getAllByTestId, getAllByPlaceholderText, getAllByText, findByText} = render(
            <Table items={itemList()} />
        );

        const firstItemCheckButton = container.getElementsByClassName('fa-check')[0];
        fireEvent.click(firstItemCheckButton);
        await waitForDomChange({container});

        submitForm(getAllByTestId, getAllByPlaceholderText, getAllByText);

        await waitForDomChange({container});

        await waitFor(() => expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy());

        await findByText(newItemName);
        await findByText(newItemQuantity);
        await findByText(newItemAddedAt);

        const lastRow = container.getElementsByTagName('tr')[5];
        const lastRowData = lastRow.getElementsByTagName('td');

        const originalItems = itemList();
        expect(lastRowData[2].innerHTML).toBe(originalItems[0].name);
        expect(lastRowData[3].innerHTML).toBe(originalItems[0].quantity);
        expect(lastRowData[5].innerHTML).toBe(originalItems[0].added_at);
        expect(lastRow.classList.contains('line-through')).toBeTruthy();

        const newRow = container.getElementsByTagName('tr')[4];
        const newRowData = newRow.getElementsByTagName('td');
        expect(newRowData[2].innerHTML).toBe(newItemName);
        expect(newRowData[3].innerHTML).toBe(newItemQuantity);
        expect(newRowData[5].innerHTML).toBe(newItemAddedAt);
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
        <Table items={itemList()} />
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

    await expect(await findByText(newItemName)).toBeVisible();
    await expect(await findByText(newItemQuantity)).toBeVisible();

});