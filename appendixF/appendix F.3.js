
// F3.Date Functions

db.orders.aggregate([
    {$match: {purchase_data: {$gte: new Date(2010, 0, 1)}}},
    {$group: {
        _id: {year : {$year :'$purchase_data'},         // 1
            month: {$month :'$purchase_data'}},       // 2
        count: {$sum:1},
        total: {$sum:'$sub_total'}}},
    {$sort: {_id:-1}}
]);

//    /* Expected results
//     // NOTE: we've modified the "month" value to skip some of the blank months
//
//     { "_id" : { "year" : 2014, "month" : 11 },
//     "count" : 1, "total" : 4897 }
//     { "_id" : { "year" : 2014, "month" : 10 },
//     "count" : 2, "total" : 11093 }
//     { "_id" : { "year" : 2014, "month" : 9 },
//     "count" : 1, "total" : 4897 }
//
//     */