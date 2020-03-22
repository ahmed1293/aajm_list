import Tiles from "../components/Tiles";
import {fireEvent, render, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import React from "react";
import {getMockAllListsResponse, shoppingLists} from "./testUtil";


describe('Tiles rendering', () => {

    test('Correct placeholder while loading', async () => {
        global.fetch = jest.fn().mockReturnValue(
            new Promise(() => setTimeout(
                () => {return null}, 60
        )));

        const {getByTestId} = render(<Tiles/>);

        expect(getByTestId('progress-bar')).toBeVisible();
    });

    test('Correct placeholder if fetch fails', async () => {
        global.fetch = jest.fn().mockReturnValue(
            Promise.resolve({status: 500})
        );

        const {findByTestId} = render(<Tiles/>);
        expect(await findByTestId('error-bar')).toBeVisible();
    });

    test('Tiles load if fetch successful', async() => {
        global.fetch = jest.fn().mockReturnValue(
            getMockAllListsResponse()
        );
        const {container} = await render(<Tiles/>);

        const tiles = container.getElementsByClassName('tile');
        const listTiles = container.getElementsByClassName('is-parent');

        await waitFor(() => {
           expect(tiles.length).toBe(5);
           expect(listTiles.length).toBe(2);
        });
    })
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

    const {container, findByText, getByTestId, getByText} = render(<Tiles/>);

    const button = await findByText('New list');
    fireEvent.click(button);

    const nameInput = getByTestId('new-list-name-input');
    fireEvent.change(nameInput, {target: {value: newList['name']}});

    const submitButton = getByTestId('new-list-save');
    fireEvent.click(submitButton);
    await waitFor(() => {
        expect(container.getElementsByClassName('modal is-active').length).toBe(0);
        expect(getByText(newList['name'])).toBeVisible();
        expect(getByText(newList['created_at'])).toBeVisible();
    });
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

    const {container, findByText, getByTestId, getAllByTestId} = render(<Tiles/>);

    expect(await findByText(oldListName)).toBeVisible();
    fireEvent.click(getAllByTestId('edit-list-button')[0]);

    const nameInput = getAllByTestId('existing-list-name-input')[0];
    expect(nameInput.value).toBe(oldListName);
    fireEvent.change(nameInput, {target: {value: newListName}});

    fireEvent.click(getAllByTestId('existing-list-save')[0]);

    await waitFor(() => expect(container.getElementsByClassName('modal is-active').length).toBe(0));
    await findByText(newListName)
});


test('Deleting a list', async () => {
    let listsAfterDeletion = shoppingLists();
    const listToBeDeleted = listsAfterDeletion[0];
    listsAfterDeletion.shift();

    global.fetch = jest.fn()
        .mockReturnValueOnce(getMockAllListsResponse()) // initial response
        .mockReturnValueOnce( // delete after click
            Promise.resolve({
                ok: true,
                status: 204,
            })
        )
        .mockReturnValueOnce( // response after new list
            Promise.resolve({
                ok: true,
                status: 200,
                json: () => listsAfterDeletion
            })
        );

    const {findByText, getByText, getAllByTestId, getAllByText} = render(<Tiles/>);

    await findByText(listToBeDeleted['name']);
    fireEvent.click(getAllByTestId('delete-list')[0]);
    fireEvent.click(getAllByText('Delete')[0]);

    await waitForElementToBeRemoved(() => [
        getByText(listToBeDeleted['name']),
        getByText(listToBeDeleted['items'][0]['name'])
    ]);

});