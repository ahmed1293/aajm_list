import {fireEvent, render, waitFor} from "@testing-library/react";
import React from "react";
import Tile from "../components/Tile";
import {itemList, renderWithMockApi} from "./mockApi";


test('Render as expected', () => {
   const items = itemList();
   const {queryByTestId, getByText} = render(<Tile instance={{name: 'name', id: '2', created_at:'12pm', items: items}}/>);

   expect(getByText('name')).toBeVisible();
   expect(getByText('12pm')).toBeVisible();
   expect(queryByTestId('active-modal')).toBeFalsy();
   items.forEach((i) => expect(getByText(`${i.name} (${i.quantity})`)).toBeVisible());
});


test('Deleting list', async () => {
   const mockCallback = jest.fn();
   const {getByTestId, getByText} = renderWithMockApi(
       <Tile instance={{name: 'name', id: '2', created_at:'12pm', items: []}} deleteCallback={mockCallback}/>
   );

   fireEvent.click(getByTestId('delete-list'));
   fireEvent.click(getByText('Delete'));
   await waitFor(() => {
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith('2');
   });
});

