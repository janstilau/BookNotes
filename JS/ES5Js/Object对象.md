# Object对象
## Object概述
JavaScript 原生提供Object对象（注意起首的O是大写），所有其他对象都继承自这个对象。Object本身也是一个构造函数，可以直接通过它来生成新对象。
Object作为构造函数使用时，可以接受一个参数。如果该参数是一个对象，则直接返回这个对象；如果是一个原始类型的值，则返回该值对应的包装对象。
new Object(123) instanceof Number
// true

## Object()
Object本身当作工具方法使用时，可以将任意值转为对象。这个方法常用于保证某个值一定是对象。
如果参数是原始类型的值，Object方法返回对应的包装对象的实例. 
```
Object() // 返回一个空对象
Object() instanceof Object // true
Object(undefined) // 返回一个空对象
Object(undefined) instanceof Object // true
Object(null) // 返回一个空对象
Object(null) instanceof Object // true
Object(1) // 等同于 new Number(1)
Object(1) instanceof Object // true
Object(1) instanceof Number // true
Object('foo') // 等同于 new String('foo')
Object('foo') instanceof Object // true
Object('foo') instanceof String // true
Object(true) // 等同于 new Boolean(true)
Object(true) instanceof Object // true
Object(true) instanceof Boolean // true
```
如果Object方法的参数是一个对象，它总是返回原对象。
利用这一点，可以写一个判断变量是否为对象的函数。
function isObject(value) {
  return value === Object(value);
}

## Object对象的静态方法
所谓“静态方法”，是指部署在Object对象自身的方法。
也就是Object这个函数的方法, 要记住, Object是一个构造函数而已, 而所谓的静态方法, 就是定义在这个构造函数上面的方法, 因为函数也是一个对象, 可以在这个对象上增加各种属性. 
Object.keys方法和Object.getOwnPropertyNames方法很相似，一般用来遍历对象的属性。它们的参数都是一个对象，都返回一个数组，该数组的成员都是***对象自身的（而不是继承的）***所有属性名。它们的区别在于，Object.keys方法只返回可枚举的属性（关于可枚举性的详细解释见后文），Object.getOwnPropertyNames方法还返回不可枚举的属性名。
// forin 和 in这两个语句, 继承下来的属性也会被遍历到的. 
```
var o = {
  p1: 123,
  p2: 456
};
Object.keys(o)
// ["p1", "p2"]
Object.getOwnPropertyNames(o)

// 下面的a是一个数组, 而length是一个不可枚举的属性, 它们的结果不一样了.
var a = ["Hello", "World"];
Object.keys(a)
// ["0", "1"]
Object.getOwnPropertyNames(a)
// ["0", "1", "length"]
```
由于JavaScript没有提供计算对象属性个数的方法，所以可以用这两个方法代替。
Object.keys(o).length
一般情况下，几乎总是使用Object.keys方法，遍历数组的属性。

## Object的其他方法
（1）对象属性模型的相关方法
Object.getOwnPropertyDescriptor()：获取某个属性的attributes对象。
Object.defineProperty()：通过attributes对象，定义某个属性。
Object.defineProperties()：通过attributes对象，定义多个属性。
Object.getOwnPropertyNames()：返回直接定义在某个对象上面的全部属性的名称。
（2）控制对象状态的方法
Object.preventExtensions()：防止对象扩展。
Object.isExtensible()：判断对象是否可扩展。
Object.seal()：禁止对象配置。
Object.isSealed()：判断一个对象是否可配置。
Object.freeze()：冻结一个对象。
Object.isFrozen()：判断一个对象是否被冻结。
（3）原型链相关方法
Object.create()：该方法可以指定原型对象和属性，返回一个新的对象。
Object.getPrototypeOf()：获取对象的Prototype对象。

## Object对象的实例方法
除了Object对象本身的方法，还有不少方法是部署在Object.prototype对象上的，所有Object的实例对象都继承了这些方法。
Object实例对象的方法，主要有以下六个。
valueOf()：返回当前对象对应的值。
toString()：返回当前对象对应的字符串形式。
toLocaleString()：返回当前对象对应的本地字符串形式。
hasOwnProperty()：判断某个属性是否为当前对象自身的属性，还是继承自原型对象的属性。
isPrototypeOf()：判断当前对象是否为另一个对象的原型。
propertyIsEnumerable()：判断某个属性是否可枚举。

valueOf方法的作用是返回一个对象的“值”，默认情况下返回对象本身。
valueOf方法的主要用途是，JavaScript自动类型转换时会默认调用这个方法
var o = new Object();
1 + o // "1[object Object]"
上面代码将对象o与数字1相加，这时JavaScript就会默认调用valueOf()方法。所以，如果自定义valueOf方法，就可以得到想要的结果。
var o = new Object();
o.valueOf = function (){
  return 2;
};
1 + o // 3
上面代码自定义了o对象的valueOf方法，于是1 + o就得到了3。这种方法就相当于用o.valueOf覆盖了Object.prototype.valueOf。

Object.prototype.toString()
toString方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。
var o1 = new Object();
o1.toString() // "[object Object]"
var o2 = {a:1};
o2.toString() // "[object Object]"
上面代码表示，对于一个对象调用toString方法，会返回字符串[object Object]，该字符串说明对象的类型。
字符串[object Object]本身没有太大的用处，但是通过自定义toString方法，可以让对象在自动类型转换时，得到想要的字符串形式。数组、字符串、函数、Date对象都分别部署了自己版本的toString方法，覆盖了Object.prototype.toString方法。
### toString的应用
Object.prototype.toString方法返回对象的类型字符串，因此可以用来判断一个值的类型。
上面代码调用空对象的toString方法，结果返回一个字符串object Object，其中第二个Object表示该值的构造函数。这是一个十分有用的判断数据类型的方法。
实例对象可能会自定义toString方法，覆盖掉Object.prototype.toString方法。通过函数的call方法，可以在任意值上调用Object.prototype.toString方法，帮助我们判断这个值的类型。
Object.prototype.toString.call(value)
不同数据类型的Object.prototype.toString方法返回值如下。
```
数值：返回[object Number]。
字符串：返回[object String]。
布尔值：返回[object Boolean]。
undefined：返回[object Undefined]。
null：返回[object Null]。
数组：返回[object Array]。
arguments对象：返回[object Arguments]。
函数：返回[object Function]。
Error对象：返回[object Error]。
Date对象：返回[object Date]。
RegExp对象：返回[object RegExp]。
其他对象：返回[object Object]。
```
也就是说，Object.prototype.toString可以得到一个实例对象的构造函数。利用这个特性，可以写出一个比typeof运算符更准确的类型判断函数。
```
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};
var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

type({}); // "object"
type([]); // "array"
type(5); // "number"
type(null); // "null"
type(); // "undefined"
type(/abcd/); // "regex"
type(new Date()); // "date"
```

['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp'
].forEach(function (t) {
  type['is' + t] = function (o) {
    return type(o) === t.toLowerCase();
  };
});
type.isObject({}) // true
type.isNumber(NaN) // true
type.isRegExp(/abc/) // true







