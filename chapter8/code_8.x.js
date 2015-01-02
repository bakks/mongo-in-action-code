
//*****************************  8.1.2   Core Indexing Concepts

db.products.find({
    'details.manufacturer': 'Acme',
    'pricing.sale': {
      $lt: 7500
    }
  })

//*****************************  8.2.1  Index Types

//****** add index for unique on user name  
db.users.ensureIndex({username: 1}, {unique: true})

// test index
db.users.insert({username: "kbanker"})

//******   drop dups example index

// first drop previous index
db.users.dropIndex({username: 1})

// can also use following to get index name and drop by name
db.users.getIndexes()
db.users.dropIndex("username_1")

// add a duplicate username and show the two users with username "kbanker"
db.users.insert({username: "kbanker"})
db.users.find({username: "kbanker"}).pretty()

// now add the drop dups example
db.users.ensureIndex({username: 1}, {unique: true, dropDups: true})

// see which duplicate user was dropped
db.users.find({username: "kbanker"}).pretty()

// drop the index
db.users.dropIndex("username_1")

//******* sparse indexes
// create two products with only a name
db.products.insert([{name: "test 1"},{name: "test 2"}])

// find products with null category (should be only the two just inserted)
db.products.find({category_ids: null})

// try adding an index on sku WITHOUT making it sparse - should fail 
db.products.ensureIndex({sku: 1}, {unique: true})

// now add the sparse index - should work
db.products.ensureIndex({sku: 1}, {unique: true, sparse: true})

// drop the index
db.products.dropIndex("sku_1")

// also remove the two products just added
db.products.remove({sku: null})

// user_id in review example. 
// NOTE: do NOT want unique or else a user would only be able to do one review on any product
db.reviews.ensureIndex({user_id: 1}, {sparse:  true, unique: false})

// another helpful way to find ALL indexes for a database
db.system.indexes.find()

// now drop the one just created
db.reviews.dropIndex("user_id_1")

//******* hashed indexes
db.products.findOne({name: "Extra Large Wheel Barrow"})

db.recipes.ensureIndex({recipe_name: 'hashed'})


//*****************************  8.2.2  Index Administration


// *** create the index on green.user
use green
spec = {ns: "green.users", key: {'addresses.zip': 1}, name: 'zip'}
db.system.indexes.insert(spec, true)

// *** delete an index using the rundCommand
db.runCommand({deleteIndexes: "users", index: "zip"})

// *** Now create one
db.users.ensureIndex({zip: 1})

// *** and see the results
db.users.getIndexes()

// *** drop the index use green
db.users.dropIndex("zip_1")

// *********************** building indexes
db.values.ensureIndex({open: 1, close: 1})

// *** won't show anything since we're not running a long running index build
db.currentOp()

// ********************** background indexing
// drop the previous version of the index first
db.values.dropIndex({open:1,close:1})

// now the background index
db.values.ensureIndex({open: 1, close: 1}, {background: true})

// *********************** defragmenting
db.values.reIndex();


//*****************************  8.3.1  Identifying Slow Queries

// download from http://mng.bz/ii49
mongorestore  -d stocks dump/stocks

/*  might see at the start...
2015-01-02T11:41:54.221-0800 dump/stocks/values.bson
2015-01-02T11:41:54.221-0800    going into namespace [stocks.values]
2015-01-02T11:41:54.222-0800 dump/stocks/values.metadata.json not found. Skipping.
*/
// followed by ...
/* .. at the end 
4308303 objects found
2015-01-02T11:44:47.328-0800 dump/stocks/system.indexes.bson
2015-01-02T11:44:47.329-0800    going into namespace [stocks.system.indexes]
Restoring to stocks.system.indexes without dropping. Restored data will be inserted without raising errors; check your server log
2015-01-02T11:44:47.992-0800    Creating index: { name: "_id_", ns: "stocks.values", key: { _id: 1 } }
1 objects found
*/

//****  Log running query
Use stocks 
db.values.find({"stock_symbol": "GOOG"}).sort({date: -1}).limit(1)

// log location may vary. On Ubuntu Server: /var/log/mongodb/mongod.log
grep -E '([0-9])+ms' mongod.log 
grep -E '[0-9]+ms' mongod.log 

//*** Using Profiler
db.setProfilingLevel(2)

db.setProfilingLevel(1, 50)

db.values.find({}).sort({close: -1}).limit(1)

//**** Profiling Results

db.system.profile.find({millis: {$gt: 150}})

db.system.profile.find().sort({$natural: -1}).limit(5).pretty() 

//**** Using and understanding Explain

db.values.find({}).sort({close: -1}).limit(1).explain()

db.values.count()

//**** Adding an index
db.values.ensureIndex({close: 1})

db.values.find({}).sort({close: -1}).limit(1).explain()

/* **** AFTER index
{
        "cursor" : "BtreeCursor close_1 reverse",
        "isMultiKey" : false,
        "n" : 1,
        "nscannedObjects" : 1,
        "nscanned" : 1,
        "nscannedObjectsAllPlans" : 1,
        "nscannedAllPlans" : 1,
        "scanAndOrder" : false,
        "indexOnly" : false,
        "nYields" : 0,
        "nChunkSkips" : 0,
        "millis" : 18,
        "indexBounds" : {
                "close" : [
                        [
                                {
                                        "$maxElement" : 1
                                },
                                {
                                        "$minElement" : 1
                                }
                        ]
                ]
        },
        "server" : "localhost:27017",
        "filterSet" : false
}
*/

//**** Using an indexed key
db.values.find({close: {$gt: 500}}).explain()

//**** MongoDB query optimizer and hint()
db.values.find({stock_symbol: "GOOG", close: {$gt: 200}})
db.values.find({stock_symbol: "GOOG", close: {$gt: 200}}).explain()

// now add index
db.values.ensureIndex({stock_symbol: 1, close: 1})
db.values.find({stock_symbol: "GOOG", close: {$gt: 200}}).explain()

db.values.getIndexKeys()

// showing query plans
db.values.dropIndex("stock_symbol_1_close_1")
db.values.ensureIndex({stock_symbol: 1})
db.values.ensureIndex({close: 1})

db.values.find({stock_symbol: "GOOG", close: {$gt: 200}}).explain(true)

query  = {stock_symbol: "GOOG", close: {$gt: 200}}
db.values.find(query).hint({close: 1}).explain()


//*****************************  8.3.3  Query Patterna

//**** Single key indexes
db.values.find({close: 100})
db.values.find({}).sort({close: 1})
db.values.find({close: {$gte: 100}})

db.values.find({close: {$gte: 100}}).sort({close: 1}).explain()

//**** multikey index

// to be sure, you can create a new index and drop others
db.values.ensureIndex({close: 1, open: 1, date: 1})

db.values.dropIndex("date_1")
db.values.dropIndex("stock_symbol_1")
db.values.dropIndex("close_1")
db.values.getIndexes()


db.values.find({}).sort({close: 1})
db.values.find({close: {$gt: 1}})
db.values.find({close: 100}).sort({open: 1})
db.values.find({close: 100, open: {$gt: 1}})
db.values.find({close: 1, open: 1.01, date: {$gt: "2005-01-01"}})
db.values.find({close: 1, open: 1.01}).sort({date: 1})

// or add explain to verify index is used - 
// WARNING - may take a while to run some of these
db.values.find({}).sort({close: 1}).explain()
db.values.find({close: {$gt: 1}}).explain()
db.values.find({close: 100}).sort({open: 1}).explain()
db.values.find({close: 100, open: {$gt: 1}}).explain()
db.values.find({close: 1, open: 1.01, date: {$gt: "2005-01-01"}}).explain()
db.values.find({close: 1, open: 1.01}).sort({date: 1}).explain()

//**** Covering indexes
db.ensureIndex({close: 1, open:1, date: 1})
db.values.find({close: 1}, {open: 1, close: 1, date: 1, _id: 0}).explain()

