const a = {
    id: 1,
    date: '2025-03-20',
    received: 200,
    description: 'my description',
    references: {
        customer: 2
    },
    items: [
        {
            description: 'item1 description',
            quantity: 3,
            otherPrice: 0,
            references: {
                inventory: 1,
                product: 1
            }
        },
        {
            description: 'item2 description',
            quantity: 4,
            otherPrice: 5,
            references: {
                inventory: 1,
                product: 1
            }
        }
    ]
}

export function run() {
    console.log(JSON.stringify(a, null, 5));
}

[{
    "inv_id": 1,
    "prices": {
        "sale": 1200,
        "purchase": 11001,
        "otherPrice": 0
    },
    "product": {
        "id": 1,
        "name": "iphone 6"
    },
    "quantity": 3,
    "description": "item1 description"
},
{
    "inv_id": 1,
    "prices": {
        "sale": 1200,
        "purchase": 11001,
        "otherPrice": 5
    },
    "product": {
        "id": 1,
        "name": "iphone 6"
    },
    "quantity": 4,
    "description": "item2 description"
}]