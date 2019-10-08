import {render, wait, getByText, fireEvent} from "@testing-library/react";
import Tiles from "../components/Tiles";
import {getMockAllListsResponse, shoppingLists} from "./testUtil";
import React from "react";


test('Button renders if fetch successful', async() => {
    global.fetch = jest.fn().mockReturnValue(
        getMockAllListsResponse()
    );
    const {container} = await render(<Tiles/>);

    await wait(() => {
        getByText(container, 'New List')
    });
});


test('New list created after click', async () => {
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
                status: 200,
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
        getByText(container, 'New List')
    });

    const button = container.getElementsByTagName('a')[0];
    fireEvent.click(button);

    await wait(() => [
        getByText(container, newList['name']),
        getByText(container, newList['created_at']),
    ]);
});
