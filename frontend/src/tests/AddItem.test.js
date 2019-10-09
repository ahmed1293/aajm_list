import {getMockPatchResponse, itemList, randomInt} from "./testUtil";
import {fireEvent, render, wait, getByText, waitForDomChange} from "@testing-library/react";
import Table from "../components/Table";
import AddItemForm from "../components/forms/AddItem";
import React from "react";


describe('Add item form toggle', () => {

    const ITEMS = itemList();

    test('Form not visible on initial render',  () => {
        const {container} = render(<Table items={ITEMS} />);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();
    });

    test('Form pops up after button click', () => {
        const {container} = render(<Table items={ITEMS} />);
        const addItemButton = container.getElementsByClassName('fa-plus')[0].parentElement;

        fireEvent.click(addItemButton);

        expect(container.getElementsByClassName('modal is-active')[0]).toBeTruthy();
    });

    test('Form disappears after clicking on page', () => {
        const {container} = render(<Table items={ITEMS} />);
        const addItemButton = container.getElementsByClassName('fa-plus')[0].parentElement;

        fireEvent.click(addItemButton);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeTruthy();

        const modalBackground = container.getElementsByClassName('modal-background')[0];
        fireEvent.click(modalBackground);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();
    });
});


describe('Add item form validation', () => {

    function submitForm(container) {
        const submitButton = container.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Input boxes show no error on initial render', () => {
        const updateListMock = jest.fn();
        const {container} = render(<AddItemForm listId={1} updateItemList={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        expect(itemInput.classList.contains('is-danger')).toBeFalsy();
        expect(quantityInput.classList.contains('is-danger')).toBeFalsy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Both input boxes show error if no input at all', () => {
        const updateListMock = jest.fn();
        const {container} = render(<AddItemForm listId={1} updateItemList={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(quantityInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Individual input boxes show error if no input into them', () => {
        const updateListMock = jest.fn();
        const {container} = render(<AddItemForm listId={1} updateItemList={updateListMock} />);

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


describe('Add item form submission', () => {

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