var map = Array.prototype.map;
var a = map.call("Hello world", function(x) {
    return x;
})
console.log(a);