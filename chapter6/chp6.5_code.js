

// 6.5  Performance considerations and limits
// listing 6.3

db.numbers.find({num: {"$gt": 199995 }}).explain()

//    /* should return
//
//     > db.numbers.find({num: {"$gt": 199995 }}).explain()
//     {
//         "cursor" : "BasicCursor",
//         "isMultiKey" : false,
//         "n" : 0,
//         "nscannedObjects" : 0,
//         "nscanned" : 0,
//         "nscannedObjectsAllPlans" : 0,
//         "nscannedAllPlans" : 0,
//         "scanAndOrder" : false,
//         "indexOnly" : false,
//         "nYields" : 0,
//         "nChunkSkips" : 0,
//         "millis" : 0,
//         "server" : "D830J:27017"
//     }
//
//     */

// listing 6.4

// make sure we have the index
db.reviews.ensureIndex( { product_id: 1 } )

product  = db.products.findOne({'slug': 'wheel-barrow-9092'})

countsByRating = db.reviews.aggregate([
    {$match : {'product_id': product['_id']}},
    {$group : { _id:'$rating',
        count:{$sum:1}}}
],{explain:true})

//    /* should return
//    > countsByRating = db.reviews.aggregate([
//        ...  {$match : {'product_id': product['_id']}},
//    ...  {$group : { _id:'$rating',
//    ...            count:{$sum:1}}}
//    ... ],{explain:true})
//    {
//        "stages" : [
//        {
//            "$cursor" : {
//                "query" : {
//                    "product_id" : ObjectId("4c4b1476238d3b4dd5003981")
//                },
//                "fields" : {
//                    "rating" : 1,
//                    "_id" : 0
//                },
//                "plan" : {
//                    "cursor" : "BtreeCursor ",
//                    "isMultiKey" : false,
//                    "scanAndOrder" : false,
//                    "indexBounds" : {
//                        "product_id" : [
//                            [
//                                ObjectId("4c4b1476238d3b4dd5003981"),
//                                ObjectId("4c4b1476238d3b4dd5003981")
//                            ]
//                        ]
//                    },
//                    "allPlans" : [
//                        ...
//    ]
//    }
//    }
//    },
//    {
//        "$group" : {
//        "_id" : "$rating",
//            "count" : {
//            "$sum" : {
//                "$const" : 1
//            }
//        }
//    }
//    }
//    ],
//    "ok" : 1
//    }
//
//     */

// allowDiskUse option example
db.orders.aggregate([
    {$match: {purchase_data: {$gte: new Date(2010, 0, 1)}}},
    {$group: {
        _id: {year : {$year :'$purchase_data'},
            month: {$month :'$purchase_data'}},
        count: {$sum:1},
        total: {$sum:'$sub_total'}}},
    {$sort: {_id:-1}}
], {allowDiskUse:true});

// aggregate cursor option example
product  = db.products.findOne({'slug': 'wheel-barrow-9092'})
countsByRating = db.reviews.aggregate([
    {$match : {'product_id': product['_id']}},
    {$group : { _id:'$rating',
        count:{$sum:1}}}
],{cursor:{}})



