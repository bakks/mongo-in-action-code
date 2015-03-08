
// F.2 Arithmetic

kbankerOrders = {user_id: ObjectId('4c4b1476238d3b4dd5000001')};

selectedFields =
{product: '$line_items.name',                 // 1
    orderQuantity: '$line_items.quantity',       // 2
    retailPrice: '$line_items.pricing.retail',
    salePrice: '$line_items.pricing.sale',
    savings: {                                   // 3
        $subtract: ['$line_items.pricing.retail',
            '$line_items.pricing.sale']}};

db.orders.aggregate([
    {$match: kbankerOrders},
    {$unwind: '$line_items'},
    {$project: selectedFields}
])

//    /* expected results
//
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "product" : "Extra Large Wheel Barrow", "orderQuantity" : 1,
//     "retailPrice" : 5897, "salePrice" : 4897, "savings" : 1000 }
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "product" : "Rubberized Work Glove, Black", "orderQuantity" : 2,
//     "retailPrice" : 1499, "salePrice" : 1299, "savings" : 200 }
//
//
//     */

// Additional example

selectedFieldsPart2 =
{product: 1, orderQuantity: 1,                            // 1
    retailPrice: 1, salePrice: 1, savings: 1,
    totalSavings: {$multiply:['$orderQuantity','$savings']}, // 2
    percentSavings: {$multiply:
        [100, {$divide: ['$savings', '$retailPrice']}]}   //3
};

db.orders.aggregate([
    {$match: kbankerOrders},
    {$unwind: '$line_items'},       // 1
    {$project: selectedFields},
    {$project: selectedFieldsPart2}
])


//    /* expected results
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "product" : "Extra Large Wheel Barrow", "orderQuantity" : 1,
//     "retailPrice" : 5897, "salePrice" : 4897,
//     "savings" : 1000, "totalSavings" : 1000,
//     "percentSavings" : 16.957775139901646 }
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "product" : "Rubberized Work Glove, Black", "orderQuantity" : 2,
//     "retailPrice" : 1499, "salePrice" : 1299,
//     "savings" : 200, "totalSavings" : 400,
//     "percentSavings" : 13.342228152101402 }
//
//
//     */
