
// F.6 Misc

// $size
db.products.aggregate([
    {$project:
    {_id: 0,
        productName: '$name',
        tags:1,
        tagCount: {$size:'$tags'}}
    }
])

//    /*  Expected results
//
//     { "productName" : "Extra Large Wheel Barrow",
//     "tags" : [ "tools", "gardening", "soil" ],
//     "tagCount" : 3 }
//
//     { "productName" : "Rubberized Work Glove, Black",
//     "tags" : [ "gardening" ],
//     "tagCount" : 1 }
//
//     */

// $literal
// suppose we want to create field called useCount and set this to 0
db.categories.aggregate([
    {$project: {categoryName: '$name',
        useCount: 0
    }
    },
    {$out: 'categoryUseCount'}
])




//    /*  results:
//
//     assert: command failed: {
//     "errmsg" : "exception: The top-level _id field is the only field currently supported for exclusion",
//     "code" : 16406,
//     "ok" : 0
//     } : aggregate failed
//
//     Huh? What's up with that?
//
//     What's up is that MongoDB thinks that we are trying to exclude a field named 'useCount',
//     and is telling us that we are only allowed to exclude the field '_id'.
//
//     $literal to the rescue.
//
//     */

db.categories.aggregate([
    {$project:
    {_id: 0,
        categoryName: '$name',
        useCount: {$literal: 0}}   //1
    },
    {$out: 'categoryUseCount'}
])

//    /*  expected results
//
//     { "categoryName" : "Gardening Tools", "useCount" : 0 }
//
//
//     /*  what if
//
//     db.categories.aggregate([
//     {$project:
//     {categoryName: '$name',
//     useCount: -2 }          //1
//     },
//     {$out: 'categoryUseCount'}
//
//     ])
//
//     db.categories.aggregate([
//     {$project:
//     {categoryName: '$name',
//     name: 0 }          //1
//     },
//     {$out: 'categoryUseCount'}
//     ])
//
//
//     */

db.categories.aggregate([
    {$project: {
        someNumber: 3}
    }
]);

db.categories.aggregate([
    {$project: {
        someNumber: {$literal: 3}}
    }
]);

// error

db.categories.aggregate([
    {$project: {
        dollarSign: '$'}
    }
]);

// correct
db.categories.aggregate([
    {$project: {
        dollarSign: {$literal: '$'}}
    }
]);

//    /*  results
//
//     assert: command failed: {
//     "errmsg" : "exception: '$' by itself is not a valid FieldPath",
//     "code" : 16872,
//     "ok" : 0
//     } : aggregate failed
//
//     */

db.categories.aggregate([
    {$project:
    {catgyName: '$name',
        someNumber: {$literal: 3},
        dollarSign: {$literal:'$'}}
    }
]);

//    /*
//     { "catgyName" : "Gardening Tools", "userCount" : 0, "numberOne" : 1, "dollarSign" : "$" }
//
//     trying NumberOne: 1 is especially confusing. It won't cause an error, but the field won't appear.
//     Similarly, having a $something will not return an error.
//
//     */

db.categories.aggregate([
    {$project: {_id: 0,
        catgyName: '$name',
        numberOne: 1,
        dollarSign: '$something'
    }
    }
]);

//    /* returns - missing fields for numberOne and dollarSign
//
//     { "catgyName" : "Gardening Tools" }
//
//
//     */

// ******************* $map

//    /*
//
//     { skews: [ 1, 1, 2, 3, 5, 8 ] }
//
//     And the following $project statement:
//
//     { $project: { adjustments: { $map: { input: "$skews",
//     as: "adj",
//     in: { $add: [ "$$adj", 12 ] } } } } }
//
//     The $map would transform the input document into the following output document:
//
//     { adjustments: [ 13, 13, 14, 15, 17, 20 ] }
//
//     you've seen how to convert the create a line item summary from the order quantity and item name
//     in the descriptions for $let and $substring, let's see one more version. In this case we're going to
//     retrieve a single order and then convert the array of order line items to a summary array without using the $unwind.
//
//
//
//     */


db.orders.aggregate([
    {$project: {
        orderSummary: {
            $map: {
                input: '$line_items',
                as: 'item',
                in: {
                    $concat: [
                        {$substr:['$$item.quantity',0,10]},
                        ' ', '$$item.name']
                }
            }
        }}
    }
]).pretty()

db.orders.aggregate([
    {$project: {
        orderSummary: {
            $map: {
                input: '$line_items',
                as: 'item',
                in: {
                    descr: {$concat: [
                        {$substr:['$$item.quantity',0,10]},
                        ' ', '$$item.name']},
                    price: '$$item.pricing.sale'
                }
            }
        }}
    }
]).pretty()


// ******************* $let

//    /* Earlier, in the section String Function - $substr,
//     we showed a pipeline that converted a number to a string.
//     We broke this up into two $project operators to make the example
//     more understandable. However we can so something similar,
//     define complex intermediate results, using the $let function.
//
//
//     */

db.orders.aggregate([
    {$unwind: '$line_items'},
    {$project: {
        orderSummary: {
            $let: {
                vars: {
                    orderQuantity:                                 //1
                    {$substr:['$line_items.quantity',0,10]}
                },
                in: {                                              //2
                    $concat: ['$$orderQuantity', ' ',
                        '$line_items.name']
                }
            }
        }
    }}
])


//    /* expected results
//
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderSummary" : "1 Extra Large Wheel Barrow" }
//     { "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
//     "orderSummary" : "2 Rubberized Work Glove, Black" }
//
//     */
