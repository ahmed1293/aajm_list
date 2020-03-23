import {render, fireEvent} from "@testing-library/react";
import React from "react";
import EditListForm from "../components/forms/EditListForm";
import AddListForm from "../components/forms/AddListForm";


describe('Render as expected', () => {

    test('Correct for new list', () => {
        const {getByPlaceholderText, getByText} = render(<AddListForm callback={jest.fn()}/>);

        expect(getByText('New list')).toBeVisible();
        expect(getByText('Save')).toBeVisible();
        expect(getByPlaceholderText('e.g. Food shop')).toBeVisible();
    });


    test('Correct for existing list', () => {
        const {getByPlaceholderText, getByText, queryByText, getByTestId} = render(
            <EditListForm id='2' fetchLists={jest.fn()}/>
        );

        expect(queryByText('New list')).toBeFalsy();
        expect(getByTestId('edit-list-button')).toBeVisible();
        expect(getByText('Save')).toBeVisible();
        expect(getByPlaceholderText('e.g. Food shop')).toBeVisible();
    });

});


describe('Form validation', () => {

    test('Input boxes show no error on initial render', () => {
        const {getByPlaceholderText} = render(<EditListForm fetchLists={jest.fn()}/>);
        const nameInput = getByPlaceholderText('e.g. Food shop');

        expect(nameInput.classList.contains('is-danger')).toBeFalsy();
    });

    test('Input box shows error if no input at all', () => {
        const fetchListsMock = jest.fn();
        const {getByPlaceholderText, getByText} = render(<EditListForm fetchLists={fetchListsMock} />);

        const itemInput = getByPlaceholderText('e.g. Food shop');

        fireEvent.click(getByText("Save"));

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(fetchListsMock.mock.calls.length).toBe(0);
    });
});