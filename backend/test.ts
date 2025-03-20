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