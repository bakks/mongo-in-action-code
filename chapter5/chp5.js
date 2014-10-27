
// 5.1.1
product = db.products.findOne({'slug': 'wheel-barrow-9092'})
db.categories.findOne({'_id': product['main_cat_id']})
db.reviews.find({'product_id': product['_id']})

db.products.find({'slug': 'wheel-barrow-9092'}).limit(1)

db.reviews.find({'product_id': product['_id']}).skip(0).limit(12)

product  = db.products.findOne({'slug': 'wheel-barrow-9092'})
db.reviews.find({'product_id': product['_id']}).
                   sort({'helpful_votes': -1}).
                   limit(12)

page_number = 1
product  = db.products.findOne({'slug': 'wheel-barrow-9092'})
category = db.categories.findOne({'_id': product['main_cat_id']})
reviews_count = db.reviews.count({'product_id': product['_id']})
reviews = db.reviews.find({'product_id': product['_id']}).
                           skip((page_number - 1) * 12).
                           limit(12).
                           sort({'helpful_votes': -1})

page_number = 1
category = db.categories.findOne({'slug': 'outdoors'})
siblings = db.categories.find({'parent_id': category['_id']})
products = db.products.find({'category_id': category['_id']})
                           .skip((page_number - 1) * 12)
                           .limit(12)
                           .sort({'helpful_votes': -1})

categories = db.categories.find({'parent_id': null})

// 5.1.2
db.users.findOne({
    'username': 'kbanker',
    'hashed_password': 'bd1cfa194c3a603e7186780824b04419'})

db.users.findOne({
  'username': 'kbanker',
  'hashed_password': 'bd1cfa194c3a603e7186780824b04419'},
  {'_id': 1})

db.users.find({'last_name': 'Banker'})


db.users.find({'last_name': /^Ba/})

db.users.find({'addresses.zip': {'$gt': 10019, '$lt': 10040}})

// 5.2.1
db.users.find({'last_name': "Banker"})
db.users.find({'first_name': "Smith", birth_year: 1975})

// below will not work - though no errors are retured
db.users.find({'birth_year': {'$gte': 1985}, 'birth_year': {'$lte': 2015}})

// fixes previous query 
db.users.find({'birth_year': {'$gte': 1985, '$lte': 2015}})

// insert some test documents
db.items.insert({ "_id" : ObjectId("4caf82011b0978483ea29ada"), "value" : 97 })
db.items.insert({ "_id" : ObjectId("4caf82031b0978483ea29adb"), "value" : 98 })
db.items.insert({ "_id" : ObjectId("4caf82051b0978483ea29adc"), "value" : 99 })
db.items.insert({ "_id" : ObjectId("4caf820d1b0978483ea29ade"), "value" : "a" })
db.items.insert({ "_id" : ObjectId("4caf820f1b0978483ea29adf"), "value" : "b" })
db.items.insert({ "_id" : ObjectId("4caf82101b0978483ea29ae0"), "value" : "c" })

db.items.find({'value': {'$gte': 97}})

db.items.find({'value': {'$gte': "a"}})

db.products.find({
    'main_cat_id': { 
      '$in': [
        ObjectId("6a5b1476238d3b4dd5000048"),
        ObjectId("6a5b1476238d3b4dd5000051"),
        ObjectId("6a5b1476238d3b4dd5000057")
      ]
    }
  })

db.products.find({
    '$or': [
      {'details.color': 'blue'}, 
      {'details.manufacturer': 'ACME'}
    ]
  })

db.products.find({
    $and: [
      {
        tags: {$in: ['gift', 'holiday']}
      },
      {
        tags: {$in: ['gardening', 'landscaping']}
      }
    ]
  })

  
db.products.find({'details.color': {$exists: false}})

db.products.find({'details.color': {$exists: true}})

db.products.find({tags: "soil"})

db.products.ensureIndex({tags: 1})
db.products.find({tags: "soil"}).explain()

db.products.find({'tags.0': "soil"})
  
db.users.find({'addresses.0.state': "NY"})

db.users.find({'addresses.0.state': "NY"})

db.users.ensureIndex({'addresses.state': 1})

db.users.find({'addresses.name': 'home', 'addresses.state': 'NY'})

db.users.find({
    'addresses': {
      '$elemMatch': {
        'name': 'home', 
        'state': 'NY'
      }
    }
  })


db.users.find({'addresses': {$size: 3}})

db.reviews.find({
    '$where': "function() { return this.helpful_votes > 3; }"
  })

db.reviews.find({'$where': "this.helpful_votes > 3"})

db.reviews.find({
    'user_id': ObjectId("4c4b1476238d3b4dd5000001"),
    '$where': "(this.rating * .92) > 3"
  })

db.reviews.find({
    'user_id': ObjectId("4c4b1476238d3b4dd5000001"),
    'text': /best|worst/i
  })

db.reviews.find({
    'user_id': ObjectId("4c4b1476238d3b4dd5000001"),
    'text': {
      '$regex': "best|worst", 
      '$options': "i"}
  })

db.orders.find({subtotal: {$mod: [3, 0]}})

// 5.2.2
db.users.find({}, {'addresses': 0, 'payment_methods': 0})

db.products.find({}, {'reviews': {$slice: 12}})
db.products.find({}, {'reviews': {$slice: -5}})

db.products.find({}, {'reviews': {$slice: [24, 12]}})

db.products.find({}, {'reviews': {'$slice': [24, 12]}, 'reviews.rating': 1})

db.reviews.find({}).sort({'rating': -1})

db.reviews.find({}).sort({'helpful_votes':-1, 'rating': -1})

db.docs.find({}).skip(500000).limit(10).sort({date: -1})

previous_page_date = new Date(2013, 05, 05)
db.docs.find({'date': {'$gt': previous_page_date}}).limit(10).sort({'date': -1})













