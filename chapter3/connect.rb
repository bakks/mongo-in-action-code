require 'rubygems'
require 'mongo'
$con   = Mongo::Connection.new
$db    = $con['tutorial']
$users = $db['users']
puts 'connected!'
