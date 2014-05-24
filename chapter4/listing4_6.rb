require 'rubygems'                                                     
require 'mongo'                                                        
                                                                       
VIEW_PRODUCT = 0     # action type constants                                                  
ADD_TO_CART  = 1                                                       
CHECKOUT     = 2                                                       
PURCHASE     = 3                                                       
                                                                       
con = Mongo::Connection.new                                            
db  = con['garden']                                                    
db.drop_collection("user.actions")                                     
db.create_collection("user.actions", :capped => true, :size => 16384)  
 
actions = db['user.actions'] # refers to the garden.user.actions collection                                      
                                                                       
500.times do |n|             # loop 500 times, using n as the iterator                                          
  doc = {                                                              
    :username => "kbanker",                                            
    :action_code => rand(4), # random value between 0 and 3, inclusive                                         
    :time => Time.now.utc,                                             
    :n => n                                                            
  }                                                                    
  actions.insert(doc)                                                  
end                        
