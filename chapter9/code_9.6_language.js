// first run the text search using the index created in 9.3.2
db.books.find({$text: {$search: 'in '}}).count()

/* result - no books - 'in' is a stop word
> db.books.find({$text: {$search: 'in '}}).count()
0
*/

// delete the previous index from  9.3.2

db.books.dropIndex('books_text_index');

// now add the index, specifying language

db.books.ensureIndex(           
    {'$**': 'text'},
     
    {weights:
        {title: 10,
         categories: 5},

     name : 'books_text_index', 
     
     default_language: 'french'
    }
);

// redo find
db.books.find({$text: {$search: 'in '}}).count()

/* results - now find 334 books with word 'in'

> db.books.find({$text: {$search: 'in '}}).count()
334

*/

// show new index
db.books.getIndexes()

/*  results
> db.books.getIndexes()
[
        {
                "v" : 1,
                "key" : {
                        "_id" : 1
                },
                "name" : "_id_",
                "ns" : "catalog.books"
        },
        {
                "v" : 1,
                "key" : {
                        "_fts" : "text",
                        "_ftsx" : 1
                },
                "name" : "books_text_index",
                "ns" : "catalog.books",
                "weights" : {
                        "$**" : 1,
                        "categories" : 5,
                        "title" : 10
                },
                "default_language" : "french",
                "language_override" : "language",
                "textIndexVersion" : 2
        }
]
*/

// search for the word 'in'
db.books.find({$text: {$search: 'in '}}).count()

/* result
> db.books.find({$text: {$search: 'in '}}).count()
334
*/

// first drop the index and set it back to english
db.books.dropIndex('books_text_index');    
db.books.ensureIndex(           
    {'$**': 'text'},
     
    {weights:
        {title: 10,
         categories: 5},

     name : 'books_text_index', 
     
     default_language: 'english'
    }
);

// insert a document with French in it
db.books.insert({
    _id: 999,
    title: 'Le Petit Prince',
    pageCount: 85,
    publishedDate:  ISODate('1943-01-01T01:00:00Z'),
    shortDescription: "Le Petit Prince est une œuvre de langue française, la plus connue d'Antoine de Saint-Exupéry. Publié en 1943 à New York simultanément en anglais et en français. C'est un conte poétique et philosophique sous l'apparence d'un conte pour enfants.",
    status: 'PUBLISH',
    authors: ['Antoine de Saint-Exupéry'],
    language: 'french'
})

// search for the book you just insert - does find one
db.books.find({$text: {$search: 'œuvre', $language: 'french'}}).count()

// ************** WORK IN PROGRESS

> db.books.find({$text: {$search: 'simultanment',$language:'french'}},{title:1})  #A
{ "_id" : 999, "title" : "Le Petit Prince" }

#A language French, only finds "Le Petit Prince"

> db.books.find({$text: {$search: 'simultanment'}},{title:1})
{ "_id" : 186, "title" : "Hadoop in Action" }  #B
{ "_id" : 293, "title" : "Making Sense of Java" }

#B Perhaps simultanment is stemmed to same stem as simultaneously?
 - using various algorithms, not a dictionary

> db.books.find({$text: {$search: 'prince'}},{title:1})
{ "_id" : 145, "title" : "Azure in Action" }   #C
{ "_id" : 999, "title" : "Le Petit Prince" }

#C One of the authors is Brian H. Prince

 > db.books.find({$text: {$search: 'simultaneous'}},{title:1})
{ "_id" : 186, "title" : "Hadoop in Action" }   #D
{ "_id" : 293, "title" : "Making Sense of Java" }

 > db.books.find({$text: {$search: 'simultaneous', $language:'french'}},{title:1})
 >                                              #E

> db.books.find({_id:186})
{ "_id" : 186, "title" : "Hadoop in Action", "isbn" : "1935182196", "pageCount" : 325, "publishedDate" : ISODate("2010-12-01T08:00:00Z"), "thumbnailUrl" : "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/lam.jpg", "shortDescription" : "Hadoop in Action teaches readers how to use Hadoop and write MapReduce programs. The intended readers are programmers, architects, and project managers who have to process large amounts of data offline. Hadoop in Action will lead the reader from obtaining a copy of Hadoop to setting it up in a cluster and writing data analytic programs.", "longDescription" : "Hadoop is an open source framework implementing the MapReduce algorithm behind Google's approach to querying the distributed data sets that constitute the internet. This definition naturally leads to an obvious question, \"What are \"maps\" and why do they need to be \"reduced \"    Massive data sets can be extremely difficult to analyze and query using traditional mechanisms, especially when the queries themselves are quite complicated. In effect, the MapReduce algorithm breaks up both the query and the data set into constituent parts   that's the \"mapping.\" The mapped components of the query can be processed simultaneously   or \"reduced\"   to rapidly return results.    Hadoop in Action teaches readers how to use Hadoop and write MapReduce programs. The intended readers are programmers, architects, and project managers who have to process large amounts of data offline. Hadoop in Action will lead the reader from obtaining a copy of Hadoop to setting it up in a cluster and writing data analytic programs.    The book begins by making the basic idea of Hadoop and MapReduce easier to grasp by applying the default Hadoop installation to a few easy-to-follow tasks, such as analyzing changes in word frequency across a body of documents. The book continues through the basic concepts of MapReduce applications developed using Hadoop, including a close look at framework components, use of Hadoop for a variety of data analysis tasks, and numerous examples of Hadoop in action.    Hadoop in Action will explain how to use Hadoop and present design patterns and practices of programming MapReduce. MapReduce is a complex idea both conceptually and in its implementation, and Hadoop users are challenged to learn all the knobs and levers for running Hadoop. This book takes you beyond the mechanics of running Hadoop, teaching you to write meaningful programs in a MapReduce framework.    This book assumes the reader will have a basic familiarity with Java, as most code examples will be written in Java. Familiarity with basic statistical concepts (e.g. histogram, correlation) will help the reader appreciate the more advanced data processing examples.", "status" : "PUBLISH", "authors" : [ "Chuck Lam" ], "categories" : [ "Java" ] }


> db.books.find({_id:145})
{ "_id" : 145, "title" : "Azure in Action", "isbn" : "193518248X", "pageCount" : 425, "publishedDate" : ISODate("2010-10-22T07:00:00Z"), "thumbnailUrl" : "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/hay.jpg", "shortDescription" : "Azure in Action is a fast-paced tutorial intended for architects and developers looking to develop on Windows Azure and the Windows Azure Platform. It's designed both for readers new to cloud concepts and for those familiar with cloud development but new to Azure. After a quick walk through the basics, it guides you all the way from your first app through more advanced concepts of the Windows Azure Platform.", "longDescription" : "Cloud-based applications pose an intriguing value proposition for businesses. With an easily scalable, pay-as-you-go model and very small startup costs, the cloud can be a great alternative to systems hosted in-house. Developers are scrambling to understand the impact a cloud-based approach will have on current and future projects.    Azure is Microsoft's full-fledged entry into the \"Cloud Services Platform\" arena. Unlike other cloud offerings that address only one piece of the puzzle, Azure includes an operating system, a set of developer services, and a data model that can be used individually or together. It's designed to interact seamlessly with other .NET-based components, and leverages your knowledge of Visual Studio, the .NET platform, and SQL Server. It's also fully compatible with multiple internet protocols, including HTTP, REST, SOAP, and XML.    Azure in Action is a fast-paced tutorial intended for architects and developers looking to develop on Windows Azure and the Windows Azure Platform. It's designed both for readers new to cloud concepts and for those familiar with cloud development but new to Azure. After a quick walk through the basics, it guides you all the way from your first app through more advanced concepts of the Windows Azure Platform.    The book starts by looking at the logical and physical architecture of an Azure app, and then moves to the core storage services   binary store, tables and queues. Then, it explores designing and scaling frontend and backend services that run in the cloud. Next, it covers more advanced scenarios in Windows Azure. After covering the core of Azure, it introduces the rest of the Windows Azure Platform with a particular focus on SQL Azure Database.", "status" : "PUBLISH", "authors" : [ "Chris Hay", "Brian H. Prince" ], "categories" : [ "Microsoft .NET" ] }

db.books.find({$text: {$search: 'de'}},{title:1})

> db.books.find({$text: {$search: 'de'}},{title:1})
{ "_id" : 108, "title" : "Sencha Touch in Action" }   #A
{ "_id" : 761, "title" : "jQuery in Action, Third Edition" }
{ "_id" : 10, "title" : "OSGi in Depth" }
{ "_id" : 199, "title" : "Doing IT Right" }
{ "_id" : 36, "title" : "ASP.NET 4.0 in Practice" }
{ "_id" : 629, "title" : "Play for Java" }
{ "_id" : 224, "title" : "Entity Framework 4 in Action" }

#A One of the authors is Anthony De Moss


// in french, finds nothing - it is a stop word
db.books.find({$text: {$search: 'de', $language: 'french'}}).count()

> db.books.find({$text: {$search: 'de', $language: 'french'}}).count()
0     #A

#A In French, 'de' is a stop word - no results found

