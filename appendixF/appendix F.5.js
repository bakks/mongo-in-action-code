
// F.5 - Set functions

testSet1 = ['gardening']
db.products.aggregate([
    {$project:
    {productName: '$name',
        tags:1,
        setEquals: {$setEquals:['$tags',testSet1]},
        setIntersection: {$setIntersection:['$tags',testSet1]},
        setDifference: {$setDifference:['$tags',testSet1]},
        setUnion: {$setUnion:['$tags',testSet1]},
        setIsSubset: {$setIsSubset:['$tags',testSet1]},
        setIntersection: {$setIntersection:['$tags',testSet1]}
    }
    }
])

//    /*  Expected results of
//     > db.setOperatorsTest.find().pretty()
//
//     {
//     "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
//     "productName" : "Extra Large Wheel Barrow",
//     "tags" : ["tools", "gardening", "soil"],
//     "setEquals" : false,
//     "setIntersection" : ["gardening"],
//     "setDifference" : ["tools","soil"],
//     "setUnion" : ["gardening","tools","soil"],
//     "setIsSubset" : false
//     }
//
//     {
//     "_id" : ObjectId("4c4b1476238d3b4dd5003982"),
//     "productName" : "Rubberized Work Glove, Black",
//     "tags" : ["gardening"],
//     "setEquals" : true,
//     "setIntersection" : ["gardening"],
//     "setDifference" : [ ],
//     "setUnion" : ["gardening"],
//     "setIsSubset" : true
//     }
//
//     */