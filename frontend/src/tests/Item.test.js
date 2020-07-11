import React, {useReducer} from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import Item from "../components/Item";
import {DataContext, dataReducer} from "../dataReducer";
import {APIContext} from "../api";
import {api} from "./mockApi";


describe('Item icons', () => {
	test.each`
    checked  | icon          | colourClass           | isCrossedThrough
    ${true}  | ${'fa-undo'}  | ${'has-text-info'}    | ${true}
    ${false} | ${'fa-check'} | ${'has-text-primary'} | ${false}`
	('icon is $icon, with colour $colourClass, if checked=$checked', ({checked, icon, colourClass, isCrossedThrough}) => {
		const testItem = {
			"id": 1,
			"name": "carrots",
			"quantity": "900kg",
			"added_by": 1,
			"added_at": "29/09/2019 15:03:59",
			"is_checked": checked
		};
		const {container, getByText} = render(<Item instance={testItem} index={0}/>);

		const iconClassList = container.getElementsByTagName('svg')[1].classList;

		expect(iconClassList.contains(icon)).toBeTruthy();
		expect(iconClassList.contains(colourClass)).toBeTruthy();
		expect(getByText('carrots (900kg)').classList.contains('line-through')).toBe(isCrossedThrough);
	});
});


describe('Checking an item', () => {

	const testItem = {
		"id": 1,
		"name": "onion",
		"quantity": "1g",
		"added_by": 1,
		"added_at": "29/09/2019 19:03:59",
		"is_checked": false,
		"list": 1
	};

	function ComponentToTest() {
		const [state, dispatch] = useReducer(dataReducer, {data: [{id: 1, items: [testItem]}]})

		return <APIContext.Provider value={api}>
			<DataContext.Provider value={dispatch}>
				<Item instance={state.data[0].items[0]}/>
			</DataContext.Provider>
		</APIContext.Provider>
	}


	test('Strikethrough after click', async () => {
		const {getByTestId, getByText} = render(<ComponentToTest/>);
		const classList = getByText('onion (1g)').classList;

		expect(classList.contains('line-through')).toBeFalsy();
		fireEvent.click(getByTestId('check-button'));
		await waitFor(() => expect(classList.contains('line-through')).toBeTruthy())
	});

});

