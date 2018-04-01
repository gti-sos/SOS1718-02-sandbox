var express = require("express");
var app=express();

app.get("/hello",(req,res)=>{
    res.send("Hello!");
});

app.listen(process.env.PORT);