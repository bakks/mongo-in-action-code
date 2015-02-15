# Storing an image as binary data in gridfs

require 'rubygems'
require 'mongo'

# Writing GridFS
@con  = Mongo::MongoClient.new
@db   = @con["images"]
@grid = Mongo::Grid.new(@db)
filename = File.join(File.dirname(__FILE__), "canyon.jpg")
file = File.open(filename, "r")
file_id = @grid.put(file, :filename => "canyon.jpg")

# Reading GridFS
image_io = @grid.get(file_id)
copy_filename = File.join(File.dirname(__FILE__), "canyon-copy.jpg")
copy = File.open(copy_filename, "w")
while !image_io.eof? do
  copy.write(image_io.read(256 * 1024))
end
copy.close
