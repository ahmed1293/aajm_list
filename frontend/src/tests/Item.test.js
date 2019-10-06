import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import Item from "../components/Item";


describe('Icons', () => {test.each`
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
        <table><tbody><Item item={testItem} /></tbody></table>
    );

    const iconClassList = container.getElementsByTagName('svg')[0].classList;
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

  test('Strikethrough after click', () => {
    const {container} = render(
      <table><tbody><Item item={testItem} /></tbody></table>
    );
    const rowClassList = container.getElementsByTagName('tr')[0].classList;
    const button = container.getElementsByTagName('svg')[0];

    expect(rowClassList.contains('line-through')).toBeFalsy();

    // TODO: click

    // fireEvent.click(button);
    // expect(rowClassList.contains('line-through')).toBeTruthy();
  })

});

