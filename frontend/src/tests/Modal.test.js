import {render} from "@testing-library/react";
import React from "react";
import Modal from "../components/Modal";


describe('Modal appears/reappears correctly', () => {


    test.each([
        [true, true], [false, false]
    ])('Modal active=%p if visible=%p',  (active, visible) => {
        const {queryAllByTestId} = render(<Modal active={active}/>);
        expect(queryAllByTestId('active-modal').length > 0).toBe(visible);
    });

});