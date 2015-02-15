# Storing an image as binary data in a single document

require 'rubygems'
require 'mongo'

# Prepare the binary data object for insert
image_filename = File.join(File.dirname(__FILE__), "canyon-thumb.jpg")
image_data = File.open(image_filename).read
bson_image_data = BSON::Binary.new(image_data)
doc = {"name" => "monument-thumb.jpg",
       "data" => bson_image_data }

# Connect and insert the document
@con  = Mongo::MongoClient.new
@thumbnails = @con['images']['thumbnails']
@image_id = @thumbnails.insert(doc)

# Find the document and make sure it matches the original
doc = @thumbnails.find_one({"_id" => @image_id})
if image_data == doc["data"].to_s
  puts "Stored image is equal to the original file!"
end
