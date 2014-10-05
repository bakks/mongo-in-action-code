
// Section 6.3

// for 6.3.1 $project
db.users.findOne(
    {username: 'kbanker',                                   // 1
        hashed_password: 'bd1cfa194c3a603e7186780824b04419'},
    {_id: 1}                                                // 2
)

//    /* should return
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001") }
//
//     */


db.users.findOne(
    {username: 'kbanker',
        hashed_password: 'bd1cfa194c3a603e7186780824b04419'},
    {first_name:1, last_name:1}                               // 1
)

//    /* should return
//
//     {
//     "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
//     "first_name" : "Kyle",
//     "last_name" : "Banker"
//     }
//
//     */

db.users.aggregate([
    {$match: {username: 'kbanker'}},
    {$project: {name: {first:'$first_name',
        last:'$last_name'}}
    }
])

//    /* Should return
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"), "name" : { "first" : "Kyle", "last" : "Banker" } }
//
//     */

// 6.3.2 $group
db.orders.aggregate([
    {$project: {user_id:1, line_items:1}},
    {$unwind: '$line_items'},
    {$group: {_id: {user_id:'$user_id'}, purchasedItems: {$push: '$line_items'}}}
]).toArray();

/* expected results
[
    {
        "_id" : {
            "user_id" : ObjectId("4c4b1476238d3b4dd5000002")
        },
        "purchasedItems" : [
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "9092",
                "name" : "Extra Large Wheel Barrow",
                "quantity" : 1,
                "pricing" : {
                    "retail" : 5897,
                    "sale" : 4897
                }
            },
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "9092",
                "name" : "Extra Large Wheel Barrow",
                "quantity" : 1,
                "pricing" : {
                    "retail" : 5897,
                    "sale" : 4897
                }
            },
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "9092",
                "name" : "Extra Large Wheel Barrow",
                "quantity" : 1,
                "pricing" : {
                    "retail" : 5897,
                    "sale" : 4897
                }
            },
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "9092",
                "name" : "Extra Large Wheel Barrow",
                "quantity" : 1,
                "pricing" : {
                    "retail" : 5897,
                    "sale" : 4897
                }
            }
        ]
    },
    {
        "_id" : {
            "user_id" : ObjectId("4c4b1476238d3b4dd5000001")
        },
        "purchasedItems" : [
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "9092",
                "name" : "Extra Large Wheel Barrow",
                "quantity" : 1,
                "pricing" : {
                    "retail" : 5897,
                    "sale" : 4897
                }
            },
            {
                "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "sku" : "10027",
                "name" : "Rubberized Work Glove, Black",
                "quantity" : 2,
                "pricing" : {
                    "retail" : 1499,
                    "sale" : 1299
                }
            }
        ]
    }
]

*/

db.orders.aggregate([
    {"$match": {"purchase_data":
    {"$gte" : new Date(2010, 0, 1)}}},
    {"$group": {
        "_id": {"year" : {"$year" :"$purchase_data"},
            "month" : {"$month" : "$purchase_data"}},
        "count": {"$sum":1},
        "total": {"$sum":"$sub_total"}}},
    {"$sort": {"_id":-1}}
]);

//    /* expected results
//
//     { "_id" : { "year" : 2014, "month" : 11 }, "count" : 1, "total" : 4897 }
//     { "_id" : { "year" : 2014, "month" : 8 }, "count" : 2, "total" : 11093 }
//     { "_id" : { "year" : 2014, "month" : 4 }, "count" : 1, "total" : 4897 }
//
//     */

// 6.3.3 $match, $sort, $skip, $limit

// based on the example from from chapter 5.1.1
// PAGINATING YOUR PRODUCT REVIEWS WITH SKIP, LIMIT AND SORT
page_number = 1
product = db.products.findOne({'slug': 'wheel-barrow-9092'})

reviews = db.reviews.find({'product_id': product['_id']}).
                     skip((page_number - 1) * 12).
                     limit(12).
                     sort({'helpful_votes': -1})

/* expected output

> reviews = db.reviews.find({'product_id': product['_id']}).
...                      skip((page_number - 1) * 12).
...                      limit(12).
...                      sort({'helpful_votes': -1})
{ "_id" : ObjectId("4c4b1476238d3b4dd5000045"), "product_id" : ObjectId("4c4b1476238d3b4dd5003981"), "user_id" : ObjectId("4c4b1476238d3b4dd5000003"), "rating" : 4, "helpful_votes" : 10 }
{ "_id" : ObjectId("4c4b1476238d3b4dd5000043"), "product_id" : ObjectId("4c4b1476238d3b4dd5003981"), "user_id" : ObjectId("4c4b1476238d3b4dd5000002"), "rating" : 5, "helpful_votes" : 7 }
{ "_id" : ObjectId("4c4b1476238d3b4dd5000041"), "product_id" : ObjectId("4c4b1476238d3b4dd5003981"), "date" : ISODate("2010-06-07T07:00:00Z"), "title" : "Amazing", "text" : "Has a squeaky wheel, but still a darn good wheel barrow.", "rating" : 4, "user_id" : ObjectId("4c4b1476238d3b4dd5000001"), "username" : "dgreenthumb", "helpful_votes" : 3, "voter_ids" : [ ObjectId("4c4b1476238d3b4dd5000041"), ObjectId("7a4f0376238d3b4dd5000003"), ObjectId("92c21476238d3b4dd5000032") ] }

*/
         
                     
// same thing in aggregation framework

reviews2 = db.reviews.aggregate([
    {$match: {'product_id': product['_id']}},
    {$skip : (page_number - 1) * 12},
    {$limit: 12},
    {$sort:  {'helpful_votes': -1}}
]).toArray();

/* expected output

> reviews2 = db.reviews.aggregate([
...     {$match: {'product_id': product['_id']}},
... {$skip : (page_number - 1) * 12},
... {$limit: 12},
... {$sort:  {'helpful_votes': -1}}
... ]).toArray();
[
        {
                "_id" : ObjectId("4c4b1476238d3b4dd5000045"),
                "product_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "user_id" : ObjectId("4c4b1476238d3b4dd5000003"),
                "rating" : 4,
                "helpful_votes" : 10
        },
        {
                "_id" : ObjectId("4c4b1476238d3b4dd5000043"),
                "product_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "user_id" : ObjectId("4c4b1476238d3b4dd5000002"),
                "rating" : 5,
                "helpful_votes" : 7
        },
        {
                "_id" : ObjectId("4c4b1476238d3b4dd5000041"),
                "product_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                "date" : ISODate("2010-06-07T07:00:00Z"),
                "title" : "Amazing",
                "text" : "Has a squeaky wheel, but still a darn good wheel barrow.",
                "rating" : 4,
                "user_id" : ObjectId("4c4b1476238d3b4dd5000001"),
                "username" : "dgreenthumb",
                "helpful_votes" : 3,
                "voter_ids" : [
                        ObjectId("4c4b1476238d3b4dd5000041"),
                        ObjectId("7a4f0376238d3b4dd5000003"),
                        ObjectId("92c21476238d3b4dd5000032")
                ]
        }
]

*/



// also need these, but not shown in text
upperManhattanOrders = {'shipping_address.zip': {$gte: 10019, $lt: 10040}};

sumByUserId = {_id: '$user_id',
    total: {$sum:'$sub_total'}};

orderTotalLarge = {total: {$gt:10000}};

// shown in text
sortTotalDesc = {total: -1};

db.orders.aggregate([
    {$match: upperManhattanOrders},
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$sort: sortTotalDesc},
    {$out: 'targetedCustomers'}
]);

// rerun previous also shown in text
db.orders.aggregate([
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$limit: 10}
]);

//    /* Expected results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000002"), "total" : 19588 }
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"), "total" : 6196 }
//
//     */

// 6.3.4 $unwind
db.products.aggregate([
    {$project : {category_ids:1}},
    {$unwind : '$category_ids'},
    {$limit: 2}
]);

//    /* expected results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5003981"), "category_ids" : ObjectId("6a5b1476238d3b4dd5000048") }
//     { "_id" : ObjectId("4c4b1476238d3b4dd5003981"), "category_ids" : ObjectId("6a5b1476238d3b4dd5000049") }
//
//     */


// 6.3.5 $out

// these may be needed before running query

upperManhattanOrders = {'shipping_address.zip': {$gte: 10019, $lt: 10040}};

sumByUserId = {_id: '$user_id',
    total: {$sum:'$sub_total'}};

orderTotalLarge = {total: {$gt:10000}};

sortTotalDesc = {total: -1};


// shown in text

db.orders.aggregate([
    {$match: upperManhattanOrders},
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$sort: sortTotalDesc},
    {$out: 'targetedCustomers'}
]);

