import {fireEvent, render, waitForDomChange, waitFor} from "@testing-library/react";
import Table from "../components/Table";
import React from "react";
import {getMockPatchResponse, itemList} from "./testUtil";


test('Render as expected', () => {
    const items = itemList();
    const {getByText} = render(<Table items={items} />);

    expect(getByText('name')).toBeVisible();
    expect(getByText('quantity')).toBeVisible();
    expect(getByText('who')).toBeVisible();
    expect(getByText('when')).toBeVisible();
    items.forEach((item) => expect(getByText(item.name)).toBeVisible());
});


describe('Table sorting', () => {

    function checkRowValues(container, rowIndex, first, second, third, fourth) {
        const row = container.getElementsByTagName('tr')[rowIndex];
        const rowData = row.getElementsByTagName('td');
        expect(rowData[2].innerHTML).toBe(first);
        expect(rowData[3].innerHTML).toBe(second);
        expect(rowData[4].innerHTML).toBe(third);
        expect(rowData[5].innerHTML).toBe(fourth);

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

        checkRowValues(container, 4,'onion', '1g', '1', '29/09/2019 19:03:59');
    });

    test('Items move to the bottom after being checked', async () => {
        const items = itemList();

        const {container} = render(<Table items={items} />);
        const firstButton = container.getElementsByClassName('fa-check')[0];

        const firstRow = checkRowValues(
            container, 2, 'onion', '1g', '1', '29/09/2019 19:03:59'
        );
        const secondRow = checkRowValues(
            container, 3, 'banana', '100kg', '1', '02/01/2010 20:03:59'
        );
        const thirdRow = checkRowValues(
            container, 4, 'milk', '10L', '1', '04/01/2018 21:03:59'
        );

        fireEvent.click(firstButton);
        //await waitForDomChange({container});

        await waitFor(() => {
            const newFirstRow = container.getElementsByTagName('tr')[2];
            const newSecondRow = container.getElementsByTagName('tr')[3];
            const newThirdRow = container.getElementsByTagName('tr')[4];

            expect(newFirstRow).toBe(secondRow);
            expect(newSecondRow).toBe(thirdRow);
            expect(newThirdRow).toBe(firstRow);
        });

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
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        fireEvent.click(container.getElementsByClassName('fa-check')[0]);
        await waitForDomChange({container}); // TODO: dont use this

        const rowBeingUnchecked = container.getElementsByTagName('tr')[4];
        const uncheckButton = rowBeingUnchecked.getElementsByClassName('fa-undo')[0].parentElement;

        fireEvent.click(uncheckButton);
        await waitFor(() => {
            const newFirstRow = container.getElementsByTagName('tr')[2];
            expect(newFirstRow).toBe(rowBeingUnchecked);
        })
    });

});