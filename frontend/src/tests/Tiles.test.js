import Tiles from "../components/Tiles";
import {fireEvent, waitFor, screen} from '@testing-library/react'
import React from "react";
import {shoppingLists} from "./mockApi";
import {renderWithMockContexts} from "./util";


describe('Tiles rendering', () => {

	test('Spinner while loading', async () => {
		const {getByTestId} = renderWithMockContexts(<Tiles/>);

		expect(getByTestId('spinner')).toBeVisible();
		await waitFor(() => {
		});
	});

	test('Correct placeholder if fetch fails', async () => {
		const {findByTestId} = renderWithMockContexts(<Tiles/>, {
			apiOverride: {
				method: 'GET', func: () => Promise.reject('oops')
			}
		});
		expect(await findByTestId('sad-face')).toBeVisible();
	});

	test('Tiles load if fetch successful', async () => {
		renderWithMockContexts(<Tiles/>);
		expect((await screen.findAllByTestId('tile')).length).toBe(shoppingLists().length);
	})
});


test('Creating new list', async () => {
	renderWithMockContexts(<Tiles/>);

	const newListButton = await screen.findByText('New list');
	const noOfTiles = screen.getAllByTestId('tile').length;

	fireEvent.click(newListButton);

	await waitFor(() => {
		expect(screen.getAllByTestId('tile').length).toBe(noOfTiles + 1);
	});
});


test('Deleting a list', async () => {
	renderWithMockContexts(<Tiles/>);

	const noOfTiles = (await screen.findAllByTestId('tile')).length;

	fireEvent.click(screen.getAllByTestId('delete-list')[0]);
	fireEvent.click(screen.getByText('Delete'));

	await waitFor(() => {
		expect(screen.getAllByTestId('tile').length).toBe(noOfTiles - 1);
	});
});
