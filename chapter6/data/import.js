// import data 
mongoimport --db garden --collection orders --drop --file garden.orders.json
mongoimport --db garden --collection products --drop --file garden.products.json
mongoimport --db garden --collection categories --drop --file garden.categories.json
mongoimport --db garden --collection reviews --drop --file garden.reviews.json
mongoimport --db garden --collection users --drop --file garden.users.json
