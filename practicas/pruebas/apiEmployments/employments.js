var url = "mongodb://dbtest:dbtest0@ds161148.mlab.com:61148/sos1718-jmm-sandbox";
var BASE_API = "/api/v1";
var BASE_API_PATH = "/api/v1/employments";
var MongoClient = require('mongodb').MongoClient;
var apiEmployments = {};
module.exports = apiEmployments;

var initialsEmployments = [
    { "country": "croatia", "year": 1998, "totalself": 18.5, "totalsalaried": 75.30000305, "totalcontributingfamilyworker": 6.19999980926514 },
    { "country": "cyprus", "year": 2005, "totalself": 20.5, "totalsalaried": 76.80000305, "totalcontributingfamilyworker": 2.799999952 },
    { "country": "romania", "year": 1998, "totalself": 22.60000038, "totalsalaried": 59.70000076, "totalcontributingfamilyworker": 17.79999924 },
    { "country": "spain", "year": 2005, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "portugal", "year": 2001, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "italy", "year": 2000, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "austria", "year": 2001, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "france", "year": 2000, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 }
];

apiEmployments.register = function(app) {

    //urlQuery
    app.get(BASE_API_PATH + "/country?", (req, res) => {
        var limit = Number(req.query.limit);
        var offset = Number(req.query.offset);


        var query = req.query;
        if (req.query.year) {
            query.year = Number(req.query.year);
        }
        if (req.query.totalself) {
            query.totalself = Number(req.query.totalself);
        }
        if (req.query.totalsalaried) {
            query.totalsalaried = Number(req.query.totalsalaried);
        }
        if (req.query.totalcontributingfamilyworker) {
            query.totalcontributingfamilyworker = Number(req.query.totalcontributingfamilyworker);
        }
        if (limit > 0 & offset > 0) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(req.query).skip(offset).limit(limit).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(req.query).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
    });

    //GET all
    app.get(BASE_API_PATH, (req, res) => {
        var limit = Number(req.query.limit);
        var offset = Number(req.query.offset);
        if (limit > 0 & offset > 0) {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                if (err) throw err;
                dbo.collection("employments").find({}).skip(offset).limit(limit).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                if (err) throw err;
                dbo.collection("employments").find({}).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
    });

    //Postman help
    app.get(BASE_API_PATH + "/docs", (req, res) => {
        //res.redirect("https://documenter.getpostman.com/view/3901859/sos1718-02-employments/RVu1HAqN");
         res.redirect("https://documenter.getpostman.com/view/3881259/sos1718-02-employments/RVu5i8A3");
    });

    //loadInitialData
    app.get(BASE_API_PATH + "/loadInitialData", (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").count(function(err, count) {
                if (!err && !count) {
                    dbo.collection("employments").insertMany(initialsEmployments, function(err, resu) {
                        if (err) throw err;
                        console.log("Number of documents inserted: " + resu.insertedCount);
                        res.send("Number of documents inserted: " + resu.insertedCount);
                        db.close();
                    });
                }
                else {
                    console.log("Employments has " + count + " documents inserted.");
                    res.send("Employments has " + count + " documents inserted.");
                }
                db.close();
            });
        });
    });

    //GET all SECURED
    app.get(BASE_API + "/secure/employments", (req, res) => {
        var email = req.headers.email;
        var pass = req.headers.pass;
        if (email == "joseangel" && pass == "joseangel") {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find().toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
        else {
            console.log("Unauthorized");
            res.sendStatus(401);
        }
    });
    /*
        //PAGINACIÓN
        app.get(BASE_API_PATH +"?", (req, res) => {
            
            var limit = Number(req.query.limit);
            var offset = Number(req.query.offset);
          
            
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find().skip(offset).limit(limit).toArray(function(err, result) {
                    
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    
                     db.close();
                });
            });
        });*/
    //GET country OR year
    app.get(BASE_API_PATH + "/:obj", (req, res) => {
        var limit = Number(req.query.limit);
        var offset = Number(req.query.offset);

        var myquery;
        if (isNaN(req.params.obj)) {
            myquery = { country: req.params.obj };
        }
        else {
            myquery = { year: Number(req.params.obj) };
        }
        if (limit > 0 & offset > 0) {

            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(myquery).skip(offset).limit(limit).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(myquery).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
    });

    //GET country & year
    app.get(BASE_API_PATH + "/:country/:year", (req, res) => {
        var limit = Number(req.query.limit);
        var offset = Number(req.query.offset);
        if (limit > 0 & offset > 0) {

            var myquery = { country: req.params.country, year: Number(req.params.year) };
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(myquery).skip(offset).limit(limit).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
        else {
            var myquery = { country: req.params.country, year: Number(req.params.year) };
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").find(myquery).toArray(function(err, result) {
                    if (!err && !result.length) {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    else {
                        res.send(result.map((c) => {
                            delete c._id;
                            return c;
                        }));
                    }
                    db.close();
                });
            });
        }
    });

    //POST
    app.post(BASE_API_PATH, (req, res) => {
        var myquery = { country: req.body.country, year: Number(req.body.year) };
        if (req.body._id != undefined || !isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.totalself) || isNaN(req.body.totalsalaried) || isNaN(req.body.totalcontributingfamilyworker)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").count(myquery, function(err, count) {
                    if (!err && !count) {
                        dbo.collection("employments").insertOne(req.body, function(err, result) {
                            if (err) throw err;
                            console.log("1 document inserted");
                            res.sendStatus(201);
                            db.close();
                        });
                    }
                    else {
                        res.sendStatus(409);
                    }
                    db.close();
                });
            });
        }
    });

    //PUT
    app.put(BASE_API_PATH + "/:country/:year", (req, res) => {
        if (req.body._id != undefined || req.body.country != req.params.country || req.body.year != req.params.year || !isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.totalself) || isNaN(req.body.totalsalaried) || isNaN(req.body.totalcontributingfamilyworker)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                var myquery = { country: req.params.country, year: Number(req.params.year) };
                var newvalues = { $set: req.body };
                dbo.collection("employments").count(myquery, function(err, count) {
                    if (!err && count) {
                        dbo.collection("employments").updateOne(myquery, newvalues, function(err, result) {
                            if (err) throw err;
                            console.log("1 document updated.");
                            res.sendStatus(200);
                            db.close();
                        });
                    }
                    else {
                        console.log("Not found");
                        res.sendStatus(404);
                    }
                    db.close();
                });
            });
        }
    });

    //DELETE all
    app.delete(BASE_API_PATH, (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").count(function(err, count) {
                if (!err && count) {
                    dbo.collection("employments").deleteMany(function(err, obj) {
                        if (err) throw err;
                        console.log(count + " registers deleted.");
                        res.sendStatus(200);
                        db.close();
                    });
                }
                else {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                db.close();
            });
        });
    });

    //DELETE country or year
    app.delete(BASE_API_PATH + "/:obj", (req, res) => {
        var myquery;
        if (isNaN(req.params.obj)) {
            myquery = { country: req.params.obj };
        }
        else {
            myquery = { year: Number(req.params.obj) };
        }
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").count(myquery, function(err, count) {
                if (!err && count) {
                    dbo.collection("employments").deleteMany(myquery, function(err, obj) {
                        if (err) throw err;
                        console.log("Ok");
                        res.sendStatus(200);
                        db.close();
                    });
                }
                else {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                db.close();
            });
        });
    });

    //DELETE country & year
    app.delete(BASE_API_PATH + "/:country/:year", (req, res) => {
        var myquery = { country: req.params.country, year: Number(req.params.year) };
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").count(myquery, function(err, count) {
                if (!err && count) {
                    dbo.collection("employments").deleteOne(myquery, function(err, obj) {
                        if (err) throw err;
                        console.log("Ok");
                        res.sendStatus(200);
                        db.close();
                    });
                }
                else {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                db.close();
            });
        });
    });

    //Methods not allowed
    //GET to BASE_API
    app.get(BASE_API, (req, res) => {
        res.sendStatus(405);
        console.log("Method not allowed");
    });
    //POST with arguments.
    app.post(BASE_API_PATH + "/*", (req, res) => {
        res.sendStatus(405);
        console.log("Method not allowed");
    });
    //PUT without arguments.
    app.put(BASE_API_PATH, (req, res) => {
        res.sendStatus(405);
        console.log("Method not allowed");
    });
    //PUT with 1 argument.
    app.put(BASE_API_PATH + "/:obj", (req, res) => {
        res.sendStatus(405);
        console.log("Method not allowed");
    });
    //PUT with more than 2 arguments.
    app.put(BASE_API_PATH + "/:obj1/:obj2" + "/*", (req, res) => {
        res.sendStatus(405);
        console.log("Method not allowed");
    });
};
