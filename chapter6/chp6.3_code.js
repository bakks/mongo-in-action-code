
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

// 6.3.2 $match, $sort, $skip, $limit
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

// 6.3.3 $unwind
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

// 6.3.4 $group

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

