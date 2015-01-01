
// *********************  7.2.1 Products and categories

// update review ratings

product_id = ObjectId("4c4b1476238d3b4dd5003982")
count = 0
total = 0
db.reviews.find({product_id: product_id}, {rating: 1}).forEach(
  function(review) {
    total += review.rating
    count++
  })
average = total / count
db.products.update({_id: product_id}, 
  {$set: {total_reviews: count, average_review: average}}) 
  
// result: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// check result
db.products.findOne({_id: product_id},{total_reviews:1,average_review:1})

/* result
{
        "_id" : ObjectId("4c4b1476238d3b4dd5003982"),
        "total_reviews" : 2,
        "average_review" : 3.5
}
*/

product_id = ObjectId("4c4b1476238d3b4dd5003982")
average = 3.5
total = 7

db.products.update({_id: product_id},
  {
    $set: {
      average_review: average,
      ratings_total: total
    },
    $inc: {
      total_reviews: 1
    }
  })

// result: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// read result
db.products.findOne({_id: product_id},{total_reviews:1,ratings_total:1,average_review:1})

/*  Results (total_reviews value may vary)
{
        "_id" : ObjectId("4c4b1476238d3b4dd5003982"),
        "total_reviews" : 3,
        "average_review" : 3.5,
        "ratings_total" : 7
}
*/

// category hierarchy
var generate_ancestors = function(_id, parent_id) {
  ancestor_list = []
  var cursor = db.categories.find({_id: parent_id})
  while(cursor.size() > 0) {
    parent = cursor.next()
    ancestor_list.push(parent)
    parent_id = parent.parent_id
    cursor = db.categories.find({_id: parent_id})
  }
  db.categories.update({_id: _id}, {$set: {ancestors: ancestor_list}})
}

// below will not run without defining a parent_id
// need other data not currently in db to support this
category = {
  parent_id: parent_id,
  slug: "gardening",
  name: "Gardening",
  description: "All gardening implements, tools, seeds, and soil."
}
db.categories.save(category)
generate_ancestors(category._id, parent_id)

// again, need an outdoors_id and more data
db.categories.update({_id: outdoors_id}, {$set: {parent_id: gardening_id}})

db.categories.find({'ancestors.id': outdoors_id}).forEach(
  function(category) {
    generate_ancestors(category._id, outdoors_id)
  })

// ***** multi update option - use a fake outdoors_id to test syntax
outdoors_id = ObjectId("4c4b1476238d3b4dd5003982")
doc = db.categories.findOne({_id: outdoors_id})
doc.name = "The Great Outdoors"
db.categories.update({_id: outdoors_id}, doc)
db.categories.update(
  {'ancestors._id': outdoors_id},
  {$set: {'ancestors.$': doc}},
  {multi: true})

  
// *** another update using the '$' operator
db.users.update({
      _id: ObjectId("4c4b1476238d3b4dd5003981"),
      'addresses.name': 'work'},
      {$set: {'addresses.$.street': '155 E 31st St.'}})

// results: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// ***************** 7.2.2 Reviews

db.reviews.update({_id: ObjectId("4c4b1476238d3b4dd5000041")}, {
    $push: {
      voter_ids: ObjectId("4c4b1476238d3b4dd5000001")
    },
    $inc: {
      helpful_votes: 1
    }
  })

// results: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })

// **** better way to do update
query_selector = {
  _id: ObjectId("4c4b1476238d3b4dd5000041"),
  voter_ids: {
    $ne: ObjectId("4c4b1476238d3b4dd5000001")
  }
}

db.reviews.update(query_selector, {
    $push: {
      voter_ids: ObjectId("4c4b1476238d3b4dd5000001")
    },
    $inc : {
      helpful_votes: 1
    }
  })

// results: WriteResult({ "nMatched" : 0, "nUpserted" : 0, "nModified" : 0 })
// (because we did already add the vote)

// ***************** 7.2.3 Orders

cart_item = {
  _id:  ObjectId("4c4b1476238d3b4dd5003981"),
  slug: "wheel-barrow-9092",
  sku:  "9092",
  name: "Extra Large Wheel Barrow",
  pricing: {
    retail: 5897,
    sale:   4897
  }
}

selector = {
  user_id: ObjectId("4c4b1476238d3b4dd5000001"),
  state: 'CART'
}

update = {
  $inc: {
    sub_total: cart_item['pricing']['sale']  
  }
}

db.orders.update(selector, update, {upsert: true}) 

// find the order - use find(...) to verify there is only one
db.orders.find(selector).pretty()


// add item if it doesn't exist
selector = {user_id: ObjectId("4c4b1476238d3b4dd5000001"),
    state: 'CART',
    'line_items._id':
        {'$ne': cart_item._id}
    }
    
update = {'$push': {'line_items': cart_item}}
db.orders.update(selector, update)

// increment the line item count (already updated order sub_total
selector = {
  user_id: ObjectId("4c4b1476238d3b4dd5000001"),
  state: 'CART',
  'line_items._id': ObjectId("4c4b1476238d3b4dd5003981")
}
update = {
  $inc: {
    'line_items.$.quantity': 1 
  }
}
db.orders.update(selector, update)

// find the order again
selector = {
  user_id: ObjectId("4c4b1476238d3b4dd5000001"),
  state: 'CART'
}
db.orders.find(selector).pretty()


