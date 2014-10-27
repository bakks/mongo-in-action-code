
// *********** 2.2.2 Indexing and Explain ****************************8
db.numbers.find({num: {"$gt": 199995}}).explain()

/*  results like: 
{                                          
  "cursor" : "BasicCursor",          
  "isMultiKey" : false,              
  "n" : 4,                      // result documents returned      
  "nscannedObjects" : 200000,        
  "nscanned" : 200000,               
  "nscannedObjectsAllPlans" : 200000,
  "nscannedAllPlans" : 200000,       
  "scanAndOrder" : false,            
  "indexOnly" : false,               
  "nYields" : 0,                     
  "nChunkSkips" : 0,                 
  "millis" : 171,               // time the query took      
  "indexBounds" : { },                                 
  "server" : "hostname:27017"    
}
*/

// create index
db.numbers.ensureIndex({num: 1})

// verify index
db.numbers.getIndexes()

// explain for indexed collection
db.numbers.find({num: {"$gt": 199995 }}).explain()

/* results like: 

{                                                      
  "cursor" : "BtreeCursor num_1",   #A// using the num_1 index             
  "isMultiKey" : false,                          
  "n" : 4,                          #B// 4 documents returned             
  "nscannedObjects" : 4,                         
  "nscanned" : 4,                   #C// only 4 documents scanned                          
  "nscannedObjectsAllPlans" : 4,                 
  "nscannedAllPlans" : 4,                        
  "scanAndOrder" : false,                        
  "indexOnly" : false,                           
  "nYields" : 0,                                 
  "nChunkSkips" : 0,                             
  "millis" : 0,                     #D// much faster!             
  "indexBounds" : {                              
    "num" : [                              
      [                              
        199995,                
        1.7976931348623157e+308
      ]                              
    ]                                      
  },                                             
  "server" : "hostname:27017"                
}

*/

// ***************** 2.3.1 getting db info *****************************

// show databases
show dbs

// show collections in current database
show collections

// db details
db.stats()

/* results like: 
{                                           
  "db" : "tutorial",                      
  "collections" : 4,                  
  "objects" : 200010,                 
  "avgObjSize" : 36.00065996700165,   
  "dataSize" : 7200492,               
  "storageSize" : 11268096,           
  "numExtents" : 10,                  
  "indexes" : 3,                      
  "indexSize" : 11560864,             
  "fileSize" : 201326592,             
  "nsSizeMB" : 16,                    
  "dataFileVersion" : {               
    "major" : 4,                
    "minor" : 5                 
  },                                  
  "ok" : 1                            
}  
                                         
*/

// stats for one collection
db.numbers.stats()

/* results like 
{                                    
  "ns" : "tutorial.numbers",       
  "count" : 200000,            
  "size" : 7200036,            
  "avgObjSize" : 36.00018,     
  "storageSize" : 11255808,    
  "numExtents" : 7,            
  "nindexes" : 2,              
  "lastExtentSize" : 5664768,  
  "paddingFactor" : 1,         
  "systemFlags" : 1,           
  "userFlags" : 0,             
  "totalIndexSize" : 11552688, 
  "indexSizes" : {             
    "_id_" : 6508096,    
    "num_1" : 5044592    
  },                           
  "ok" : 1                     
}                                    

*/

// ******************* 2.3.2 how commands work ******************************


// db.stats() is a helper for
db.runCommand( {dbstats: 1} )


// db.numbers.stats() is a helper for
db.runCommand( {collstats: "numbers"} )

// see definition for a function, such as "runCommand" - type without () 
db.runCommand

// which leads to this version of the command for db.numbers.stats()
db.$cmd.findOne( {collstats: "numbers"} );


// **************** 2.4 getting help **********************

// what does this save command do?
db.numbers.save({num: 123123123})

// see save function code
db.numbers.save