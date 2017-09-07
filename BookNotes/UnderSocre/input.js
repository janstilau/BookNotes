var Person = function() {
    this.name = "xiaoming";
}
Person.sayHi = function() {
    console.log('hi');
}
var temp = new Person();
console.log(temp);