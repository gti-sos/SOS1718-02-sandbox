var express = require("express");
var port = (process.env.PORT || 1607);
var bodyParser = require("body-parser")

var app=express();

var BASE_API_PATH = "/api/v1";

app.use(bodyParser.json());
app.use("/",express.static(__dirname+"/public"));

var contacts = [
    {
        "name":"pablo",
        "phone":12345
    },
    {
        "name":"pepe",
        "phone":67890
    }
    ];

app.get(BASE_API_PATH+"/contacts",(req,res)=>{
    res.send(JSON.stringify(contacts));
});

app.get("/time",(req,res)=>{
    console.log("new request to /time")
    res.send(new Date());
});


app.listen(port,()=>{
    console.log("Server ready on port: "+port+"!")
}).on("error",(e)=>{
    console.log("Server NOT READY:"+e)
});

console.log("Server setting up...")