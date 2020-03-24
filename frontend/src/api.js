import Cookies from "js-cookie";
import {createContext} from "react";


// TODO: return controller for abort
// TODO: mock version for tests

export const api = {
    GET: (endpoint) => _get(endpoint),
    POST: (endpoint, data) => _post(endpoint, data),
    DELETE: (endpoint, id) => _delete(endpoint, id),
    PATCH: (endpoint, id, data) => _patch(endpoint, id, data)
};
export const APIContext = createContext(api);

const _get = async (endpoint) => {
    const controller = new AbortController();
    const signal = controller.signal;

    let response = await fetch(`api/${endpoint}/`, {signal});
    _raiseForStatus(response.status, 200);
    return {data: await response.json(), controller: controller};
};


const _post = async (endpoint, data) => {
    let {response, controller} = await _fetchDjango(
        `/api/${endpoint}/`, {
            method: 'POST',
            body: data
    });

    _raiseForStatus(response.status, 201);
    return {data: await response.json(), controller: controller};
};


const _delete = async (endpoint, id) => {
    const {response, controller} = await _fetchDjango(
        `/api/${endpoint}/${id}/`, {
            method: 'DELETE'
        });

    _raiseForStatus(response.status, 204);
    return controller;
};


const _patch = async (endpoint, id, data) => {
    let {response, controller} = await _fetchDjango(
        `/api/${endpoint}/${id}/`, {
            method: 'PATCH',
            body: data
    });

    _raiseForStatus(response.status, 200);
    return {data: await response.json(), controller: controller};
};


async function _fetchDjango(url, init) {
    const controller = new AbortController();
    const signal = controller.signal;

    let response = await fetch(url, {
        method: init['method'],
        headers: {
          'X-CSRFToken': Cookies.get("csrftoken"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(init['body']),
        signal: signal
    });

    return {response: response, controller: controller};
}


function _raiseForStatus(status, expected) {
    if (status !== expected) {
        const message = 'An error occurred while fetching data. Code: ' + status;
        console.error(message);
        throw new Error(message);
    }
}