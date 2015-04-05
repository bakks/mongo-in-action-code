
// ************* 7.4.1

// below SHOULD fail
db.products.update({}, {name: "Pitchfork", "$addToSet": {tags: 'cheap'}})

// correct version - though you'd never want to do this!
db.products.update({},
  {$set: {name: "Pitchfork"}, $addToSet: {tags: 'cheap'}})

// multiple document updates

db.products.update({}, {$addToSet: {tags: 'cheap'}}, {multi: true})

// to see results: 
db.products.find().pretty()

// upserts

db.products.update({slug: 'hammer'}, {$addToSet: {tags: 'cheap'}}, {upsert: true})

// to see results: 
db.products.find().pretty()


// **************** 7.4.2 update parameters

// $inc
db.products.update({slug: "shovel"}, {$inc: {review_count: 1}})
db.users.update({username: "moe"}, {$inc: {password_retires: -1}})

db.readings.update({_id: 324}, {$inc: {temp: 2.7435}})

db.readings.update({_id: 324}, {$inc: {temp: 2.7435}}, {upsert: true})

// see result
db.readings.findOne({_id: 324})

// $set and $unset
db.readings.update({_id: 324}, {$set: {temp: 97.6}})
db.readings.update({_id: 325}, {$set: {temp: {f: 212, c: 100}}})
db.readings.update({_id: 326}, {$set: {temps: [97.6, 98.4, 99.1]}})

db.readings.update({_id: 324}, {$unset: {temp: 1}})

// ***************** insert some test data ************** 
// rerun this to "reset" test data - useful between some calls
db.readings.remove({_id: 324})
db.readings.remove({_id: 325})
db.readings.remove({_id: 326})
db.readings.insert([{_id: 324, 'temp': 2.7435},
{_id: 325, 'temp': {f: 212, c: 100}},
{_id: 326, temps: [97.6, 98.4, 99.1]}])

// see results
 db.readings.find().pretty()
 
// examples of $unset and $pop
db.readings.update({_id: 325}, {$unset: {'temp.f': 1}})
db.readings.update({_id: 326}, {$pop: {temps: -1}})

// using $unset with arrays - sidebar
db.readings.update({_id: 325}, {$unset: {'temp.f': 1}})
db.readings.update({_id: 326}, {$unset: {'temps.0': 1}}) 

// $rename
db.readings.update({_id: 324}, {$rename: {'temp': 'temperature'}})
db.readings.update({_id: 325}, {$rename: {'temp.f': 'temp.fahrenheit'}})

// $setOnInsert
db.products.remove({slug: 'hammer'})
db.products.update({slug: 'hammer'}, {
    $inc: {
      qty: 1
    }, 
    $setOnInsert: {
      state: 'AVAILABLE'
    }
  }, {upsert: true})

// see result
db.products.findOne({slug: 'hammer'})


// ******* Array Update Parameters

// $push, $pushAll, and $each
db.products.insert({slug: 'shovel'})
db.products.update({slug: 'shovel'}, {$push: {tags: 'tools'}})

db.products.find({slug: 'shovel'}).pretty()

db.products.update({slug: 'shovel'},
  {$push: {tags: {$each: ['tools', 'dirt', 'garden']}}})

db.products.remove({slug: 'shovel'})
db.products.insert({slug: 'shovel'})

db.products.update({slug: 'shovel'},
  {$pushAll: {'tags': ['tools', 'dirt', 'garden']}})
  
// $slice
// Create document  Document
db.temps.remove({})
db.temps.insert(
{
  _id: 326, 
  temps: [92, 93, 94]
})

db.temps.find().pretty()

db.temps.update({_id: 326}, {
    $push: {
      temps: {
        $each: [95, 96],
        $slice: -4
      }
    }
  })
  
// get results
db.temps.find({_id: 326})

/* should look like this
{
  _id: 326, 
  temps: [93, 94, 95, 96]
}

*/

// $sort
db.temps.remove({_id: 300})
db.temps.insert(
{
  _id: 300,
  temps: [  
    { day: 6, temp: 90 },
    { day: 5, temp: 95 }
  ]
}
)

db.temps.update({_id: 300}, {
    $push: {
      temps: {
        $each: [
          { day: 7, temp: 92 }
        ],
        $slice: -2,
        $sort: {
          day: 1
        }
      }
    }
  })

// get results
db.temps.find({_id: 300})

/* should look like this
{
  _id: 300,
  temps: [  
    { day: 6, temp: 90 },
    { day: 7, temp: 92 }
  ]
}
*/

// $addToSet and $each
db.products.update({slug: 'shovel'}, {$addToSet: {'tags': 'tools'}})

db.products.update({slug: 'shovel'},
  {$addToSet: {tags: {$each: ['tools', 'dirt', 'steel']}}})

// $pop
db.products.update({slug: 'shovel'}, {$pop: {'tags': 1}})

db.products.update({slug: 'shovel'}, {$pop: {'tags': -1}})

db.products.find({slug: 'shovel'}).pretty()

// $bit
// add test example
db.permissions.remove({_id: 16,})
db.permissions.insert({
  _id: 16,
  permissions: NumberInt(4)
})

db.permissions.update({_id: 16}, {$bit: {permissions: {or: NumberInt(2)}}})

// get results
db.permissions.find({_id: 16})

/* should get:
{
  _id: 16,
  permissions: 6
}
*/

// $pull and $pullAll
db.products.update({slug: 'shovel'}, 
  {$pullAll: {'tags': ['dirt', 'garden']}})

// example data
db.readings.remove({_id: 326})
db.readings.insert({_id: 326, temps: [97.6, 98.4, 100.5, 99.1, 101.2]})

db.readings.update({_id: 326}, {$pull: {temps: {$gt: 100}}})

// get result
db.readings.find({_id: 326})

// should get   {_id: 326, temps: [97.6, 98.4, 99.1]}

// ************ positional updates

// insert example
db.orders.remove({_id: ObjectId("6a5b1476238d3b4dd5000048")})
db.orders.insert(
{ 
  _id: ObjectId("6a5b1476238d3b4dd5000048"),
  line_items: [
    { 
      _id: ObjectId("4c4b1476238d3b4dd5003981"),
      sku: "9092",
      name: "Extra Large Wheel Barrow",
      quantity: 1,
      pricing: {
        retail: 5897,
        sale: 4897
      }
    },
    { 
      _id: ObjectId("4c4b1476238d3b4dd5003981"),
      sku: "10027",
      name: "Rubberized Work Glove, Black",
      quantity: 2,
      pricing: {
        retail: 1499,
        sale: 1299
      }
    }
  ]
}
)

// find it
db.orders.find(query).pretty()

// example
query  = {
  _id: ObjectId("6a5b1476238d3b4dd5000048"),
  'line_items.sku': "10027"
}
update = {
  $set: {
    'line_items.$.quantity': 5
  }
}
db.orders.update(query, update)

// get result
db.orders.find({_id: ObjectId("6a5b1476238d3b4dd5000048")}).pretty()

// ********************* 7.4.3   Find and Modify

doc = db.orders.findAndModify({
     query: {
       user_id: ObjectId("6a5b1476238d3b4dd5000048"),
     },
     update: {
       $set: {
         state: "AUTHORIZING"
       }
     }
   })

// ************** 7.4.4  Deletes

db.reviews.remove({user_id: ObjectId('4c4b1476238d3b4dd5000001')})

db.reviews.remove({})


// ************************* 7.4.5 concurrency and isolation

db.reviews.remove({user_id: ObjectId('4c4b1476238d3b4dd5000001'),
  $isolated: true})
  
db.reviews.update({$isolated: true}, {$set: {rating: 0}}, {multi: true})



// ***********************  7.4.6 Update Performance
db.tweets.stats()

// or more realistic
db.orders.stats()






