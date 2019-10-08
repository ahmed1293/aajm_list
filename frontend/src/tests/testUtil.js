import {fireEvent} from "@testing-library/dom";


async function clickThenFlush(element) {
    fireEvent.click(element);
    const flushPromises = () => new Promise(setImmediate); // TODO: is this bad?
    await flushPromises();
}

function getMockPatchResponse() {
    return Promise.resolve({
        ok: true,
        json: () => {
            return {
                "id": 1,
                "name": "onion",
                "quantity": "1g",
                "added_by": 1,
                "added_at": "29/09/2019 19:03:59",
                "is_checked": true
            }
        }
    })
}

function itemList() {
    return [
        {
            "id": 1,
            "name": "onion",
            "quantity": "1g",
            "added_by": 1,
            "added_at": "29/09/2019 19:03:59",
            "is_checked": false
        },
        {
            "id": 2,
            "name": "banana",
            "quantity": "100kg",
            "added_by": 1,
            "added_at": "02/01/2010 20:03:59",
            "is_checked": false
        },
        {
            "id": 3,
            "name": "milk",
            "quantity": "10L",
            "added_by": 1,
            "added_at": "04/01/2018 21:03:59",
            "is_checked": false
        }];
}

export {clickThenFlush, getMockPatchResponse, itemList}