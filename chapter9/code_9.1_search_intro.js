// first the index
db.products.ensureIndex(           
    {name: 'text',
     description: 'text',
     tags: 'text'}
);

db.products.find({$text: {$search: 'gardens'}},{_id:0, name:1,description:1,tags:1}).pretty()

// result
/*
> db.products
    .find({$text: {$search: 'gardens'}},{_id:0, name:1,description:1,tags:1})
    .pretty()

{
    "name" : "Rubberized Work Glove, Black",
    "description" : "Black Rubberized Work Gloves...",
    "tags" : [
        "gardening"
    ]
}
{
    "name" : "Extra Large Wheel Barrow",
    "description" : "Heavy duty wheel barrow...",
    "tags" : [
        "tools",
        "gardening",
        "soil"
    ]
}
*/

