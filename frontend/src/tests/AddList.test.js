import {fireEvent, getAllByText, getByText, wait} from "@testing-library/dom";
import {render} from "@testing-library/react";
import React from "react";
import AddListForm from "../components/forms/AddList";
import {getMockAllListsResponse, shoppingLists} from "./testUtil";
import Tiles from "../components/Tiles";

describe('Add list form validation', () => {

    function submitForm(container) {
        const submitButton = container.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Input boxes show no error on initial render', () => {
        const {container} = render(<AddListForm updateLists={jest.fn()} />);
        const nameInput = container.getElementsByTagName('input')[0];

        expect(nameInput.classList.contains('is-danger')).toBeFalsy();
    });

    test('Input box shows error if no input at all', () => {
        const updateListsMock = jest.fn();
        const {container} = render(<AddListForm updateLists={updateListsMock} />);

        const itemInput = container.getElementsByTagName('input')[0];

        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListsMock.mock.calls.length).toBe(0);
    });
});


test('New list created after form submitted', async () => {
    let shoppingListsAfterNewCreation = shoppingLists();
    const newList = {
        "name": "List created after click",
        "created_by": 2,
        "created_at": "01/12/2019 11:35:44",
        "items": []
    };
    shoppingListsAfterNewCreation.push(newList);

    global.fetch = jest.fn()
        .mockReturnValueOnce(getMockAllListsResponse()) // initial response
        .mockReturnValueOnce( // post after click
            Promise.resolve({
                ok: true,
                status: 201,
            })
        )
        .mockReturnValueOnce( // response after new list
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => shoppingListsAfterNewCreation
            })
        );

    const {container} = render(<Tiles/>);

    await wait(() => {
        getAllByText(container, 'New List')
    });

    const button = container.getElementsByTagName('a')[0];
    fireEvent.click(button);

    const form = container.getElementsByTagName('form')[0];
    const nameInput = form.getElementsByTagName('input')[0];
    fireEvent.change(nameInput, {target: {value: newList['name']}});

    const submitButton = form.getElementsByTagName('button')[0];
    fireEvent.click(submitButton);

    await wait(() => [
        getByText(container, newList['name']),
        getByText(container, newList['created_at']),
    ]);
});