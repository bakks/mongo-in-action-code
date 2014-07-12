// 6.6.1 count() and distinct()

product = db.products.findOne({'slug': 'wheel-barrow-9092'})
reviews_count = db.reviews.count({'product_id': product['_id']})

db.orders.distinct('shipping_address.zip')

// 6.6.2 Map-reduce
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

// NOTE: corrected map reduce example from first edition.

map = function() {
    var shipping_month = (this.purchase_data.getMonth()+1) +
        '-' + this.purchase_data.getFullYear();

    var tmpItems = 0;
    this.line_items.forEach(function(item) {
        tmpItems += item.quantity;
    });

    emit(shipping_month, {order_total: this.sub_total, items_total: tmpItems});
};

reduce = function(key, values) {
    var result = { order_total: 0, items_total: 0 };
    values.forEach(function(value){
        result.order_total += value.order_total;
        result.items_total += value.items_total;
    });
    return ( result );
};

filter = {purchase_data: {$gte: new Date(2010, 0, 1)}};
db.orders.mapReduce(map, reduce, {query: filter, out: 'totals'});

db.totals.find();

//    /* FIRST EDITION Stated expected results - NOT FOR THIS DATA
//
//    { _id: "1-2011", value: { total: 32002300, items: 59 }}
//    { _id: "2-2011", value: { total: 45439500, items: 71 }}
//    { _id: "3-2011", value: { total: 54322300, items: 98 }}
//    { _id: "4-2011", value: { total: 75534200, items: 115 }}
//    { _id: "5-2011", value: { total: 81232100, items: 121 }}
//    */

//    /* ACTUAL Expected results
//    To see what data is available:
//
//     db.orders.find({purchase_data: {$gte: new Date(2010, 0, 1)}},
//                    {purchase_data:1, sub_total:1, 'line_items.quantity':1 })
//
//    which returns:
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"), "purchase_data" : ISODate("2014-08-01T07:00:00Z"),
//       "line_items" : [ { "quantity" : 1 }, { "quantity" : 2 } ], "sub_total" : 6196 }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000049"), "purchase_data" : ISODate("2014-04-15T07:00:00Z"),
//       "line_items" : [ { "quantity" : 1 } ], "sub_total" : 4897 }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000051"), "purchase_data" : ISODate("2014-08-03T07:00:00Z"),
//       "line_items" : [ { "quantity" : 1 } ], "sub_total" : 4897 }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000052"), "purchase_data" : ISODate("2014-11-03T08:00:00Z"),
//       "line_items" : [ { "quantity" : 1 } ], "sub_total" : 4897 }
//
//    so the db.totals.find() will return:
//
//     { "_id" : "11-2014", "value" : { "order_total" : 4897, "items_total" : 1 } }
//     { "_id" : "4-2014", "value" : { "order_total" : 4897, "items_total" : 1 } }
//     { "_id" : "8-2014", "value" : { "order_total" : 11093, "items_total" : 4 } }
//
//     */
