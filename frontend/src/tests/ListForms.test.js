import {render, fireEvent, waitFor} from "@testing-library/react";
import React from "react";
import EditListForm from "../components/forms/EditListForm";
import AddListForm from "../components/forms/AddListForm";
import {useListModalForm} from "../hooks/useListModalForm";
import {renderWithMockApi} from "./mockApi";


describe('Modal toggle works', () => {

    const TestComponent = (props) => {
        const [formRender, listName, setError, toggle] = useListModalForm(props.name, jest.fn(), 'input');

        return <div>
            <a onClick={toggle}>toggle_modal</a>
            {formRender}
        </div>;
    };

    test('Toggle callback makes modal pop up', () => {
       const {getByText, queryByTestId} = render(<TestComponent name={'test'}/>);

       expect(queryByTestId('active-modal')).toBeFalsy();
       fireEvent.click(getByText('toggle_modal'));
       expect(queryByTestId('active-modal')).toBeTruthy();
       fireEvent.click(getByText('toggle_modal'));
       expect(queryByTestId('active-modal')).toBeFalsy();
    });
});

describe('Modal error setting', () => {
    const TestComponent = (props) => {
        const [formRender, listName, setError, toggle] = useListModalForm(props.name, jest.fn(), 'input');

        return <div>
            <a onClick={() => setError(true)}>set_error</a>
            {formRender}
        </div>;
    };

    test('Error callback displays danger css', () => {
        const {getByTestId, getByText} = render(<TestComponent name={'test'}/>);

        const input = getByTestId('input');
        expect(input.classList).not.toContain('is-danger');
        fireEvent.click(getByText('set_error'));
        expect(input.classList).toContain('is-danger');
    })
});

describe('Form submission', () => {
    const handleSubmit = jest.fn().mockImplementation((e) => e.preventDefault());
    const TestComponent = (props) => {
        const [formRender, listName, setError, toggle] = useListModalForm(props.name, handleSubmit, 'input');

        return <div>
            {formRender}
            <div>NAME: {listName}</div>
        </div>;
    };

    test('handleSubmit called on form save', () => {
        const {getByTestId, getByText} = render(<TestComponent name={'test'}/>);

        fireEvent.change(getByTestId('input'), {target: {value: 'foobar'}});
        fireEvent.click(getByText('Save'));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
        expect(getByText('NAME: foobar')).toBeVisible(); // handleChange is working
    })
});

describe('EditListForm', () => {

    test('Render as expected', () => {
        const {getByTestId} = renderWithMockApi(<EditListForm/>);
        expect(getByTestId('edit-list-button')).toBeVisible();
    });

    test('Error displayed if name is blank', () => {
        const {getByTestId, getByText} = renderWithMockApi(<EditListForm/>);

        fireEvent.click(getByTestId('edit-list-button'));
        expect(getByTestId('edit-list-name-input').classList).not.toContain('is-danger');
        fireEvent.click(getByText('Save'));
        expect(getByTestId('edit-list-name-input').classList).toContain('is-danger');
    });

    test('Modal appears on toggle then disappears after submit', async () => {
        const callback = jest.fn();
        const {getByTestId, getByText, queryByTestId} = renderWithMockApi(<EditListForm name='' callback={callback}/>);

        expect(queryByTestId('active-modal')).toBeFalsy();
        fireEvent.click(getByTestId('edit-list-button'));
        expect(queryByTestId('active-modal')).toBeTruthy();

        fireEvent.change(getByTestId('edit-list-name-input'), {target: {value: 'foobar'}});
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(queryByTestId('active-modal')).toBeFalsy());
        expect(callback).toHaveBeenCalled();
    });
});

describe('AddListForm', () => {

    test('Render as expected', () => {
        const {getByText} = renderWithMockApi(<AddListForm/>);
        expect(getByText('New list')).toBeVisible();
    });

    test('Error displayed if name is blank', () => {
        const {getByTestId, getByText} = renderWithMockApi(<AddListForm/>);

        fireEvent.click(getByText('New list'));
        expect(getByTestId('new-list-name-input').classList).not.toContain('is-danger');
        fireEvent.click(getByText('Save'));
        expect(getByTestId('new-list-name-input').classList).toContain('is-danger');
    });

    test('Modal appears on toggle then disappears after submit', async () => {
        const callback = jest.fn();
        const {getByTestId, getByText, queryByTestId} = renderWithMockApi(<AddListForm name='' callback={callback}/>);

        expect(queryByTestId('active-modal')).toBeFalsy();
        fireEvent.click(getByText('New list'));
        expect(queryByTestId('active-modal')).toBeTruthy();

        fireEvent.change(getByTestId('new-list-name-input'), {target: {value: 'foobar'}});
        fireEvent.click(getByText('Save'));
        await waitFor(() => expect(queryByTestId('active-modal')).toBeFalsy());
        expect(callback).toHaveBeenCalled();
    });
});
