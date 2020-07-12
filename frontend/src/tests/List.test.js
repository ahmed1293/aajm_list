import {fireEvent, waitFor, getNodeText, render, screen} from "@testing-library/react";
import List from "../components/List";
import React, {useReducer} from "react";
import {api, itemList} from "./mockApi";
import {renderWithMockContexts} from "./util";
import {DataContext, dataReducer} from "../dataReducer";
import {APIContext} from "../api";


function ComponentToTest({items, canAddItem=true}) {
	const [state, dispatch] = useReducer(dataReducer, {data: [{id: 1, items: items}]})

	return <APIContext.Provider value={api}>
		<DataContext.Provider value={dispatch}>
			<List items={state.data[0].items} listId={1} canAddItem={canAddItem}/>
		</DataContext.Provider>
	</APIContext.Provider>
}


test('Render as expected if can add item', () => {
	const items = itemList();
	render(<ComponentToTest items={items}/>)

	expect(screen.getByText('Add')).toBeVisible();
	items.forEach((item) => expect(screen.getByText(`${item.name} (${item.quantity})`)).toBeVisible());
});


test('Render as expected if cannot add item', () => {
	const items = itemList();
	render(<ComponentToTest items={items} canAddItem={false}/>)

	expect(screen.queryByText('Add')).toBeNull();
	items.forEach((item) => expect(screen.getByText(`${item.name} (${item.quantity})`)).toBeVisible());
});


describe('List sorting', () => {

	function expectCorrectItemPosition(index, name, quantity) {
		const listItem = screen.getByTestId(`item-${index}`);
		const text = getNodeText(listItem);
		expect(text).toBe(`${name} (${quantity})`);
		return text;
	}

	test('Checked items at bottom on initial sort', () => {
		let items = itemList();
		items[0]['is_checked'] = true;

		render(<ComponentToTest items={items}/>)

		expectCorrectItemPosition(items.length - 1, items[0].name, items[0].quantity);
	});

	test('Items move to the bottom after being checked', async () => {
		const items = itemList();

		render(<ComponentToTest items={items}/>);
		const firstButton = screen.getByTestId('check-btn-0');

		const firstRow = expectCorrectItemPosition(0, items[0].name, items[0].quantity);
		const secondRow = expectCorrectItemPosition(1, items[1].name, items[1].quantity);
		const thirdRow = expectCorrectItemPosition(2, items[2].name, items[2].quantity);

		fireEvent.click(firstButton);

		await waitFor(() => {
			const newFirstRow = getNodeText(screen.getByTestId('item-0'));
			const newSecondRow = getNodeText(screen.getByTestId('item-1'));
			const newThirdRow = getNodeText(screen.getByTestId('item-2'));

			expect(newFirstRow).toBe(secondRow);
			expect(newSecondRow).toBe(thirdRow);
			expect(newThirdRow).toBe(firstRow);
		});
	});

	test('Items move away from bottom if check is undone', async () => {
		const items = itemList();
		items[0]['is_checked'] = true;
		items[1]['is_checked'] = true;
		items[2]['is_checked'] = true;

		renderWithMockContexts(<ComponentToTest items={items}/>);

		const itemBeingUnchecked = getNodeText(screen.getByTestId('item-2'));
		fireEvent.click(screen.getByTestId('undo-btn-2'));
		await waitFor(() => {
			expect(getNodeText(screen.getByTestId('item-0'))).toBe(itemBeingUnchecked);
		})
	});

});


test('Adding a new item', async () => {
	let items = itemList();
	const newItemName = "asparagus";
	const newItemQuantity = "300kg";

	render(<ComponentToTest items={items}/>);

	expect(screen.getByText('Add')).toBeDisabled();

	fireEvent.change(screen.getByPlaceholderText('Item'), {target: {value: newItemName}});
	expect(screen.getByText('Add')).toBeDisabled();

	fireEvent.change(screen.getByPlaceholderText('Quantity'), {target: {value: newItemQuantity}});
	expect(screen.getByText('Add')).toBeEnabled();

	fireEvent.click(screen.getByText('Add'));

	expect(await screen.findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
	expect(screen.getByPlaceholderText('Item').value).toBe('');
	expect(screen.getByPlaceholderText('Quantity').value).toBe('');
});


test('Updating an existing item', async () => {
	const items = itemList();
	const itemToBeEdited = items[0];
	const nameBeforeEdit = itemToBeEdited['name'];
	const quantityBeforeEdit = itemToBeEdited['quantity'];

	const newItemName = 'NEW NAME';
	const newItemQuantity = 'NEW QUANTITY';

	render(<ComponentToTest items={items}/>);

	fireEvent.click(screen.getAllByTestId('edit-item-btn')[0]);

	// using index 1 because 0 is add form (need to get rid of modal hell)
	const itemInput = screen.getByPlaceholderText('e.g. Chicken');
	const quantityInput = screen.getByPlaceholderText('e.g. 81');

	expect(itemInput.value).toBe(nameBeforeEdit);
	expect(quantityInput.value).toBe(quantityBeforeEdit);

	fireEvent.change(itemInput, {target: {value: newItemName}});
	fireEvent.change(quantityInput, {target: {value: newItemQuantity}});

	fireEvent.click(screen.getByText('Save'));

	await waitFor(() => expect(screen.queryByTestId('modal')).toBeFalsy());
	expect(await screen.findByText(`${newItemName} (${newItemQuantity})`)).toBeVisible();
});
