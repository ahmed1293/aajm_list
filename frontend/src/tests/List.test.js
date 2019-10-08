import {getMockAllListsResponse, shoppingLists} from "./testUtil";
import {fireEvent, getByText, render, wait, waitForElementToBeRemoved} from "@testing-library/react";
import Tiles from "../components/Tiles";
import React from "react";


test('Clicking delete removes list from page', async () => {
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
        getByText(container, listToBeDeleted['name']);
    });

    const listTiles = container.getElementsByClassName('is-parent');
    expect(listTiles.length).toBe(shoppingLists().length);

    const deleteButton = container.getElementsByTagName('svg')[0];
    fireEvent.click(deleteButton);

    await waitForElementToBeRemoved(() => [
        getByText(container, listToBeDeleted['name']),
        getByText(container, listToBeDeleted['items'][0]['name'])
    ]);

    expect(listTiles.length).toBe(shoppingLists().length - 1);
});