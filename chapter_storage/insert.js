for (var j = 0; j < 10000; j++) {
    var r1 = Math.random();

    // A nice date around year 2000
    var dateFld = new Date(1.5e12 * r1);
    var intFld = Math.floor(1e8 * r1);
    // A nicely randomized string of about 40 characters
    var stringFld = Math.floor(1e64 * r1).toString(36);
    var boolFld = intFld % 2;

    doc = {
        random_date: dateFld,
        random_int: intFld,
        random_string: stringFld,
        random_bool: boolFld
    }

    doc.arr = [];

    for (var i = 0; i < 16; i++) {
        var r2 = Math.random();

        // A nice date around year 2000
        var dateFld = new Date(1.5e12 * r2);
        var intFld = Math.floor(1e8 * r2);
        var stringFld = Math.floor(1e64 * r2).toString(36);
        var boolField = intFld % 2;

        if (i < 8) {
            doc.arr.push({
                date_field: dateFld,
                int_field: intFld,
                string_field: stringFld,
                bool_field: boolFld
            });
        } else {
            doc["sub" + i] = {
                date_field: dateFld,
                int_field: intFld,
                string_field: stringFld,
                bool_field: boolFld
            };
        }
    }

    db.benchmark.insert(doc);
}

