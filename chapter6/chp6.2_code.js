
// 6.2.1 Products, categories, reviews


// From chapter 5 - version 2 - reduced amount of code
product  = db.products.findOne({'slug': 'wheel-barrow-9092'})
reviews_count = db.reviews.count({'product_id': product['_id']})

// start with summary for all products
ratingSummary = db.reviews.aggregate([     
 {$group : { _id:'$product_id',
             count:{$sum:1} }} 
]).next(); 

/* Result

> ratingSummary = db.reviews.aggregate([
...  {$group : { _id:'$product_id',
...              count:{$sum:1} }}
... ]);
{ "_id" : ObjectId("4c4b1476238d3b4dd5003982"), "count" : 2 }
{ "_id" : ObjectId("4c4b1476238d3b4dd5003981"), "count" : 3 }

*/


// rating summary - for selected product
// look up product first
product  = db.products.findOne({'slug': 'wheel-barrow-9092'})

ratingSummary = db.reviews.aggregate([ 
 {$match : { product_id: product['_id']} }, 
 {$group : { _id:'$product_id',
             count:{$sum:1} }} 
]).next(); 

///*  Results
//
// {
// "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
// "average" : 4.333333333333333
// }
//
// */

// Adding average review 

ratingSummary  = db.reviews.aggregate([
    {$match : {'product_id': product['_id']}},
    {$group : { _id:'$product_id',
        average:{$avg:'$rating'},
        count: {$sum:1}}}
]).next();

///* Results
//
// {
// "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
// "average" : 4.333333333333333,
// "count" : 3
// }
//
//THIS WAS MODIFIED TO FIT GRAPHIC
//
// {
// "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
// "average" : 5,
// "count" : 8
// }
//
// */

// With group first

// below was done BEFORE book example

// below verifies that in fact, the first command will use an index, second will not

db.reviews.ensureIndex( { product_id: 1 } )

countsByRating = db.reviews.aggregate([
    {$match : {'product_id': product['_id']}},
    {$group : { _id:'$rating',
        count:{$sum:1}}}
],{explain:true})

countsByRating = db.reviews.aggregate([
    {$group : { _id:{'product_id': '$product_id', rating:'$rating'},
        count:{$sum:1}}},
    {$match : {'_id.product_id': product['_id']}}
],{explain:true})

// BOOK Example:  ***TODO: change this in chapter 6 document - page 9

ratingSummary  = db.reviews.aggregate([
    {$group : { _id:'$product_id',
        average:{$avg:'$rating'},
        count: {$sum:1}}},
    {$match : {'_id': product['_id']}}
]).next();


// Counting Reviews by Rating
countsByRating = db.reviews.aggregate([
    {$match : {'product_id': product['_id']}},
    {$group : { _id:'$rating',
        count:{$sum:1}}}
]).toArray();

///* Results
//
// [ { "_id" : 5, "count" : 1 }, { "_id" : 4, "count" : 2 } ]
//
//THIS WAS CHANGED TO MATCH GRAPHIC
//
// [ { "_id" : 5, "count" : 5 },
// { "_id" : 4, "count" : 2 },
// { "_id" : 3, "count" : 1 } ]
//
//
// */

///* SQL example not tested
//
// SELECT RATING, COUNT(*) AS COUNT
// FROM REVIEWS
// WHERE PRODUCT_ID = '4c4b1476238d3b4dd5003981'
// GROUP BY RATING
//
//
// */


// Joining collections
db.products.aggregate([
    {$group : { _id:'$main_cat_id',
        count:{$sum:1}}}
]);

///* expected results
//
// { "_id" : ObjectId("6a5b1476238d3b4dd5000048"), "count" : 2 }
//
// */

// "join" main category summary with categories
db.mainCategorySummary.remove({});

db.products.aggregate([
        {$group : { _id:'$main_cat_id',
            count:{$sum:1}}}
    ]).forEach(function(doc){
        var category = db.categories.findOne({_id:doc._id});
        if (category !== null) {
            doc.category_name = category.name;
        }
        else {
            doc.category_name = 'not found';
        }
        db.mainCategorySummary.insert(doc);
    })

// findOne on mainCategorySummary

db.mainCategorySummary.findOne()

///*  Expected results
//
// {
// "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
// "count" : 2,
// "category_name" : "Gardening Tools"
// }
//
// */

// Faster Joins - $unwind

// FASTER JOIN - $UNWIND
db.products.aggregate([
    {$project : {category_ids:1}},
    {$unwind : '$category_ids'},
    {$group : { _id:'$category_ids',
        count:{$sum:1}}},
    {$out : 'countsByCategory'}
]);

//  related findOne() - Using $out to create new collections
db.countsByCategory.findOne()

// expected results
// > db.countsByCategory.findOne()
// { "_id" : ObjectId("6a5b1476238d3b4dd5000049"), "count" : 2 }

// 

// $out and $project section

db.products.aggregate([
    {$group : { _id:'$main_cat_id',
                count:{$sum:1}}}, 
    {$out : 'mainCategorySummary'}
]);


db.products.aggregate([
    {$project : {category_ids:1}}
]);

/* Expected output

> db.products.aggregate([
... {$project : {category_ids:1}}
... ]);
{ "_id" : ObjectId("4c4b1476238d3b4dd5003981"), 
  "category_ids" : [ ObjectId("6a5b1476238d3b4dd5000048"), 
                     ObjectId("6a5b1476238d3b4dd5000049") ] }
{ "_id" : ObjectId("4c4b1476238d3b4dd5003982"), 
  "category_ids" : [ ObjectId("6a5b1476238d3b4dd5000048"), 
                     ObjectId("6a5b1476238d3b4dd5000049") ] }

*/
// 6.2.2 User and Order
db.reviews.aggregate([
    {$group :
    {_id : '$user_id',
        count : {$sum : 1},
        avg_helpful : {$avg : '$helpful_votes'}}
    }
])

///* Expected result
//
// { "_id" : ObjectId("4c4b1476238d3b4dd5000003"),
// "count" : 1, "avg_helpful" : 10 }
// { "_id" : ObjectId("4c4b1476238d3b4dd5000002"),
// "count" : 2, "avg_helpful" : 4 }
// { "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
// "count" : 2, "avg_helpful" : 5 }
//
// */

// summarizing sales by year and month
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

// Finding best manhattan customers
upperManhattanOrders = {'shipping_address.zip': {$gte: 10019, $lt: 10040}};

sumByUserId = {_id: '$user_id',
    total: {$sum:'$sub_total'}};

orderTotalLarge = {total: {$gt:10000}};

sortTotalDesc = {total: -1};

db.orders.aggregate([
    {$match: upperManhattanOrders},
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$sort: sortTotalDesc}
]);

db.orders.aggregate([
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$limit: 10}
]);

//    /* results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000002"), "total" : 19588 }
//
//     */

// easier to modify - example - add count
sumByUserId = {_id: '$user_id',
    total: {$sum:'$sub_total'},
    count: {$sum: 1}};

// rerun previous
db.orders.aggregate([
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$limit: 10}
]);

//    /* results
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000002"),
//     "total" : 19588, "count" : 4 }
//
//     */

db.orders.aggregate([
    {$match: upperManhattanOrders},
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$sort: sortTotalDesc},
    {$out: 'targetedCustomers'}
]);

// fixed: added order with upper manhattan shipping address
upperManhattanOrders = {'shipping_address.zip': {$gte: 10019, $lt: 11216}};

db.orders.aggregate([
    {$match: upperManhattanOrders},
    {$group: sumByUserId},
    {$match: orderTotalLarge},
    {$sort: sortTotalDesc},
    {$out: 'targetedCustomers'}
]);

db.targetedCustomers.findOne();

//    /* expected results:
//
//     > db.targetedCustomers.findOne();
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000002"), "total" : 19588 }
//
//
//     */