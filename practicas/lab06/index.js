var express = require("express");
var port = (process.env.PORT || 1607);
var bodyParser = require("body-parser")
var DataStore = require("nedb")
var app = express();
var dbFileName = __dirname + "/countries.db";

var BASE_API_PATH = "/api/v2";

app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/public"));

var initialsCountries = [{
        "country": "austria",
        "year": 1998,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 1999,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2000,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2001,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2002,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2003,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2004,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "austria",
        "year": 2005,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    },
    {
        "country": "belgium",
        "year": 1998,
        "primary": 27.8599,
        "secondary": 27.46764,
        "trtiery": 49.0146
    }
];

var db = new DataStore({
    filename: dbFileName,
    autoload: true
});

db.find({}, (err, countries) => {
    if (err) {
        console.error("Error accesing DB");
        process.exit(1);
    }
    if (countries.length == 0) {
        console.log("Empty DB");
        db.insert(initialsCountries);
    }
    else {
        console.log("DB initialized with " + countries.length + " contacts")
    }
});

app.get(BASE_API_PATH + "/countries", (req, res) => {
    res.send(JSON.stringify(initialsCountries));
});

app.post(BASE_API_PATH + "/countries", (req, res) => {
    var country = req.body;
    initialsCountries.push(country);
    res.sendStatus(201);
});

app.put(BASE_API_PATH + "/countries", (req, res) => {
    res.sendStatus(405);
});

app.put(BASE_API_PATH + "/countries/:country/:year", (req, res) => {
    var country = req.params.country;
    var year = req.params.year;
    //db.update({ country: country, year: year }, { ${ system: 'solar system' } }, { multi: true }, function (err, numReplaced)
    res.sendStatus(200);
    console.log(country + " " + year)
});

app.delete(BASE_API_PATH + "/countries", (req, res) => {
    initialsCountries = [];
    res.sendStatus(200);
});

app.get(BASE_API_PATH + "/countries/:country", (req, res) => {
    var country = req.params.country;
    res.send(initialsCountries.filter((c) => {
        return (c.country == country);
    }));
});

app.listen(port, () => {
    console.log("Server ready on port: " + port + "!")
}).on("error", (e) => {
    console.log("Server NOT READY:" + e)
});

console.log("Server setting up...")
