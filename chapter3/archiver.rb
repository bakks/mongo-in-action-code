$LOAD_PATH << File.dirname(__FILE__)
require 'rubygems' 
require 'mongo'
require 'twitter'
require 'config'

class TweetArchiver

  # Create a new instance of TweetArchiver
  def initialize(tag)
    print "#{DATABASE_HOST}:#{DATABASE_PORT}\n"
    connection = Mongo::Client.new("mongodb://#{DATABASE_HOST}:#{DATABASE_PORT}/#{DATABASE_NAME}")
    @tweets    = connection[COLLECTION_NAME]
    @tweets.indexes.create_one({ tags: 1, id: -1 })
    @tag = tag
    @tweets_found = 0

    # Configure the twitter client using the values found in config.rb
    @client = Twitter::REST::Client.new do |config|
      config.consumer_key        = API_KEY
      config.consumer_secret     = API_SECRET
      config.access_token        = ACCESS_TOKEN
      config.access_token_secret = ACCESS_TOKEN_SECRET
    end
  end

  # Notify the user all the save_save_tweets_for method
  def update
    puts "Starting Twitter search for '#{@tag}'..."
    save_tweets_for(@tag)
    print "#{@tweets_found} tweets saved.\n\n"
  end

  private

  # Search with the twitter client and save the results to Mongo
  def save_tweets_for(term)
    @client.search(term).each do |tweet|
      @tweets_found += 1
      tweet_doc = tweet.to_h
      tweet_doc[:tags] = term
      tweet_doc[:_id] = tweet_doc[:id]
      @tweets.insert_one(tweet_doc)
    end
  end
end
