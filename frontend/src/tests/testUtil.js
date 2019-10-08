
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

function shoppingLists() {
    return [
        {
            "name": "tesco",
            "created_by": 2,
            "created_at": "07/10/2019 19:35:44",
            "items": [
              {
                "id": 12,
                "name": "cheese strings",
                "quantity": "1",
                "added_by": 1,
                "added_at": "07/10/2019 19:35:44",
                "is_checked": false
              },
              {
                "id": 11,
                "name": "spinach",
                "quantity": "2 packs",
                "added_by": 2,
                "added_at": "07/10/2019 19:35:44",
                "is_checked": false
              }
            ]
        },
        {
            "name": "food",
            "created_by": 1,
            "created_at": "10/10/2018 16:35:44",
            "items": [
              {
                "id": 1,
                "name": "chicken",
                "quantity": "900kg",
                "added_by": 1,
                "added_at": "07/10/2019 10:26:01",
                "is_checked": false
              },
              {
                "id": 3,
                "name": "parsley",
                "quantity": "50g",
                "added_by": 2,
                "added_at": "01/11/2019 11:21:11",
                "is_checked": false
              }
            ]
        },
    ]
}

export {getMockPatchResponse, itemList, shoppingLists}