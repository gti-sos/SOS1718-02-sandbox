var url = "mongodb://nekane:1234567890@ds119049.mlab.com:19049/sos1718-msr-sandbox";
var BASE_API = "/api/v1";
var BASE_API_PATH = "/api/v1/unemployments";
var MongoClient = require('mongodb').MongoClient;
var apiUnemployments = {};
module.exports = apiUnemployments;

var initialsUnemployments = [
    { "country": "austria", "year": 1998, "young": 1.600000024, "adult": 1.600000024, "old": 1.600000024, "longterm": 1.600000024 },
    { "country": "belgium", "year": 2003, "young": 3.5, "adult": 3.5, "old": 3.5, "longterm": 3.5 },
    { "country": "bulgaria", "year": 1998, "young": 8, "adult": 8, "old": 8, "longterm": 8 },
    { "country": "croatia", "year": 2003, "young": 8, "adult": 8, "old": 8, "longterm": 8 },
    { "country": "austria", "year": 1999, "young": 1.399999976, "adult": 1.399999976, "old": 1.399999976, "longterm": 1.399999976 },
    { "country": "italy", "year": 2001, "young": 6.0, "adult": 6.0, "old": 6.0, "longterm": 6.0 },
    { "country": "portugal", "year": 2002, "young": 11.5, "adult": 4.5, "old": 2.400000095, "longterm": 1.600000024 },
    { "country": "slovak-republic", "year": 2004, "young": 32, "adult": 16, "old": 15.10000038, "longterm": 11 }
];

apiUnemployments.register = function(app) {
    //urlQuery
    app.get(BASE_API_PATH + "?", (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-msr-sandbox");
            var query = req.query;
            var offset = 0;
            var limit = 0;
            if (req.query.year) {
                query.year = Number(req.query.year);
            }
            if (req.query.young) {
                query.young = Number(req.query.young);
            }
            if (req.query.adult) {
                query.adult = Number(req.query.adult);
            }
            if (req.query.old) {
                query.old = Number(req.query.old);
            }
            if (req.query.longterm) {
                query.longterm = Number(req.query.longterm);
            }
            if (req.query.offset) {
                offset = Number(req.query.offset);
            }
            if (req.query.limit) {
                limit = Number(req.query.limit);
            }
            delete query.offset;
            delete query.limit;
            dbo.collection("unemployments").find(query).skip(offset).limit(limit).toArray(function(err, result) {
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
    });

    //GET all
    app.get(BASE_API_PATH, (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-msr-sandbox");
            if (err) throw err;
            dbo.collection("unemployments").find({}).toArray(function(err, result) {
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
    });

    //Postman help
    app.get(BASE_API_PATH + "/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/3901859/sos1718-02-unemployments/RVu1HAku");
    });

    //loadInitialData
    app.get(BASE_API_PATH + "/loadInitialData", (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").count(function(err, count) {
                if (!err && !count) {
                    dbo.collection("unemployments").insertMany(initialsUnemployments, function(err, resu) {
                        if (err) throw err;
                        console.log("Number of documents inserted: " + resu.insertedCount);
                        res.send("Number of documents inserted: " + resu.insertedCount);
                        db.close();
                    });
                }
                else {
                    console.log("Unemployments has " + count + " documents inserted.");
                    res.send("Unemployments has " + count + " documents inserted.");
                }
                db.close();
            });
        });
    });

    //GET all SECURED
    app.get(BASE_API + "/secure/unemployments", (req, res) => {
        var email = req.headers.email;
        var pass = req.headers.pass;
        if (email == "lolasanchez" && pass == "lolasanchez") {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-msr-sandbox");
                dbo.collection("unemployments").find().toArray(function(err, result) {
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

    //GET country OR year
    app.get(BASE_API_PATH + "/:obj", (req, res) => {
        var myquery;
        if (isNaN(req.params.obj)) {
            myquery = { country: req.params.obj };
        }
        else {
            myquery = { year: Number(req.params.obj) };
        }
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").find(myquery).toArray(function(err, result) {
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
    });

    //GET country & year
    app.get(BASE_API_PATH + "/:country/:year", (req, res) => {
        var myquery = { country: req.params.country, year: Number(req.params.year) };
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").find(myquery).toArray(function(err, result) {
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
    });

    //POST
    app.post(BASE_API_PATH, (req, res) => {
        var myquery = { country: req.body.country, year: Number(req.body.year) };
        if (req.body._id != undefined || !isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.young) || isNaN(req.body.adult) || isNaN(req.body.old) || isNaN(req.body.longterm)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-msr-sandbox");
                dbo.collection("unemployments").count(myquery, function(err, count) {
                    if (!err && !count) {
                        dbo.collection("unemployments").insertOne(req.body, function(err, result) {
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
        if (req.body._id != undefined || req.body.country != req.params.country || req.body.year != req.params.year || !isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.young) || isNaN(req.body.adult) || isNaN(req.body.old) || isNaN(req.body.longterm)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-msr-sandbox");
                var myquery = { country: req.params.country, year: Number(req.params.year) };
                var newvalues = { $set: req.body };
                dbo.collection("unemployments").count(myquery, function(err, count) {
                    if (!err && count) {
                        dbo.collection("unemployments").updateOne(myquery, newvalues, function(err, result) {
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
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").count(function(err, count) {
                if (!err && count) {
                    dbo.collection("unemployments").deleteMany(function(err, obj) {
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
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").count(myquery, function(err, count) {
                if (!err && count) {
                    dbo.collection("unemployments").deleteMany(myquery, function(err, obj) {
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
            var dbo = db.db("sos1718-msr-sandbox");
            dbo.collection("unemployments").count(myquery, function(err, count) {
                if (!err && count) {
                    dbo.collection("unemployments").deleteOne(myquery, function(err, obj) {
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
