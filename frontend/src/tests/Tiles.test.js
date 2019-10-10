import Tiles from "../components/Tiles";
import {render, waitForDomChange} from '@testing-library/react'
import React from "react";
import {getMockAllListsResponse, shoppingLists} from "./testUtil";


describe('Tiles rendering', () => {

    test('Correct placeholder while loading', async () => {
        global.fetch = jest.fn().mockReturnValue(
            new Promise(() => setTimeout(
                () => {return null}, 60
        )));

        const {container} = await render(<Tiles/>);

        expect(container.innerHTML).toBe(
            '<progress class="progress is-small is-dark" value="" max="100"></progress>'
        );
    });

    test('Correct placeholder if fetch fails', async () => {
        global.fetch = jest.fn().mockReturnValue(
            Promise.resolve({status: 500})
        );

        const {container} = render(<Tiles/>);
        await waitForDomChange({container});

        expect(container.innerHTML).toBe(
            '<progress class="progress is-small is-danger" value="100" max="100"></progress>'
        );
    });

    test('Tiles load if fetch successful', async() => {
        global.fetch = jest.fn().mockReturnValue(
            getMockAllListsResponse()
        );
        const {container} = await render(<Tiles/>);

        const tiles = container.getElementsByClassName('tile');
        const listTiles = container.getElementsByClassName('is-parent');

        await waitForDomChange({container});

        expect(tiles.length).toBe(5);
        expect(listTiles.length).toBe(2);
    })

});