// export data via mongoexport
// Only works for collections with simple data that fits the limitations of JSON
mongoexport --db garden --collection orders --out garden.orders.json
mongoexport --db garden --collection products --out garden.products.json
mongoexport --db garden --collection categories --out garden.categories.json
mongoexport --db garden --collection reviews --out garden.reviews.json
mongoexport --db garden --collection users --out garden.users.json