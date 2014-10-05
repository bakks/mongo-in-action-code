// verify syntax - won't find anything
db.posts.find({'tags': 'politics', 'vote_count': {'$gt': 10}});

// 1.3.2 examples
use my_database
db.users.insert({name: "Kyle"})
db.users.find()

