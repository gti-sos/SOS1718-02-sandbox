var url = "mongodb://dbtest:dbtest0@ds161148.mlab.com:61148/sos1718-jmm-sandbox";
var BASE_API = "/api/v1";
var BASE_API_PATH = "/api/v1/employments";
var MongoClient = require('mongodb').MongoClient;
var apiEmployments = {};
module.exports = apiEmployments;

var initialsEmployments = [
    { "country": "croatia", "year": 1998, "totalselfemployed": 18.5, "totalsalariedemployed": 75.30000305, "totalcontributingfamilyworker": 6.19999980926514 },
    { "country": "cyprus", "year": 2005, "totalself": 20.5, "totalsalaried": 76.80000305, "totalcontributingfamilyworker": 2.799999952 },
    { "country": "romania", "year": 1998, "totalself": 22.60000038, "totalsalaried": 59.70000076, "totalcontributingfamilyworker": 17.79999924 },
    { "country": "spain", "year": 2005, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "portugal", "year": 2001, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "italy", "year": 2000, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "austria", "year": 2001, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 },
    { "country": "france", "year": 2000, "totalself": 21.39999962, "totalsalaried": 64.69999695, "totalcontributingfamilyworker": 13.80000019 }
];

apiEmployments.register = function(app) {
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

    //GET all
    app.get(BASE_API_PATH, (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").find().toArray(function(err, result) {
                if (!err && !result.length) {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                else {
                    res.send(result);
                }
                db.close();
            });
        });
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
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").find(myquery).toArray(function(err, result) {
                if (!err && !result.length) {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                else {
                    res.send(result);
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
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").find(myquery).toArray(function(err, result) {
                if (!err && !result.length) {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                else {
                    res.send(result);
                }
                db.close();
            });
        });
    });

    //POST
    app.post(BASE_API_PATH, (req, res) => {
        var myquery = { country: req.body.country, year: Number(req.body.year) };
        if (!isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.young) || isNaN(req.body.adult) || isNaN(req.body.old) || isNaN(req.body.longterm)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-jmm-sandbox");
                dbo.collection("employments").count(myquery, function(err, count) {
                    console.log(count);
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
        if (!isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.young) || isNaN(req.body.adult) || isNaN(req.body.old) || isNaN(req.body.longterm)) {
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
                    if (err) throw err;
                    if (!err && count) {
                        dbo.collection("employments").updateOne(myquery, newvalues, function(err, result) {
                            if (err) throw err;
                            console.log("1 document updated.");
                            res.sendStatus(201);
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
            dbo.collection("employments").deleteMany(function(err, obj) {
                if (err) throw err;
                res.sendStatus(200);
            });
            db.close();
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
                if (err) throw err;
                if (count) {
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
        console.log(myquery);
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-jmm-sandbox");
            dbo.collection("employments").count(myquery, function(err, count) {
                if (err) throw err;
                if (count) {
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

    //urlQuery
    app.get(BASE_API_PATH + "/country?" + "*", (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-alc-sandbox");
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
            dbo.collection("employments").find(query).toArray(function(err, result) {
                if (!err && !result.length) {
                    console.log("Not found");
                    res.sendStatus(404);
                }
                else {
                    res.send(result);
                }
                db.close();
            });
        });
    });

    //Authentication
    app.post(BASE_API + "/secure/employments", (req, res) => {
        var email = req.body.email;
        var pass = req.body.pass;
        if (email == "joseangel" && pass == "joseangel") {
            console.log("Accepted");
            res.sendStatus(202);
        }
        else {
            console.log("Accepted");
            res.sendStatus(401);
        }
    });
};
