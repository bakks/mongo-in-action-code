

// Logical functions

// use of $ifNull

db.orders.aggregate([
    {$project: {
        orderTotal: {
            $add:['$sub_total','$tax']}
    }
    }
])

//    /* expected results
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderTotal" : null }                            // 1
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000049"),
//     "orderTotal" : null }
//
//     */

db.orders.aggregate([
    {$project: {
        orderTotal: {
            $add:['$sub_total',
                {$ifNull: ['$tax',0]}]}  //1
    }
    }
])

//    /* expected results
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderTotal" : 6796 }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000049"),
//     "orderTotal" : 4897 }
//
//     */


// Same as before but use $cond
db.orders.aggregate([
    {$project: {
        orderTotal: {
            $add:['$sub_total',
                {$cond: {if: '$tax',
                    then: '$tax',
                    else: 0}}
            ]}
    }
    }
])


db.orders.aggregate([
    {$project: {
        orderTotal: {
            $add:['$sub_total',
                {$cond: ['$tax','$tax', 0] }
            ]}
    }
    }
])

