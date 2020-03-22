import {fireEvent, render} from "@testing-library/react";
import ItemForm from "../components/forms/ItemForm";
import React from "react";

describe('Render as expected', () => {

    test('Render correct for existing item', () => {
        const {getByPlaceholderText, getByText, getByTestId, queryByTestId} = render(
            <ItemForm listId={1} callback={jest.fn}/>
        );

        expect(getByText('Save')).toBeVisible();
        expect(getByPlaceholderText('e.g. Chicken')).toBeVisible();
        expect(getByPlaceholderText('e.g. 81')).toBeVisible();
        expect(getByTestId('add-item-btn')).toBeVisible();
        expect(queryByTestId('edit-item-btn')).toBeFalsy();
    });

    test('Render correct for existing item', () => {
        const {getByPlaceholderText, getByText, getByTestId, queryByTestId} = render(
            <ItemForm listId={1} callback={jest.fn} id={12}/>
        );

        expect(getByText('Save')).toBeVisible();
        expect(getByPlaceholderText('e.g. Chicken')).toBeVisible();
        expect(getByPlaceholderText('e.g. 81')).toBeVisible();
        expect(queryByTestId('add-item-btn')).toBeFalsy();
        expect(getByTestId('edit-item-btn')).toBeVisible();
    });

});


describe('Add item form validation', () => {

    function submitForm(container) {
        const submitButton = container.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Input boxes show no error on initial render', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} callback={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        expect(itemInput.classList.contains('is-danger')).toBeFalsy();
        expect(quantityInput.classList.contains('is-danger')).toBeFalsy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Both input boxes show error if no input at all', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} callback={updateListMock} />);

        const itemInput = container.getElementsByTagName('input')[0];
        const quantityInput = container.getElementsByTagName('input')[1];

        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(quantityInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListMock.mock.calls.length).toBe(0);
    });

    test('Individual input boxes show error if no input into them', () => {
        const updateListMock = jest.fn();
        const {container} = render(<ItemForm listId={1} callback={updateListMock} />);

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
