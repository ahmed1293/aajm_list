import {APIContext} from "../api";
import React from "react";
import {render} from '@testing-library/react'


export const api = {
    GET: (endpoint) => {
        const response = (endpoint === 'shopping-lists') ? [...SHOPPING_LISTS]:[...ITEM_LIST];
        return Promise.resolve({
            data: response,
            controller: new AbortController()
        })
    },
    POST: (endpoint, data) => mockPostPatch(endpoint, '1', data),
    DELETE: () => new AbortController(),
    PATCH: (endpoint, id, data) => mockPostPatch(endpoint, id, data)
};

export const renderWithMockApi = (components, override) => {
    const _api = override ? {...api, [override.method]: override.func}:api;
    return render(<APIContext.Provider value={_api}>{components}</APIContext.Provider>);
};

const mockPostPatch = (endpoint, id, data) => {
    let response;
    const _id = Math.floor(Math.random() * Math.floor(100));
    if (endpoint === 'shopping-lists') {
        response = {
            "id": _id,
            "name": data.name,
            "created_by": "bob",
            "created_at": "07/10/2019 19:35:44",
            "items":[]
        }
    } else {
        response = {
            "id": _id,
            "name": data.name,
            "quantity": data.quantity,
            "added_by": 1,
            "added_at": "29/09/2019 19:03:59",
            "is_checked": false
        }
    }
    return Promise.resolve({
        data: response,
        controller: new AbortController()
    })
};

export const ITEM_LIST = [
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
    }
];

export const SHOPPING_LISTS = [
    {
        "id": 1,
        "name": "tesco",
        "created_by": "bob",
        "created_at": "07/10/2019 19:35:44",
        "items": [
          {
            "id": 12,
            "name": "cheese strings",
            "quantity": "1",
            "added_by": "bob",
            "added_at": "07/10/2019 19:35:44",
            "is_checked": false
          },
          {
            "id": 11,
            "name": "spinach",
            "quantity": "2 packs",
            "added_by": "billy",
            "added_at": "07/10/2019 19:35:44",
            "is_checked": false
          }
        ]
    },
    {
        "id": 2,
        "name": "food",
        "created_by": 1,
        "created_at": "10/10/2018 16:35:44",
        "items": [
          {
            "id": 1,
            "name": "chicken",
            "quantity": "900kg",
            "added_by": "bob",
            "added_at": "07/10/2019 10:26:01",
            "is_checked": false
          },
          {
            "id": 3,
            "name": "parsley",
            "quantity": "50g",
            "added_by": "billy",
            "added_at": "01/11/2019 11:21:11",
            "is_checked": false
          }
        ]
    },
];
