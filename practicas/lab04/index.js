var cool = require("cool-ascii-faces");
console.log("Hello world!!");
var express = require("express");
var app=express();

app.get("/hello",(req,res)=>{
    res.send("Hello!");
});

app.listen(process.env.PORT);
console.log(cool());