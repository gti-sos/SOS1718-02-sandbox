var url = "mongodb://wirfen:1234567890@ds161148.mlab.com:61148/sos1718-alc-sandbox";
var BASE_API = "/api/v1";
var BASE_API_PATH = "/api/v1/expenditures";
var MongoClient = require('mongodb').MongoClient;
var apiExpenditures = {};
module.exports = apiExpenditures;

var initialsExpenditures = [
    { "country": "austria", "year": 1998, "primary": 27.8599, "secundary": 27.46764, "tertiery": 49.0146 },
    { "country": "belgium", "year": 2005, "primary": 19.83316, "secundary": 32.84222, "tertiery": 34.572 },
    { "country": "romania", "year": 1998, "primary": 19.7114, "secundary": 27.59638, "tertiery": 25.89706 },
    { "country": "portugal", "year": 2005, "primary": 22.47196, "secundary": 33.54664, "tertiery": 26.26249 },
    { "country": "croatia", "year": 1998, "primary": 23.11054, "secundary": 22.54006, "tertiery": 19.83316 },
    { "country": "denmark", "year": 2003, "primary": 25.29723, "secundary": 34.75882, "tertiery": 66.72786 },
    { "country": "france", "year": 2004, "primary": 18.42795, "secundary": 30.07212, "tertiery": 35.17949 },
    { "country": "italy", "year": 2001, "primary": 23.71071, "secundary": 30.13383, "tertiery": 24.97742 },
];

apiExpenditures.register = function(app) {
    //loadInitialData
    app.get(BASE_API_PATH + "/loadInitialData", (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").count(function(err, count) {
                if (!err && !count) {
                    dbo.collection("expenditures").insertMany(initialsExpenditures, function(err, resu) {
                        if (err) throw err;
                        console.log("Number of documents inserted: " + resu.insertedCount);
                        res.send("Number of documents inserted: " + resu.insertedCount);
                        db.close();
                    });
                }
                else {
                    console.log("Expenditures has " + count + " documents inserted.");
                    res.send("Expenditures has " + count + " documents inserted.");
                }
                db.close();
            });
        });
    });

    //GET all
    app.get(BASE_API_PATH, (req, res) => {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").find().toArray(function(err, result) {
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
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").find(myquery).toArray(function(err, result) {
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
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").find(myquery).toArray(function(err, result) {
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
        if (!isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.primary) || isNaN(req.body.secundary) || isNaN(req.body.tertiery)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-alc-sandbox");
                dbo.collection("expenditures").count(myquery, function(err, count) {
                    console.log(count);
                    if (!err && !count) {
                        dbo.collection("expenditures").insertOne(req.body, function(err, result) {
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
        if (!isNaN(req.body.country) || isNaN(req.body.year) || isNaN(req.body.primary) || isNaN(req.body.secundary) || isNaN(req.body.tertiery)) {
            res.sendStatus(400);
            console.log("Bad request");
        }
        else {
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("sos1718-alc-sandbox");
                var myquery = { country: req.params.country, year: Number(req.params.year) };
                var newvalues = { $set: req.body };
                dbo.collection("expenditures").count(myquery, function(err, count) {
                    if (err) throw err;
                    if (!err && count) {
                        dbo.collection("expenditures").updateOne(myquery, newvalues, function(err, result) {
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
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").deleteMany(function(err, obj) {
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
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").count(myquery, function(err, count) {
                if (err) throw err;
                if (count) {
                    dbo.collection("expenditures").deleteMany(myquery, function(err, obj) {
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
            var dbo = db.db("sos1718-alc-sandbox");
            dbo.collection("expenditures").count(myquery, function(err, count) {
                if (err) throw err;
                if (count) {
                    dbo.collection("expenditures").deleteOne(myquery, function(err, obj) {
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
            if (req.query.primary) {
                query.primary = Number(req.query.primary);
            }
            if (req.query.secundary) {
                query.secundary = Number(req.query.secundary);
            }
            if (req.query.tertiery) {
                query.tertiery = Number(req.query.tertiery);
            }
            dbo.collection("expenditures").find(query).toArray(function(err, result) {
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
    app.post(BASE_API + "/secure/expenditures", (req, res) => {
        var email = req.body.email;
        var pass = req.body.pass;
        if (email == "andreslorenzo" && pass == "andreslorenzo") {
            console.log("Accepted");
            res.sendStatus(202);
        }
        else {
            console.log("Accepted");
            res.sendStatus(401);
        }
    });
};