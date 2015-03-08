// F.1 String Functions

// $substr converts values to strings
db.orders.aggregate([
    {$unwind: '$line_items'},
    {$project: {
        'line_items.name': 1,
        orderQuantity:
        {$substr:['$line_items.quantity',0,10]}}},
    {$project: {
        orderSummary:
        {$concat: ['$orderQuantity', ' ', '$line_items.name']}}}
])

//    /* expected results
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderSummary" : "1 Extra Large Wheel Barrow" }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderSummary" : "2 Rubberized Work Glove, Black" }
//
//     */

// strcmp example
db.users.aggregate([
    {$match: {username: 'kbanker'}},
    {$project:
    {firstStringLT: {$strcasecmp:['ABANKER','$username']},
        firstStringEQ: {$strcasecmp:['kbanker','$username']},
        firstStringGT: {$strcasecmp:['ZBANKER','$username']}
    }
    }
])

//    /* Expected results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
//     "firstStringLT" : -1,
//     "firstStringEQ" : 0,
//     "firstStringGT" : 1 }
//
//     */


db.users.aggregate([
    {$match: {username: 'kbanker'}},
    {$project:
    {firstStringLT: {$cmp:['ABANKER','$username']},
        firstStringEQ: {$cmp:['kbanker','$username']},
        firstStringGT: {$cmp:['ZBANKER','$username']}
    }
    }
])

//    /* Expected results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
//     "firstStringLT" : -1,
//     "firstStringEQ" : 0,
//     "firstStringGT" : -1
//     }
//
//     */