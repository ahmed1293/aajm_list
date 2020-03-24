import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import Item from "../components/Item";
import {renderWithMockApi} from "./mockApi";


describe('Item icons', () => {test.each`
    checked  | icon          | colourClass           | isCrossedThrough
    ${true}  | ${'fa-undo'}  | ${'has-text-info'}    | ${true}
    ${false} | ${'fa-check'} | ${'has-text-primary'} | ${false}`
('icon is $icon, with colour $colourClass, if checked=$checked', ({ checked, icon, colourClass, isCrossedThrough}) => {
    const testItem = {
        "id": 1,
        "name": "carrots",
        "quantity": "900kg",
        "added_by": 1,
        "added_at": "29/09/2019 15:03:59",
        "is_checked": checked
    };
    const {container, getByText} = render(<Item instance={testItem} index={0} />);

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
        "is_checked": false
  };

  const mockUpdateTable = jest.fn();


  test('Strikethrough after click', () => {
    const {getByTestId, getByText} = renderWithMockApi(<Item instance={testItem} callback={mockUpdateTable} />);
    const classList = getByText('onion (1g)').classList;

    expect(classList.contains('line-through')).toBeFalsy();
    fireEvent.click(getByTestId('check-button'));
    expect(classList.contains('line-through')).toBeTruthy();
  });


  test('Callback called after click', async () => {
    const mockUpdateTable = jest.fn();
    const {getByTestId} = renderWithMockApi(<Item instance={testItem} callback={mockUpdateTable} />);
    const button = getByTestId('check-button');

    fireEvent.click(button);
    await waitFor(() => expect(mockUpdateTable.mock.calls.length).toBe(1));
  });

});

