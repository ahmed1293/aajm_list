import {fireEvent, getAllByText, getByText, wait, waitForDomChange} from "@testing-library/dom";
import {render} from "@testing-library/react";
import React from "react";
import ListForm from "../components/forms/ListForm";
import {getMockAllListsResponse, shoppingLists} from "./testUtil";
import Tiles from "../components/Tiles";

describe('Form validation', () => {

    function submitForm(container) {
        const submitButton = container.getElementsByTagName('button')[0];
        fireEvent.click(submitButton);
    }

    test('Input boxes show no error on initial render', () => {
        const {container} = render(<ListForm updateLists={jest.fn()} />);
        const nameInput = container.getElementsByTagName('input')[0];

        expect(nameInput.classList.contains('is-danger')).toBeFalsy();
    });

    test('Input box shows error if no input at all', () => {
        const updateListsMock = jest.fn();
        const {container} = render(<ListForm updateLists={updateListsMock} />);

        const itemInput = container.getElementsByTagName('input')[0];

        submitForm(container);

        expect(itemInput.classList.contains('is-danger')).toBeTruthy();
        expect(updateListsMock.mock.calls.length).toBe(0);
    });
});


test('Creating new list', async () => {
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
        .mockReturnValueOnce( // post after submit
            Promise.resolve({
                ok: true,
                status: 201,
            })
        )
        .mockReturnValueOnce( // get all lists after creation
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => shoppingListsAfterNewCreation
            })
        );

    const {container} = render(<Tiles/>);

    await wait(() => {
        getAllByText(container, 'New list')
    });

    const button = container.getElementsByTagName('a')[0];
    fireEvent.click(button);

    const form = container.getElementsByTagName('form')[0];
    const nameInput = form.getElementsByTagName('input')[0];
    fireEvent.change(nameInput, {target: {value: newList['name']}});

    const submitButton = form.getElementsByTagName('button')[0];
    fireEvent.click(submitButton);

    await waitForDomChange({container});
    expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();

    await wait(() => [
        getByText(container, newList['name']),
        getByText(container, newList['created_at']),
    ]);
});


test('Modifying existing list', async () => {
    let shoppingListsAfterEdit = shoppingLists();
    const oldListName = shoppingListsAfterEdit[0]['name'];
    const newListName = 'LIST EDIT';
    shoppingListsAfterEdit[0]['name'] = newListName;

    global.fetch = jest.fn()
        .mockReturnValueOnce(getMockAllListsResponse()) // initial response
        .mockReturnValueOnce( // patch after submit
            Promise.resolve({
                ok: true,
                status: 200,
            })
        )
        .mockReturnValueOnce( // get all lists after edit
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => shoppingListsAfterEdit
            })
        );

    const {container} = await render(<Tiles/>);

    await wait(() => {
        getAllByText(container, oldListName)
    });

    const editButton = container.getElementsByClassName('fa-pencil-alt')[0].parentElement;
    fireEvent.click(editButton);

    const form = container.getElementsByTagName('form')[1]; // first form is the create one
    const nameInput = form.getElementsByTagName('input')[0];

    expect(nameInput.value).toBe(oldListName);

    fireEvent.change(nameInput, {target: {value: newListName}});

    const submitButton = form.getElementsByTagName('button')[0];
    fireEvent.click(submitButton);

    await waitForDomChange();
    expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();

    await wait(() => [
        getByText(container, newListName),
    ]);
});