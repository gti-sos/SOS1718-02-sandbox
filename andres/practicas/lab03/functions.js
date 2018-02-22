/*
function log(message1, message2){
    console.log(Date() + " > " +message1);
    console.log("%s > %s, %s", Date(), message1, message2);
}

log("Hey");

function log(){
    for(var i =0; i<arguments.length;i++){
        console.log("%s >%s", Date(),arguments[i]);
    }
}

var contact = new Object();
//var contact;

contact.name ="peter";
contact.phone=123456;

var c2 = {"name" : "paul", "phone": 6789};

function printContact(contact){
    log(contact.name,contact.phone);
}

printContact(contact);

var numbers = new Array();
numbers.push(1);

var numbers = [1,2,3,4,5];
*/
//Imprimir todos los valores de un array.
function printNumbers(n){
    console.log(n);
}

var numbers=[1,2,3,4,5,6,7,8,9,10];
numbers.forEach(printNumbers);

numbers.forEach(function (n){
    console.log(n);
});

numbers.forEach((n) => {
    console.log(n);
});

numbers
    .filter((n) => {
        return (n<2);
    }).forEach((n) => {
        console.log(n);
    });

numbers
    .map((n) => {
        return (n+2);
    }).filter((n) => {
        return (n<10);
    }).forEach((n) => {
        console.log(n);
    });

var sum = numbers
            .reduce((a, n) => {
                return a+n;
            });

console.log(sum);
