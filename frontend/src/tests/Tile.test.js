import {fireEvent, waitFor} from "@testing-library/react";
import React from "react";
import Tile from "../components/Tile";
import {itemList} from "./mockApi";
import {renderWithMockContexts} from "./util";
import {ACTIONS} from "../dataReducer";


test('Render as expected', () => {
	const items = itemList();
	const {queryByTestId, getByText} = renderWithMockContexts(
		<Tile list={{id: '2', created_at: '12pm', items: items}}/>
	);

	expect(getByText('12pm')).toBeVisible();
	expect(queryByTestId('active-modal')).toBeFalsy();
	items.forEach((i) => expect(getByText(`${i.name} (${i.quantity})`)).toBeVisible());
});


test('Deleting list', async () => {
	const mockCallback = jest.fn();
	const {getByTestId, getByText} = renderWithMockContexts(
		<Tile list={{id: '2', created_at: '12pm', items: []}}/>, {dispatchOverride: mockCallback}
	);

	mockCallback.mockClear();
	fireEvent.click(getByTestId('delete-list'));
	fireEvent.click(getByText('Delete'));
	await waitFor(() => {
		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith({"listId": "2", "type": ACTIONS.deleteList});
	});
});

