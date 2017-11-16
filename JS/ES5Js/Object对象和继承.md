# Object对象和继承

通过原型链，对象的属性分成两种：自身的属性和继承的属性。JavaScript 语言在Object对象上面，提供了很多相关方法，来处理这两种不同的属性。

## Object.getOwnPropertyNames()
Object.getOwnPropertyNames方法返回一个数组，成员是对象本身的所有属性的键名，不包含继承的属性键名
上面代码中，Object.getOwnPropertyNames方法返回Date所有自身的属性名。
对象本身的属性之中，有的是可以枚举的（enumerable），有的是不可以枚举的，Object.getOwnPropertyNames方法返回所有键名。只获取那些可以枚举的属性，使用Object.keys方法。 .. 这也就是说, keys同样不会去原型链里面寻找继承下来的属性.
Object.keys(Date) // []

## Object.prototype.hasOwnProperty()
对象实例的hasOwnProperty方法返回一个布尔值，用于判断某个属性定义在对象自身，还是定义在原型链上。
Date.hasOwnProperty('length')
// true
Date.hasOwnProperty('toString')
// false
hasOwnProperty方法是JavaScript之中唯一一个处理对象属性时，不会遍历原型链的方法。

## in 运算符和 for…in 循环
in运算符返回一个布尔值，表示一个对象是否具有某个属性。它不区分该属性是对象自身的属性，还是继承的属性。
'length' in Date // true
'toString' in Date // true
in运算符常用于检查一个属性是否存在。

获得对象的所有可枚举属性（不管是自身的还是继承的），可以使用for...in循环。
为了在for...in循环中获得对象自身的属性，可以采用hasOwnProperty方法判断一下。
for ( var name in object ) {
  if ( object.hasOwnProperty(name) ) {
    /* loop code */
  }
}
获得对象的所有属性（不管是自身的还是继承的，以及是否可枚举），可以使用下面的函数。
function inheritedPropertyNames(obj) {
  var props = {};
  while(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(p) {
      props[p] = true;
    });
    obj = Object.getPrototypeOf(obj);
  }
  return Object.getOwnPropertyNames(props);
}

### 对象的拷贝
如果要拷贝一个对象，需要做到下面两件事情。

确保拷贝后的对象，与原对象具有同样的prototype原型对象。
确保拷贝后的对象，与原对象具有同样的属性。

function copyObject(orig) {
  var copy = Object.create(Object.getPrototypeOf(orig));
  copyOwnPropertiesFrom(copy, orig);
  return copy;
}

function copyOwnPropertiesFrom(target, source) {
  Object
  .getOwnPropertyNames(source)
  .forEach(function(propKey) {
    var desc = Object.getOwnPropertyDescriptor(source, propKey);
    Object.defineProperty(target, propKey, desc);
  });
  return target;
}

// 第一步, 是原型的拷贝, 这个拷贝, 直接用create方法就完成了, 将被拷贝的对象的原型直接作为原型传入到create方法里面, 会创建一个已经正确赋值了的空对象过来, 然后就是给这个空对象进行赋值操作了, 那么这个操作, 用的是defineProperty这个函数. 
