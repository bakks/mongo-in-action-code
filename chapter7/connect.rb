require 'rubygems'
require 'mongo'
require ‘./inventory_fetcher.rb’

$client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'tutorial')
Mongo::Logger.logger.level = ::Logger::ERROR

$users     = $client[:users]
$inventory = $client[:inventory]
$orders    = $client[:orders]

AVAILABLE  = 0
IN_CART    = 1
PRE_ORDER  = 2
PURCHASED  = 3

puts 'connected!'
