
// **************************** 7.3.1  *******************8

newDoc = db.orders.findAndModify({
     query: {
       user_id: ObjectId("4c4b1476238d3b4dd5000001"),
       state: 'CART'
     },
     update: {
       $set: {
         state: 'PRE-AUTHORIZE'
       }
     },
     'new': true
   })

/*  returns: 

{
        "_id" : ObjectId("6a5b1476238d3b4dd5000048"),
        "user_id" : ObjectId("4c4b1476238d3b4dd5000001"),
        "purchase_data" : ISODate("2014-08-01T07:00:00Z"),
        "state" : "PRE-AUTHORIZE",
        "line_items" : [
                {
                        "_id" : ObjectId("4c4b1476238d3b4dd5003981"),
                        "sku" : "9092",
                        "name" : "Extra Large Wheel Barrow",
                        "quantity" : 2,
                        "pricing" : {
                                "retail" : 5897,
                                "sale" : 4897
                        }
                },
                {
                        "_id" : ObjectId("4c4b1476238d3b4dd5003982"),
                        "sku" : "10027",
                        "name" : "Rubberized Work Glove, Black",
                        "quantity" : 1,
                        "pricing" : {
                                "retail" : 1499,
                                "sale" : 1299
                        }
                }
        ],
        "shipping_address" : {
                "street" : "588 5th Street",
                "city" : "Brooklyn",
                "state" : "NY",
                "zip" : 11215
        },
        "sub_total" : 6196,
        "tax" : 600
}
*/

// mimic calculating order total and setting order total to 99000
// not shown in book
query = {
       user_id: ObjectId("4c4b1476238d3b4dd5000001"),
       state: "PRE-AUTHORIZE"
     }
update = {"$set" : {total: 99000}}
db.orders.update(query,update)

// now set state to AUTHORIZING only if the order total has not changed
oldDoc = db.orders.findAndModify({
     query: {
       user_id: ObjectId("4c4b1476238d3b4dd5000001"),
       total: 99000,
       state: "PRE-AUTHORIZE"
     },
     update: {
       '$set': {
         state: "AUTHORIZING"
       }
     }
   })

// and finally pre-shipping
auth_doc = {
   ts: new Date(),
   cc: 3432003948293040, 
   id: 2923838291029384483949348,
   gateway: "Authorize.net"
 }
 db.orders.findAndModify({
     query: {
       user_id: ObjectId("4c4b1476238d3b4dd5000001"),
       state: "AUTHORIZING"
     },
     update: {
       $set: {
         state: "PRE-SHIPPING",
         authorization: auth_doc
       }
     }
   })
   
// check the results - get the new order
query = {
       user_id: ObjectId("4c4b1476238d3b4dd5000001"),
       state: "PRE-SHIPPING"
     }
     
db.orders.find(query).pretty()


       
       
