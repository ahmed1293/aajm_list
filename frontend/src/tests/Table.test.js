import {render} from "@testing-library/react";
import Table from "../components/Table";
import React from "react";
import {clickThenFlush, getMockPatchResponse, itemList} from "./testUtil";


describe('Table rendering', () => {

    test('No table if no items', () => {
        const {container} = render(<Table items={[]} />);
        const table = container.getElementsByTagName('table');
        expect(table.length).toBe(0);
    });

    test('Table rendered if items passed through', () => {
       const {container} = render(<Table items={itemList()} />);
       const table = container.getElementsByTagName('table');
       const rows = container.getElementsByTagName('tr');
       expect(table.length).toBe(1);
       expect(rows.length).toBe(4);
    })

});


describe('Table sorting', () => {

    function checkRowValues(container, rowIndex, first, second, third, fourth) {
        const row = container.getElementsByTagName('tr')[rowIndex];
        const rowData = row.getElementsByTagName('td');
        expect(rowData[0].innerHTML).toBe(first);
        expect(rowData[1].innerHTML).toBe(second);
        expect(rowData[2].innerHTML).toBe(third);
        expect(rowData[3].innerHTML).toBe(fourth);

        return row;
    }

    const mockFetch = jest.fn();
    beforeAll(() => {
        global.fetch = mockFetch.mockReturnValue(
            getMockPatchResponse()
        );
    });

    test('Checked items at bottom on initial sort', () => {
        let items = itemList();
        items[0]['is_checked'] = true;
        const {container} = render(<Table items={items} />);

        checkRowValues(container, 3,'onion', '1g', '1', '29/09/2019 19:03:59');
    });

    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {container} = render(<Table items={items} />);
        const firstButton = container.getElementsByTagName('svg')[0];

        const firstRow = checkRowValues(
            container, 1, 'onion', '1g', '1', '29/09/2019 19:03:59'
        );
        const secondRow = checkRowValues(
            container, 2, 'banana', '100kg', '1', '02/01/2010 20:03:59'
        );
        const thirdRow = checkRowValues(
            container, 3, 'milk', '10L', '1', '04/01/2018 21:03:59'
        );

        await clickThenFlush(firstButton);

        const newFirstRow = container.getElementsByTagName('tr')[1];
        const newSecondRow = container.getElementsByTagName('tr')[2];
        const newThirdRow = container.getElementsByTagName('tr')[3];

        expect(newFirstRow).toBe(secondRow);
        expect(newSecondRow).toBe(thirdRow);
        expect(newThirdRow).toBe(firstRow);
    });

    test('Items move away from bottom if check is undone', async () => {
        let mockItems = itemList();
        mockItems[0]['is_checked'] = true;
        mockItems[1]['is_checked'] = true;
        mockItems[2]['is_checked'] = true;

        // fetch must return the correct PATCH response for sorting
        global.fetch = jest.fn()
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[0]}})
            ) // check onion
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[1]}})
            ) // check banana
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {return mockItems[2]}})
            ) // check milk
            .mockResolvedValueOnce(
                Promise.resolve({ok: true, json: () => {
                    mockItems[0]['is_checked'] = false;
                    return mockItems[0]}})
            ); // check onion again

        const {container} = render(<Table items={itemList()} />);

        // check all items
        await clickThenFlush(container.getElementsByTagName('svg')[0]);
        await clickThenFlush(container.getElementsByTagName('svg')[0]);
        await clickThenFlush(container.getElementsByTagName('svg')[0]);

        const rowBeingUnchecked = container.getElementsByTagName('tr')[3];
        const uncheckButton = rowBeingUnchecked.getElementsByTagName('svg')[0];
        await clickThenFlush(uncheckButton);

        const newFirstRow = container.getElementsByTagName('tr')[1];

        expect(newFirstRow).toBe(rowBeingUnchecked);
    })

});