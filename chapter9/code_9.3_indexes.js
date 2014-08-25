// just one field

// SEE ALSO: 7.2.2 on creating and deleting indexes.


// if NO name 
db.books.ensureIndex(           
    {title: 'text',
     shortDescription: 'text',
     longDescription: 'text',
     authors: 'text',
     categories: 'text'},
     
    {weights:
        {title: 10,
         shortDescription: 1,
         longDescription:1,
         authors: 1,
         categories: 5}
     }
);

// take a look at the index
// 1. amount of space
// 2. long index name

db.books.stats()

//    /*  listing 9.2
//
//    > db.books.stats()
//    {
//            "ns" : "catalog.books",
//            "count" : 431,
//            "size" : 772368,
//            "avgObjSize" : 1792,
//            "storageSize" : 2793472,
//            "numExtents" : 5,
//            "nindexes" : 2,
//            "lastExtentSize" : 2097152,
//            "paddingFactor" : 1,
//            "systemFlags" : 0,
//            "userFlags" : 1,
//            "totalIndexSize" : 858480,
//            "indexSizes" : {
//                    "_id_" : 24528,
//                    "title_text_shortDescription_text_longDescription_text_authors_text_categories_text" : 833952
//            },
//            "ok" : 1
//    }
//    */


// THEN builds name based on fields indexed
// in this case:

// '$**': 'text'

db.books.dropIndex('title_text_shortDescription_text_longDescription_text_authors_text_categories_text')

// WARNING: names is getting pretty long: 82 characters, max is 128 (including db name, etc.)
//   adding everything (database + collection name) it is 96 characters:
//         catalog.books.title_text_shortDescription_text_longDescription_text_authors_text_categories_text
//
// Good practice: assign a name (see next example)

// use wildcard specification instead
// as well as specify an index name
db.books.ensureIndex(           
    {'$**': 'text'},
     
    {weights:
        {title: 10,
         categories: 5},

     name : 'books_text_index'
    }
);

// ***** NOTES: 
// 1. will get weighting of categories and titles just based on few words in those fields
// 2. can not change weights once index built - have to drop it and then redefine it 
// **************

//    /*  Results:
//
//     > db.books.ensureIndex(
//     ...     {'$**': 'text'},
//     ...
//     ...     {weights:
//     ...         {title: 10,
//     ...          categories: 5},
//     ...
//     ...      name : 'books_text_index'
//     ...     }
//     ... );
//     {
//     "createdCollectionAutomatically" : false,
//     "numIndexesBefore" : 1,
//     "numIndexesAfter" : 2,
//     "ok" : 1
//     }
//
//     */

// *****************************************************
// Use below to compare with indexes in chapter 8
// *****************************************************

// to show indexes, including the name:
db.books.getIndexes()

//    /* Results
//    > db.books.getIndexes()
//        [
//        {
//            "v" : 1,
//            "key" : {
//                "_id" : 1
//            },
//            "name" : "_id_",
//            "ns" : "catalog.books"
//        },
//        {
//            "v" : 1,
//            "key" : {
//                "_fts" : "text",
//                "_ftsx" : 1
//            },
//            "name" : "books_text_index",
//            "ns" : "catalog.books",
//            "weights" : {
//                "$**" : 1,
//                "categories" : 5,
//                "title" : 10
//            },
//            "default_language" : "english",
//            "language_override" : "language",
//            "textIndexVersion" : 2
//        }
//        ]
//
//    */

// find name of index, etc.
db.books.stats()

// Explain default_language, language_override
//    /* See how large the text index is:
//    > db.books.stats()
//    {
//        "ns" : "catalog.books",
//        "count" : 431,
//        "size" : 769552,
//        "avgObjSize" : 1785,
//        "storageSize" : 2793472,
//        "numExtents" : 5,
//        "nindexes" : 2,
//        "lastExtentSize" : 2097152,
//        "paddingFactor" : 1,
//        "systemFlags" : 0,
//        "userFlags" : 1,
//        "totalIndexSize" : 1005648,
//        "indexSizes" : {
//            "_id_" : 24528,
//            "books_text_index" : 981120
//    },
//        "ok" : 1
//    }
//    */


//******************************************
// NOTE: that the index is even larger than the data
//   -  "books_text_index" : 981120  vs   "size" : 769552,
//
// Understandable if indexing all of your text 
// - it has to create an index entry for each word, 
//     - less the stop words and 
//     - less stemming? (which can be shorter - script vs scripting)
// 

