require 'rubygems'
require 'mongo'

# We are loading 'names' from the same directory that this script is in, so add
# that directory to the search path before trying to load the file, so the
# script can find it
$LOAD_PATH.unshift(File.expand_path(File.dirname(__FILE__))) \
    unless $LOAD_PATH.include?(File.expand_path(File.dirname(__FILE__)))
require 'names'

# Open a connection to MongoDB
@con  = Mongo::MongoClient.new("localhost", 40000)

# Create a collection object for the "cloud-docs.spreadsheets" collection
@col  = @con['cloud-docs']['spreadsheets']

# Fake spreadsheet data
@data = "abcde" * 1000

# Write the requested number of documents.  "name_count" is the number of
# different names to use when saving spreadsheets, and "iterations" is the
# number of documents to save for each person
def write_user_docs(iterations=0, name_count=200)
  iterations.times do |iteration|
    name_count.times do |name_number|
      doc = { :filename => "sheet-#{iteration}",
              :updated_at => Time.now.utc,
              :username => Names::LIST[name_number],
              :data => @data
            }
      @col.insert(doc)
    end
  end
end

# Get command line arguments and run the script
if ARGV.empty? || !(ARGV[0] =~ /^\d+$/)
  puts "Usage: load.rb [iterations] [name_count]"
else
  iterations = ARGV[0].to_i

  if ARGV[1] && ARGV[1] =~ /^\d+$/
    name_count = ARGV[1].to_i
  else
    name_count = 200
  end

  write_user_docs(iterations, name_count)
end
