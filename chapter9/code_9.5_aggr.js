/* Limits

    - The $match stage that includes a $text must be the first stage in the pipeline.
    - A text operator can only occur once in the stage.
    - The text operator expression cannot appear in $or or $not expressions.

*/

// previous example was
db.books.
    find({$text: {$search: 'mongodb in action'}},       //A
         {title:1, score: { $meta: "textScore" }}).     //B
    sort({ score: { $meta: "textScore" } })             //C


// ****** SORT BY SCORE
db.books.aggregate(
   [
     { $match: { $text: { $search: 'mongodb in action' } } },   //A
     { $sort: { score: { $meta: 'textScore' } } },              //B
     { $project: { title: 1, score: { $meta: 'textScore' } } }  //C
   ]
)

/* Results
{ "_id" : 17, "title" : "MongoDB in Action", "score" : 49.48653394500073 }
{ "_id" : 186, "title" : "Hadoop in Action", "score" : 24.99910329985653 }
{ "_id" : 560, "title" : "HTML5 in Action", "score" : 23.02156177156177 }
{ "_id" : 197, "title" : "Erlang and OTP in Action", "score" : 22.069632021922096 }
*/



db.books.aggregate(
    [
        { $match: { $text: { $search: 'mongodb in action' } } },
        { $project: { title: 1, score: { $meta: 'textScore' } } },
        { $sort: { score: -1 } }                                     //C
    ]
)


db.books.aggregate(
    [
        { $match: { $text: { $search: ' "mongodb" in action ' } } },
        { $project: {_id:0, title: 1, score: { $meta: 'textScore' } } }
    ]
)

/*
> db.books.aggregate(
    ...     [
    ...         { $match: { $text: { $search: ' "mongodb" in action ' } } },
    ...         { $project: {_id:0, title: 1, score: { $meta: 'textScore' } } }
    ...     ]
    ... )
{ "title" : "MongoDB in Action", "score" : 49.48653394500073 }
{ "title" : "MongoDB in Action, Second Edition", "score" : 12.5 }

*/

db.books.findOne({"title" : "MongoDB in Action, Second Edition"})

db.books.aggregate(
    [
        { $match: { $text: { $search: 'mongodb in action' } } },

        { $project: {
            title: 1,
            score: { $meta: 'textScore' },
            multiplier: { $cond: [ '$longDescription',1.0,3.0] } }   //A
        },

        { $project: {
            _id:0, title: 1, score: 1, multiplier: 1,
            adjScore: {$multiply: ['$score','$multiplier']}}        //B
        },

        { $sort: {adjScore: -1}}
    ]
);


/*

> db.books.aggregate(
    ...     [
    ...         { $match: { $text: { $search: 'mongodb in action' } } },
...
...         { $project: {
...             title: 1,
...             score: { $meta: 'textScore' },
...             multiplier: { $cond: [ '$longDescription',1.0,3.0] } }   //A
...         },
...
...         { $project: {
...             _id:0, title: 1, score: 1, multiplier: 1,
...             adjScore: {$multiply: ['$score','$multiplier']}}        //B
...         },
...
...         { $sort: {adjScore: -1}}
...     ]
... );

{ "title" : "MongoDB in Action", "score" : 49.48653394500073, "multiplier" : 1, "adjScore" : 49.48653394500073 }
{ "title" : "MongoDB in Action, Second Edition", "score" : 12.5, "multiplier" : 3, "adjScore" : 37.5 }         //C
{ "title" : "Spring Batch in Action", "score" : 11.666666666666666, "multiplier" : 3, "adjScore" : 35 }
{ "title" : "Hadoop in Action", "score" : 24.99910329985653, "multiplier" : 1, "adjScore" : 24.99910329985653 }
{ "title" : "HTML5 in Action", "score" : 23.02156177156177, "multiplier" : 1, "adjScore" : 23.02156177156177 }


*/