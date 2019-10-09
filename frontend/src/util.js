import Cookies from "js-cookie";


function fetchDjango(url, init) {
    return fetch(url, {
        method: init['method'],
        headers: {
          'X-CSRFToken': Cookies.get("csrftoken"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(init['body'])
    });
}

function shoppingListsUrl(id) {
    if (id) {
        return '/api/shopping-lists/' + id + '/';
    }
    else {
        return '/api/shopping-lists/';
    }
}

export {fetchDjango, shoppingListsUrl}