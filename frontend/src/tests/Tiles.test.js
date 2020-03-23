import Tiles from "../components/Tiles";
import {fireEvent, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import React from "react";
import {renderWithMockApi, SHOPPING_LISTS} from "./mockApi";


describe('Tiles rendering', () => {

    test('Spinner while loading', async () => {
        const {getByTestId} = renderWithMockApi(<Tiles/>);

        expect(getByTestId('spinner')).toBeVisible();
        await waitFor(() => {});
    });

    test('Correct placeholder if fetch fails', async () => {
        const {findByTestId} = renderWithMockApi(<Tiles/>, {
            method: 'GET', func: () => Promise.reject('oops')
        });
        expect(await findByTestId('sad-face')).toBeVisible();
    });

    test('Tiles load if fetch successful', async () => {
        const {container} = renderWithMockApi(<Tiles/>);

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

    const {container, findByText, getByTestId, getByText} = renderWithMockApi(<Tiles/>);

    const button = await findByText('New list');
    fireEvent.click(button);

    const nameInput = getByTestId('new-list-name-input');
    fireEvent.change(nameInput, {target: {value: newList['name']}});

    const submitButton = getByTestId('new-list-save');
    fireEvent.click(submitButton);
    await waitFor(() => {
        expect(container.getElementsByClassName('modal is-active').length).toBe(0);
        expect(getByText(newList['name'])).toBeVisible();
    });
});


test('Modifying existing list', async () => {
    const oldListName = SHOPPING_LISTS[0]['name'];
    const newListName = 'list-edit';
    const {container, findByText, getAllByTestId} = renderWithMockApi(<Tiles/>);

    expect(await findByText(oldListName)).toBeVisible();
    fireEvent.click(getAllByTestId('edit-list-button')[0]);

    const nameInput = getAllByTestId('edit-list-name-input')[0];
    expect(nameInput.value).toBe(oldListName);
    fireEvent.change(nameInput, {target: {value: newListName}});

    fireEvent.click(getAllByTestId('existing-list-save')[0]);

    await waitFor(() => expect(container.getElementsByClassName('modal is-active').length).toBe(0));
    expect(await findByText(newListName)).toBeVisible();
});


test('Deleting a list', async () => {
    const listToBeDeleted = SHOPPING_LISTS[0];

    const {findByText, getByText, getAllByTestId, getAllByText} = renderWithMockApi(<Tiles/>);

    expect(await findByText(listToBeDeleted['name'])).toBeVisible();
    fireEvent.click(getAllByTestId('delete-list')[0]);
    fireEvent.click(getAllByText('Delete')[0]);

    await waitForElementToBeRemoved(() => [
        getByText(listToBeDeleted['name']),
    ]);
});