#
# ******** commands from 3.1 which can be entered in irb
#

# if run from file - need  this

require 'rubygems'
require 'mongo'
$con   = Mongo::Connection.new
$db    = $con['tutorial']
$users = $db['users']
puts 'connected!'

# to remove ALL users - in case you do run this from a file more than once
$users.drop()

#
#   ************ Below can be run from interactive ruby (irb)
#                after using:
#
#        > irb -r ./connect.rb
#

# part 1 - insert knuth

id = $users.save({"lastname" => "knuth"})
$users.find_one({"_id" => id})


#part 2 - insert smith and jones

smith = {"last_name" => "smith", "age" => 30}
jones = {"last_name" => "jones", "age" => 40}

smith_id = $users.insert(smith)
jones_id = $users.insert(jones)

$users.find_one({"_id" => smith_id})
$users.find_one({"_id" => jones_id})

# if run as a file - this is the only result you'll see
p $users.find_one({"_id" => smith_id})

# example finds
$users.find({"last_name" => "smith"})
$users.find({"age" => {"$gt" => 30}})


# use a cursor
cursor = $users.find({"age" => {"$gt" => 30}})
cursor.each do |doc|
  puts doc["last_name"]
end

# alternative - more language neutral
cursor = $users.find({"age" => {"$gt" => 30}})
while doc = cursor.next
  puts doc["last_name"]
end

#
# ************* 3.1.4 Updates and deletes
#

$users.update({"last_name" => "smith"}, {"$set" => {"city" => "Chicago"}})

# see change (note: need '.next' at the end to actually show first result from cursor
$users.find({"last_name" => "smith"}).next

# using multi of true for mutliple updates
$users.update({"last_name" => "smith"},
  {"$set" => {"city" => "New York"}}, {:multi => true})

  
# remove selected users
$users.remove({"age" => {"$gte" => 40}})

# remove all users
$users.remove


# 
#  ***************** 3.1.5 Database Commands
#

# list databases
$admin_db = $con['admin']
$admin_db.command({"listDatabases" => 1})

# drop users collections - removes indexes, etc.
db = $con['tutorial']
db.drop_collection('users')

# or - another way to drop a collection
db.command({"drop" => "users"})

#
#  ******************** 3.2.1 Object ID generation
#

require 'mongo'
id =  BSON::ObjectId.from_string('4c291856238d3b19b2000001')
id.generation_time

jun_id = BSON::ObjectId.from_time(Time.utc(2013, 6, 1))
jul_id = BSON::ObjectId.from_time(Time.utc(2013, 7, 1))
$users.find({'_id' => {'$gte' => jun_id, '$lt' => jul_id}})


#
# ******************* 3.2.3 Over the network
#

$users.insert({"last_name" => "james"}, :w => 1)
