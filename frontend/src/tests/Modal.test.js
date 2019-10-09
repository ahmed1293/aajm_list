import {itemList} from "./testUtil";
import {fireEvent, render} from "@testing-library/react";
import Table from "../components/Table";
import React from "react";


describe('Modal appears/reappears correctly', () => {

    const ITEMS = itemList();

    test('Form not visible on initial render',  () => {
        const {container} = render(<Table items={ITEMS} />);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();
    });

    test('Form pops up after button click', () => {
        const {container} = render(<Table items={ITEMS} />);
        const addItemButton = container.getElementsByClassName('fa-plus')[0].parentElement;

        fireEvent.click(addItemButton);

        expect(container.getElementsByClassName('modal is-active')[0]).toBeTruthy();
    });

    test('Form disappears after clicking on page', () => {
        const {container} = render(<Table items={ITEMS} />);
        const addItemButton = container.getElementsByClassName('fa-plus')[0].parentElement;

        fireEvent.click(addItemButton);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeTruthy();

        const modalBackground = container.getElementsByClassName('modal-background')[0];
        fireEvent.click(modalBackground);
        expect(container.getElementsByClassName('modal is-active')[0]).toBeFalsy();
    });
});