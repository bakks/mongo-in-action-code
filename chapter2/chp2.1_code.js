// example 2.1.2
use tutorial

// ******************  2.1.3 inserts and queries ******************************
db.users.insert({username: "smith"})

db.users.find()

/* results like:  (_id will vary)

{ _id : ObjectId("4bf9bec50e32f82523389314"), username : "smith" }

*/

db.users.insert({username: "jones"})

db.users.count()

db.users.find()

/* results like: (_id will vary)

{ _id : ObjectId("4bf9bec50e32f82523389314"), username : "smith" }
{ _id : ObjectId("4bf9bec90e32f82523389315"), username : "jones" }

*/

db.users.find({username: "jones"})

/* results like: 
{ _id : ObjectId("4bf9bec90e32f82523389315"), username : "jones" }
*/


// $or find
db.users.find({ $or: [
  { username: "smith" },
  { username: "jones" }
]})

/* results like: 
{ _id : ObjectId("4bf9bec50e32f82523389314"), username : "smith" }
{ _id : ObjectId("4bf9bec90e32f82523389315"), username : "jones" }
*/


// *********************** 2.1.4 updates **************************************
db.users.find({username: "smith"})
/* result like:
{ 
  "_id" : ObjectId("4bf9ec440e32f82523389316"),
  "username" : "smith"
}

*/

// update
db.users.update({username: "smith"}, {$set: {country: "Canada"}})

db.users.find({username: "smith"})

/* results like: 
{ 
  "_id" : ObjectId("4bf9ec440e32f82523389316"),
  "country" : "Canada", 
  "username" : "smith"
}

*/

// update that removes username - mistaken way to do it
db.users.update({username: "smith"}, {country: "Canada"})

// now have wiped out username
db.users.find({country: "Canada"})

/* results like
{ 
  "_id" : ObjectId("4bf9ec440e32f82523389316"),
  "country" : "Canada"
}

*/

// set username back to smith
db.users.update({country: "Canada"}, {username: "smith", country: "Canada"})

// remove country via $unset
db.users.update({username: "smith"}, {$unset: {country: 1}})

db.users.find({username: "smith"})


// set favorites for smith
db.users.update( {username: "smith"},
  { 
    $set: {
      favorites: {
        cities: ["Chicago", "Cheyenne"],
        movies: ["Casablanca", "For a Few Dollars More", "The Sting"]
     }
    }
  })
  
// set favorites for jones
db.users.update( {username: "jones"},
  {
    $set: {
      favorites: {
        movies: ["Casablanca", "Rocky"]
      }
    }
  })

// verify update results
db.users.find().pretty()  // used pretty to make more readable

//find users with favorite movie of "Casablanca"
db.users.find({"favorites.movies": "Casablanca"}).pretty()

// $addToSet
db.users.update( {"favorites.movies": "Casablanca"},
    {$addToSet: {"favorites.movies": "The Maltese Falcon"} },
          false,   // insert if not found?
          true )   // update all found? (if false, updates just first it finds)
          
// ****** 2.1.5 deleting data ********************
db.foo.remove({})

// remove users with favorite city of Cheyenne 
db.users.remove({"favorites.cities": "Cheyenne"})


// get rid of users table
db.users.drop()


// *************** 2.1.6 - other commands *****************************

// MongoDB console help
help

// BEFORE running  MongoDB console 
// Help on running mongo command
mongo --help


// create large collection

for(i = 0; i < 200000; i++) {
    db.numbers.save({num: i});
  }

// verify results
db.numbers.count()

db.numbers.find()

db.numbers.find({num: 500})

// range query
db.numbers.find( {num: {"$gt": 199995 }} )

/* results like 

{ "_id" : ObjectId("4bfbf1dedba1aa7c30afcade"), "num" : 199996 }
{ "_id" : ObjectId("4bfbf1dedba1aa7c30afcadf"), "num" : 199997 }
{ "_id" : ObjectId("4bfbf1dedba1aa7c30afcae0"), "num" : 199998 }

*/

// upper and lower bounds
db.numbers.find( {num: {"$gt": 20, "$lt": 25 }} )

/* results like:
{ "_id" : ObjectId("4bfbf132dba1aa7c30ac831f"), "num" : 21 }
{ "_id" : ObjectId("4bfbf132dba1aa7c30ac8320"), "num" : 22 }
{ "_id" : ObjectId("4bfbf132dba1aa7c30ac8321"), "num" : 23 }
{ "_id" : ObjectId("4bfbf132dba1aa7c30ac8322"), "num" : 24 }

*/
