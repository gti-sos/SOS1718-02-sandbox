//var cool = require("cool-ascii-faces");
var express = require("express");
var app=express();

app.get("/hello",(req,res)=>{
    res.send("Hello!");
});

app.listen(process.env.PORT);
//console.log(cool);