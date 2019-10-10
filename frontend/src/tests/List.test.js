import {getMockAllListsResponse, shoppingLists} from "./testUtil";
import {fireEvent, getAllByText, render, wait, waitForElementToBeRemoved} from "@testing-library/react";
import Tiles from "../components/Tiles";
import React from "react";


test('Enlarging a list', async () => {
    global.fetch = jest.fn().mockReturnValue(getMockAllListsResponse());

    const {container} = render(<Tiles/>);

    const lists = shoppingLists();
    const listToEnlarge = lists[0];

    await wait(() => {
        getAllByText(container, listToEnlarge['name']); // multiple elements due to enlargement modal
    });

    const standardTable = container.getElementsByTagName('table')[0];
    const standardAddButton = container.getElementsByClassName('fa-plus')[0].parentElement;
    expect(standardTable.classList.contains('is-narrow')).toBeTruthy();
    expect(standardAddButton.classList.contains('is-small')).toBeTruthy();

    const enlargeButton = container.getElementsByClassName('fa-search')[0].parentElement;
    fireEvent.click(enlargeButton);

    const modal = container.getElementsByClassName('modal is-active')[0];
    const enlargedTable = modal.getElementsByTagName('table')[0];
    const enlargedAddButton = modal.getElementsByClassName('fa-plus')[0].parentElement;

    expect(enlargedTable.classList.contains('is-narrow')).toBeFalsy();
    expect(enlargedAddButton.classList.contains('is-small')).toBeFalsy();
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

    const {container} = render(<Tiles/>);

    await wait(() => {
        getAllByText(container, listToBeDeleted['name']); // multiple elements due to enlargement modal
    });

    const listTiles = container.getElementsByClassName('is-parent');
    expect(listTiles.length).toBe(shoppingLists().length);

    const deleteButton = container.getElementsByClassName('fa-times')[0].parentElement;
    fireEvent.click(deleteButton);

    const deleteConfirmation = container.getElementsByClassName('is-danger')[0];
    const form = deleteConfirmation.getElementsByTagName('form')[0];
    const confirmDeleteButton = form.getElementsByTagName('button')[0];
    fireEvent.click(confirmDeleteButton);

    await waitForElementToBeRemoved(() => [
        getAllByText(container, listToBeDeleted['name']),
        getAllByText(container, listToBeDeleted['items'][0]['name'])
    ]);

    expect(listTiles.length).toBe(shoppingLists().length - 1);
});