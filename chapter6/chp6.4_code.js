
// 6.4 reshaping documents
db.users.aggregate([
    {$match: {username: 'kbanker'}},
    {$project: {name: {first:'$first_name',
                       last:'$last_name'}}
    }
]);

//    /* should return
//
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
//       "name" : { "first" : "Kyle", "last" : "Banker" } }
//
//     */


// 6.4.1 String functions
db.users.aggregate([
    {$match: {username: 'kbanker'}},
    {$project:
    {name: {$concat:['$first_name', ' ', '$last_name']},    // 1
        firstInitial: {$substr: ['$first_name',0,1]},          // 2
        usernameUpperCase: {$toUpper: '$username'}             // 3
    }
    }
]);

//    /*  Expected results
//
//     { "_id" : ObjectId("4c4b1476238d3b4dd5000001"),
//       "name" : "Kyle Banker",
//       "firstInitial" : "K",
//       "usernameUpperCase" : "KBANKER" }
//
//
//     */

// 6.4.2 Arithmetic functions
// na

// 6.4.3 date functions
// na

// 6.4.4 Logical functions
// na

// 6.4.5 Set functions
// na

// 6.4.6  Misc. functions
// na
