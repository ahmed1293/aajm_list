import Tiles from "../components/Tiles";
import {fireEvent, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import React from "react";
import {shoppingList} from "./mockApi";
import {renderWithMockContexts} from "./util";


describe('Tiles rendering', () => {

    test('Spinner while loading', async () => {
        const {getByTestId} = renderWithMockContexts(<Tiles/>);

        expect(getByTestId('spinner')).toBeVisible();
        await waitFor(() => {});
    });

    test('Correct placeholder if fetch fails', async () => {
        const {findByTestId} = renderWithMockContexts(<Tiles/>, {apiOverride: {
            method: 'GET', func: () => Promise.reject('oops')
        }});
        expect(await findByTestId('sad-face')).toBeVisible();
    });

    test('Tiles load if fetch successful', async () => {
        const {container} = renderWithMockContexts(<Tiles/>);

        const tiles = container.getElementsByClassName('tile');
        const listTiles = container.getElementsByClassName('is-parent');

        await waitFor(() => {
           expect(tiles.length).toBe(5);
           expect(listTiles.length).toBe(2);
        });
    })
});


test('Creating new list', async () => {
    const newList = {
        "name": "List created after click",
        "created_by": 2,
        "created_at": "01/12/2019 11:35:44",
        "items": []
    };

    const {queryByTestId, findByText, getByLabelText, getByText} = renderWithMockContexts(<Tiles/>);

    const button = await findByText('New list');
    fireEvent.click(button);

    const nameInput = getByLabelText('Name');
    fireEvent.change(nameInput, {target: {value: newList['name']}});

    const submitButton = getByText('Save');
    fireEvent.click(submitButton);
    await waitFor(() => {
        expect(queryByTestId('modal')).toBeFalsy();
        expect(getByText(newList['name'])).toBeVisible();
    });
});


test('Modifying existing list', async () => {
    const list = shoppingList();
    const oldListName = list[0]['name'];
    const newListName = 'list-edit';
    const {queryByTestId, findByText, getByLabelText, getByText, getAllByTestId} = renderWithMockContexts(<Tiles/>);

    expect(await findByText(oldListName)).toBeVisible();
    fireEvent.click(getAllByTestId('edit-list-button')[0]);

    const nameInput = getByLabelText('Name');
    expect(nameInput.value).toBe(oldListName);
    fireEvent.change(nameInput, {target: {value: newListName}});

    fireEvent.click(getByText('Save'));

    await waitFor(() => expect(queryByTestId('modal')).toBeFalsy());
    expect(await findByText(newListName)).toBeVisible();
});


test('Deleting a list', async () => {
    const listToBeDeleted = shoppingList()[0];

    const {findByText, getByText, getAllByTestId} = renderWithMockContexts(<Tiles/>);

    expect(await findByText(listToBeDeleted['name'])).toBeVisible();
    fireEvent.click(getAllByTestId('delete-list')[0]);
    fireEvent.click(getByText('Delete'));

    await waitForElementToBeRemoved(() => [
        getByText(listToBeDeleted['name']),
    ]);
});