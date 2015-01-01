// 7.1

// Modify with replacement

// **************  insert data
db.users.insert(
    {  _id: ObjectId("4c4b1476238d3b4dd5003981"),
      username: "kbanker",
      email: "kylebanker@gmail.com",
      first_name: "Kyle",
      last_name: "Banker",
      hashed_password: "bd1cfa194c3a603e7186780824b04419",
      addresses: [
        {
          name: "work",
          street: "1 E. 23rd Street",
          city: "New York",
          state: "NY",
          zip: 10010
        }
      ]
    }
)

// ******* Update email address

user_id = ObjectId("4c4b1476238d3b4dd5003981")
doc = db.users.findOne({_id: user_id})
doc['email'] = 'mongodb-user@mongodb.com'
print('updating ' + user_id)
db.users.update({_id: user_id}, doc)

/* Result
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
*/

// check update
db.users.findOne({_id: ObjectId("4c4b1476238d3b4dd5003981")})

/* result

> db.users.findOne({_id: ObjectId("4c4b1476238d3b4dd5003981")})
{
        "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
        "username" : "kbanker",
        "email" : "mongodb-user@mongodb.com",
        "first_name" : "Kyle",
        "last_name" : "Banker",
        "hashed_password" : "bd1cfa194c3a603e7186780824b04419",
        "addresses" : [
                {
                        "name" : "work",
                        "street" : "1 E. 23rd Street",
                        "city" : "New York",
                        "state" : "NY",
                        "zip" : 10010
                }
        ]
}

*/

// ******************** update by operator
user_id = ObjectId("4c4b1476238d3b4dd5003981")
db.users.update({_id: user_id}, 
  {$set: {email: 'mongodb-user2@mongodb.com'}})
  
/* result 
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
*/

// check update
db.users.findOne({_id: ObjectId("4c4b1476238d3b4dd5003981")},{email:1})

/* result
{
        "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
        "email" : "mongodb-user2@mongodb.com"
}
*/

// ************  from sidebar on syntax: updates vs. queries

db.products.update({}, {$addToSet: {tags: 'green'}})

db.products.update({price: {$lte: 10}}, 
   {$addToSet: {tags: 'cheap'}})


// ******* both methods compared
product_id = ObjectId("4c4b1476238d3b4dd5003982")
doc = db.products.findOne({_id: product_id})
doc['total_reviews'] += 1       // add 1 to the value in total_reviews
db.products.update({_id: product_id}, doc)

/* result
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
*/

// check results
db.products.findOne({_id: product_id},{total_reviews:1})

// now use increment instead of program update
product_id = ObjectId("4c4b1476238d3b4dd5003982")
db.products.update({_id: product_id}, {$inc: {total_reviews: 1}})

// result: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// check results
db.products.findOne({_id: product_id},{total_reviews:1})
