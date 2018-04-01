var port = (process.env.PORT || 1607);
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var expendituresApi=require("./apiExpenditures/expenditures");
var employmentsApi=require("./apiEmployments/employments");
var unemploymentsApi=require("./apiUnemployments/unemployments");

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