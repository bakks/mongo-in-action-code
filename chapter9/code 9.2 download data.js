
var bookList = [
    {title: 'Java 8 in Action',
     descr: ['While the term "lambda expression" may sound abstract and academic, Java 8 Lambdas can have a big impact on how you program every day. In simplest terms, a lambda expression is a function—a bit of code—that you can pass to another method as an argument. Thus, you can cope with changing requirements by using a behavior, represented by a lambda, as a parameter. Java 8\'s functional programming features, like lambdas and the new Stream API that enables a cleaner way to iterate through collections, can help you write concise, maintainable code that scales easily and performs well on multicore architectures.',
             'Java 8 in Action is a clearly-written guide to Java 8 lambdas and functional programming in Java. It begins with a practical introduction to the structure and benefits of lambda expressions in real-world Java code. The book then introduces the Stream API and shows how it can make collections-related code radically easier to understand and maintain. Along the way, you\'ll discover new FP-oriented design patterns with Java 8 for code reuse, code readability, exception handling, data manipulation, and concurrency. For developers also exploring other functional languages on the JVM, the book concludes with a quick survey of useful functional features in Scala.'],
     authors:['Raoul-Gabriel Urma' , 'Mario Fusco', 'Alan Mycroft'],
     subjects: ['java']
    },

    {title: 'MongoDB in Action',
     descr: ['MongoDB in Action is a comprehensive guide to MongoDB for application developers. The book begins by explaining what makes MongoDB unique and describing its ideal use cases. A series of tutorials designed for MongoDB mastery then leads into detailed examples for leveraging MongoDB in e-commerce, social networking, analytics, and other common applications.'],
     authors: ['Kyle Banker']
    },

    {title: 'MongoDB in Action, Second Edition',
     descr: ['Application developers love MongoDB, a document-oriented NoSQL database, for its speed, flexibility, scalability, and ease of use. With an intuitive data model and powerful features that include dynamic queries, secondary indexes, and atomic in-place updates, MongoDB is well-suited as a back-end for modern web applications. Its schema-free design encourages rapid application development, and built-in replication and an auto-sharding architecture allow for massive parallel distribution. Need proof? Production deployments at SourceForge, Foursquare, and Shutterfly demonstrate daily that MongoDB is up to real-world challenges.',
             'MongoDB In Action, Second Edition is a comprehensive guide to MongoDB version 2.6 for application developers. The book begins with a general overview of current database systems, explaining what makes MongoDB unique and describing its ideal use cases. Then, a series of tutorials designed for MongoDB mastery leads into detailed examples for leveraging MongoDB in e-commerce, social networking, analytics, and other common applications. A reference section on schema design patterns is also included to help ease the transition from the relational data model of SQL to MongoDB\'s document-based data model.'],
     authors: ['Kyle Banker','Peter Bakkum', 'Tim Hawkins', 'Shaun Verch', 'Doug Garrett' ]
    }

];

db.books.drop();
db.books.insert(bookList);

