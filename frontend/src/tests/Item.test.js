import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import Item from "../components/Item";
import {getMockPatchResponse} from "./testUtil";


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
    const {container} = render(
        <table><tbody><Item instance={testItem} /></tbody></table>
    );

    const iconClassList = container.getElementsByTagName('svg')[1].classList;
    const rowClassList = container.getElementsByTagName('tr')[0].classList;

    expect(iconClassList.contains(icon)).toBeTruthy();
    expect(iconClassList.contains(colourClass)).toBeTruthy();
    expect(rowClassList.contains('line-through')).toBe(isCrossedThrough);
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

  const mockFetch = jest.fn();
  const mockUpdateTable = jest.fn();

  beforeAll(() => {
      global.fetch = mockFetch.mockReturnValue(
          getMockPatchResponse()
      );
  });


  test('Database PATCH after click',   () => {
    const {getByTestId} = render(
      <table><tbody><Item instance={testItem} callback={mockUpdateTable} /></tbody></table>
    );

    fireEvent.click(getByTestId('check-button'));

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][0]).toBe('/api/items/'+testItem.id+'/');
    expect(mockFetch.mock.calls[0][1].method).toBe('PATCH');
    expect(mockFetch.mock.calls[0][1].body).toBe(
        JSON.stringify({"is_checked":true})
    );
  });


  test('Strikethrough after click', () => {
    const {container, getByTestId} = render(
      <table><tbody><Item instance={testItem} callback={mockUpdateTable} /></tbody></table>
    );
    const rowClassList = container.getElementsByTagName('tr')[0].classList;

    expect(rowClassList.contains('line-through')).toBeFalsy();
    fireEvent.click(getByTestId('check-button'));
    expect(rowClassList.contains('line-through')).toBeTruthy();
  });


  test('Table update after click', async () => {
    const mockUpdateTable = jest.fn();
    const {getByTestId} = render(
      <table><tbody><Item instance={testItem} callback={mockUpdateTable} /></tbody></table>
    );
    const button = getByTestId('check-button');

    fireEvent.click(button);
    await waitFor(() => expect(mockUpdateTable.mock.calls.length).toBe(1));
  });

});

