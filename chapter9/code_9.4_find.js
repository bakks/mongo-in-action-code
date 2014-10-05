// super simple search - case insensitive, searches all text fields (v2)
db.books.find({$text: {$search: 'actions'}},{title:1})

{ "_id" : 755, "title" : "MongoDB in Action, Second Edition" }
{ "_id" : 17, "title" : "MongoDB in Action" }



// OR flavor search - plus stop words
db.books.find({$text: {$search: 'MongoDB in Action'}},{title:1})

// results:

//    { "_id" : 256, "title" : "Machine Learning in Action" }
//    { "_id" : 146, "title" : "Distributed Agile in Action" }
//    { "_id" : 233, "title" : "PostGIS in Action" }
//    { "_id" : 17, "title" : "MongoDB in Action" }


//**********************************************************************
//          9.4.1 - complex searches - same as later section but without text scores
//**********************************************************************


db.books.
    find({$text: {$search: ' "mongodb" in action'}},           //A
    {_id:0, title:1})

/*  RESULTS

{ "title" : "MongoDB in Action" }
{ "title" : "MongoDB in Action, Second Edition" }

*/


db.books.
    find({$text: {$search: ' "mongodb" "second edition" '}},           //A
    {_id:0, title:1})


db.books.
    find({$text: {$search: ' books '}}).
    count()

db.books.
    find({$text: {$search: ' "books" '}}).
    count()


db.books.
    find({$text: {$search: ' "book" '}}).
    count()

  // ******************   book alternative - developer
  
 
db.books.
    find({$text: {$search: ' developers '}}).
    count()

db.books.
    find({$text: {$search: ' "developers" '}}).
    count()

db.books.
    find({$text: {$search: ' "developer" '}}).
    count()  

    
 db.books.
    find({$text: {$search: ' developing '}}).
    count()  
    
    
  // ********************************************************

db.books.
    find({$text: {$search: ' mongodb -second '}},           //A
    {_id:0, title:1})

db.books.
    find({$text: {$search: ' mongodb -"second edition" '}},           //A
    {_id:0, title:1})

db.books.
    find({$text: {$search: ' mongodb '}, status: 'MEAP' },           //A
    {_id:0, title:1, status:1})

// showing text search score for two different
// search strings which are equivalent

db.books.
    find({$text: {$search: 'mongodb in action'}},               //A
    {_id:0, title:1, score: { $meta: "textScore" }}).           //B
    limit(4);



db.books.
    find({$text: {$search: 'the mongodb and actions in it'}},   //D
    {_id:0, title:1, score: { $meta: "textScore" }}).
    limit(4);

/********************************  RESULTS

> db.books.
    ...     find({$text: {$search: 'mongodb in action'}},               #A
    ...     {_id:0, title:1, score: { $meta: "textScore" }}).           #B
    ...     limit(4);
{ "title" : "Machine Learning in Action", "score" : 16.83933933933934 }
{ "title" : "Distributed Agile in Action", "score" : 19.371088861076345 }
{ "title" : "PostGIS in Action", "score" : 17.67825896762905 }      #C
{ "title" : "MongoDB in Action", "score" : 49.48653394500073 }
>
>
> db.books.
    ...     find({$text: {$search: 'the mongodb and actions in it'}},   #D
    ...     {_id:0, title:1, score: { $meta: "textScore" }}).
    ...     limit(4);
{ "title" : "Machine Learning in Action", "score" : 16.83933933933934 }
{ "title" : "Distributed Agile in Action", "score" : 19.371088861076345 }
{ "title" : "PostGIS in Action", "score" : 17.67825896762905 }      #E
{ "title" : "MongoDB in Action", "score" : 49.48653394500073 }

******************************************* */

// sorting results by relevancy
db.books.
    find({$text: {$search: 'mongodb in action'}},       //A
         {title:1, score: { $meta: "textScore" }}).     //B
    sort({ score: { $meta: "textScore" } })             //C

/* RESULTS

{ "_id" : 17, "title" : "MongoDB in Action", "score" : 49.48653394500073 }
{ "_id" : 186, "title" : "Hadoop in Action", "score" : 24.99910329985653 }
{ "_id" : 560, "title" : "HTML5 in Action", "score" : 23.02156177156177 }

*/


//**********************************************************************
//           - complex searches WITH text scores
//**********************************************************************


db.books.
    find({$text: {$search: ' "mongodb" in action'}},           //A
    {_id:0, title:1, score: { $meta: "textScore" }})

/*  RESULTS

{ "title" : "MongoDB in Action", "score" : 49.48653394500073 }
{ "title" : "MongoDB in Action, Second Edition", "score" : 12.5 }

*/


// ADVANCED (not in book)
// will search for all books with EITHER mongodb or books
// then look at each document to see if it can find the word "mongodb"
// Not always efficient - for example if I have the word 'book' in my search
// string, it will search almost all of the books in my collection, since almost
// all books have that word.
// It will then find almost all of the books via the index,
// then look for the word "mongo" in each book.
// Seems like this could be made more efficient, so possibly change in future releases?


db.books.
    find({$text: {$search: ' "mongodb" book'}},           //A
    {_id:0, title:1, score: { $meta: "textScore" }}).explain()


/* RESULTS

> db.books.count()
431
> db.books.
    ...     find({$text: {$search: ' "mongodb" book'}},           //A
    ...     {_id:0, title:1, score: { $meta: "textScore" }}).explain()
{
    "cursor" : "TextCursor",
    "n" : 2,
    "nscannedObjects" : 414,
    "nscanned" : 416,
    "nscannedObjectsAllPlans" : 414,
    "nscannedAllPlans" : 416,
    "scanAndOrder" : false,
    "nYields" : 6,
    "nChunkSkips" : 0,
    "millis" : 15,
    "server" : "D830J:27017",
    "filterSet" : false
}

*/


db.books.
    find({$text: {$search: ' "mongodb" "second edition" '}},           //A
    {_id:0, title:1, score: { $meta: "textScore" }})


db.books.
    find({$text: {$search: ' books '}}).
    count()


db.books.
    find({$text: {$search: ' "books" '}}).
    count()


db.books.
    find({$text: {$search: ' "book" '}}).
    count()


db.books.
    find({$text: {$search: ' mongodb -second '}},           //A
    {_id:0, title:1, score: { $meta: "textScore" }})

db.books.
    find({$text: {$search: ' mongodb -"second edition" '}},           //A
    {_id:0, title:1, score: { $meta: "textScore" }})

db.books.
    find({$text: {$search: ' mongodb '}, status: 'MEAP' },           //A
    {_id:0, title:1, status:1, score: { $meta: "textScore" }})