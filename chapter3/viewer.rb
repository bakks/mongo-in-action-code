$LOAD_PATH << File.dirname(__FILE__)
require 'rubygems'
require 'mongo'
require 'sinatra'
require 'config'
require 'open-uri'

configure do
  conn = Mongo::Client.new("mongodb://#{DATABASE_HOST}:#{DATABASE_PORT}/#{DATABASE_NAME}")
  TWEETS = conn[COLLECTION_NAME]
end

get '/' do
  if params['tag']
    selector = {:tags => params['tag']}
  else
    selector = {}
  end

  @tweets = TWEETS.find(selector).sort(["id", -1])
  erb :tweets
end
