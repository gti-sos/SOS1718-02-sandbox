var port = (process.env.PORT || 1600);
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var expendituresApi = require("./apiExpenditures/expenditures.js");
var employmentsApi = require("./apiEmployments/employments.js");
var unemploymentsApi = require("./apiUnemployments/unemployments.js");
app.use(bodyParser.json());
app.use("/", express.static(__dirname + "/public"));

expendituresApi.register(app);
employmentsApi.register(app);
unemploymentsApi.register(app);

app.listen(port, () => {
    console.log("Server ready on port: " + port + "!");
}).on("error", (e) => {
    console.log("Server NOT READY:" + e);
});
console.log("Server setting up...");
