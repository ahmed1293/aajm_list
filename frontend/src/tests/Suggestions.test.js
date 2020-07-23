import React from "react";
import {fireEvent, screen} from "@testing-library/react";
import {api, itemList} from "./mockApi";
import AddItemForm from "../components/forms/AddItemForm";
import {renderWithMockContexts} from "./util";

const items = itemList();

test('Suggestions appear after more than 2 characters are typed', async () => {
	const mockApi = {...api};
	const apiSpy = jest.spyOn(mockApi, 'GET');
	renderWithMockContexts(
		<AddItemForm listId={12} callback={jest.fn()}/>, {
			apiOverride: {
				method: 'GET',
				func: mockApi.GET
			}
		}
	);

	const suggestion = items[0].name + ` (${items[0].quantity})`;
	const nameInput = screen.getByPlaceholderText('Item');

	fireEvent.change(nameInput, {target: {value: 'a'}});
	expect(apiSpy).toHaveBeenCalledTimes(0);

	fireEvent.change(nameInput, {target: {value: 'ab'}});
	expect(apiSpy).toHaveBeenCalledTimes(0);

	fireEvent.change(nameInput, {target: {value: 'abc'}});
	expect(await screen.findByText(suggestion)).toBeVisible();
	expect(apiSpy).toHaveBeenCalledTimes(1);
	expect(apiSpy).toHaveBeenCalledWith('items', {search: 'abc'});

	fireEvent.change(nameInput, {target: {value: 'abcd'}});
	expect(await screen.findByText(suggestion)).toBeVisible();
	expect(apiSpy).toHaveBeenCalledTimes(2);
	expect(apiSpy).toHaveBeenCalledWith('items', {search: 'abcd'})
})


test('Suggestion fills form if clicked on', async () => {
	renderWithMockContexts(
		<AddItemForm listId={12} callback={jest.fn()}/>
	);

	const nameInput = screen.getByPlaceholderText('Item');
	const suggestion = items[0].name + ` (${items[0].quantity})`;

	fireEvent.change(nameInput, {target: {value: 'abc'}});
	fireEvent.click(await screen.findByText(suggestion));

	expect(screen.queryByText(suggestion)).toBeNull(); // suggestions removed
	expect(screen.getByPlaceholderText('Item').value).toBe(items[0].name);
	expect(screen.getByPlaceholderText('Quantity').value).toBe(items[0].quantity);
})
