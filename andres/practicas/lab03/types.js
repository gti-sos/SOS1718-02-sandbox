console.log("Hellow world!!");

numero =1;
console.log(numero);

var otronumero =2;
var myDouble= 2.0;
var myString="mystring";
var myboolean= true;

myString= myString + " es cool.";
console.log(myString);

if(numero==myDouble){
    console.log("The same");
}

if(otronumero==myDouble){
    console.log("The same 2");
}


if(otronumero==parseInt(myDouble,0)){
    console.log("The same 3");
}

myString = parseInt(myString);
console.log(myString);

myString = parseInt("2");
console.log(myString);

myString = parseInt(myString);
console.log(myString);

myString = parseInt("2") + 1;
console.log(myString);

myString = parseInt("2" + 1);
console.log(myString);
