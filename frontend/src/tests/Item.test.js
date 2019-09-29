import React from 'react'
import {render} from '@testing-library/react'
import Item from "../components/Item";

test('icon is info-colour if checked', () => {
  const testItem = {
      "id": 1,
      "name": "carrots",
      "quantity": "900kg",
      "added_by": 1,
      "added_at": "29/09/2019 15:03:59",
      "is_checked": true
  }
  const {container} = render(
      <table><tbody><Item item={testItem} /></tbody></table>
  )

  expect(
      (container.getElementsByTagName('svg')[0].classList).contains('has-text-info')
  ).toBe(true)
});