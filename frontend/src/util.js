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

export {fetchDjango}