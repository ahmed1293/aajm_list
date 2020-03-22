import {render} from "@testing-library/react";
import React from "react";
import Tile from "../components/Tile";


test('Render as expected', () => {
   const {getByText} = render(<Tile instance={{name: 'l1', id: '2', created_at:'12pm', items: []}}/>);

   expect(getByText('l1')).toBeVisible();
   expect(getByText('12pm')).toBeVisible();
});


// binning modal so leaving tests for now

