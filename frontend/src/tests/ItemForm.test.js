import {getMockPatchResponse, itemList} from "./testUtil";
import {fireEvent, render, wait, getByText, waitForDomChange} from "@testing-library/react";
import Table from "../components/Table";
import ItemForm from "../components/forms/ItemForm";
import React from "react";

describe('Add item form validation', () => {

    function submitForm(container) {
        const submitButton = container.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Input boxes show no error on initial render', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} updateItemList={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        expect(itemInput.classList.contains('is-danger')).toBeFalsy();
        expect(quantityInput.classList.contains('is-danger')).toBeFalsy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Both input boxes show error if no input at all', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} updateItemList={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(quantityInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Individual input boxes show error if no input into them', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} updateItemList={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        fireEvent.change(itemInput, {target: {value: 'banana'}});
        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeFalsy();
        expect(quantityInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListMock.mock.calls.length).toBe(0);

        fireEvent.change(itemInput, {target: {value: ''}});
        fireEvent.change(quantityInput, {target: {value: '20'}});
        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(quantityInput.classList.contains('is-danger')).toBeFalsy();
        expect(updateListMock.mock.calls.length).toBe(0);
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

    function submitForm(container) {
        const addItemButton = container.getElementsByClassName('fa-plus')[0].parentElement;
        fireEvent.click(addItemButton);

        const form = container.getElementsByTagName('form')[0];
        const itemInput = form.getElementsByTagName('input')[0];
        const quantityInput = form.getElementsByTagName('input')[1];

        fireEvent.change(itemInput, {target: {value: newItemName}});
        fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

        const submitButton = form.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Form submission adds item to list',async () => {
        global.fetch = jest.fn().mockReturnValue(
            mockPostResponse()
        );

        const {container} = render(<Table items={itemList()} />);

        submitForm(container);

        await waitForDomChange({container});

        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();

        await wait(() => [
            getByText(container, newItemName),
            getByText(container, newItemQuantity),
            getByText(container, newItemAddedAt)
        ])
    });

    test('Newly added item is sorted',async () => {
        global.fetch = jest.fn()
            .mockReturnValueOnce(
                getMockPatchResponse() // checking off first item
            ).mockReturnValueOnce(
                mockPostResponse() // creating new item
            );

        const {container} = render(<Table items={itemList()} />);

        const firstItemCheckButton = container.getElementsByClassName('fa-check')[0];
        fireEvent.click(firstItemCheckButton);
        await waitForDomChange({container});

        submitForm(container);

        await waitForDomChange({container});

        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();

        await wait(() => [
            getByText(container, newItemName),
            getByText(container, newItemQuantity),
            getByText(container, newItemAddedAt)
        ]);

        const lastRow = container.getElementsByTagName('tr')[5];
        const lastRowData = lastRow.getElementsByTagName('td');

        const originalItems = itemList(); // order of ITEMS (defined above) would have changed
        expect(lastRowData[0].innerHTML).toBe(originalItems[0].name);
        expect(lastRowData[1].innerHTML).toBe(originalItems[0].quantity);
        expect(lastRowData[3].innerHTML).toBe(originalItems[0].added_at);
        expect(lastRow.classList.contains('line-through')).toBeTruthy();

        const newRow = container.getElementsByTagName('tr')[4];
        const newRowData = newRow.getElementsByTagName('td');
        expect(newRowData[0].innerHTML).toBe(newItemName);
        expect(newRowData[1].innerHTML).toBe(newItemQuantity);
        expect(newRowData[3].innerHTML).toBe(newItemAddedAt);
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

    const {container} = render(<Table items={itemList()} />);
    const editButton = container.getElementsByClassName('fa-pencil-alt')[0].parentElement;
    fireEvent.click(editButton);

    const form = container.getElementsByTagName('form')[1]; // first form is for item creation
    const nameInput = form.getElementsByTagName('input')[0];
    const quantityInput = form.getElementsByTagName('input')[1];

    expect(nameInput.value).toBe(nameBeforeEdit);
    expect(quantityInput.value).toBe(quantityBeforeEdit);

    fireEvent.change(nameInput, {target: {value: newItemName}});
    fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

    const submitButton = form.getElementsByTagName('button')[0];
    fireEvent.click(submitButton);

    await waitForDomChange({container});

    expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();

    await wait(() => [
        getByText(container, newItemName),
        getByText(container, newItemQuantity)
    ])
});