# this
## 什么是this
首先，this总是返回一个对象，简单说，就是返回属性或方法“当前”所在的对象。
var person = {
  name: '张三',
  describe: function () {
    return '姓名：'+ this.name;
  }
};
person.describe()
// "姓名：张三"
this.name表示describe方法***所在的当前对象***的name属性。调用person.describe方法时，describe方法所在的当前对象是person，所以就是调用person.name。

JS中的方法, 可以被当做一个值, 赋值给别的对象, 那么在这个时候, 方法内部的this, 就从原来的对象, 转移到了被赋值的这个对象了. 
因为在别的语言里面, 我们其实是没有办法, 去改变this的指向的, 所以在JS中, 有了这个变化之后, 改变了我们对于方法属于某个类的传统的人事. 

总结:
JavaScript 语言之中，一切皆对象，运行环境也是对象，所以函数都是在某个对象之中运行，this就是这个对象（环境）。这本来并不会让用户糊涂，但是 JavaScript 支持运行环境动态切换，也就是说，this的指向是动态的，没有办法事先确定到底指向哪个对象，这才是最让初学者感到困惑的地方。
如果一个函数在全局环境中运行，那么this就是指顶层对象（浏览器中为window对象）。
this是所有函数运行时的一个隐藏参数，指向函数的运行环境。

## 使用的场合
### 全局环境
在全局环境下使用this, 它指的就是顶层对象window.  
### 构造函数
构造函数里面的this, 指的是实例对象.
### 对象的方法
当 A 对象的方法被赋予 B 对象，该方法中的this就从指向 A 对象变成了指向 B 对象。所以要特别小心，将某个对象的方法赋值给另一个对象，会改变this的指向。
var obj ={
  foo: function () {
    console.log(this);
  }
};
obj.foo() // obj
obj.foo方法执行时，它内部的this指向obj。
但是，只有这一种用法（直接在obj对象上调用foo方法），this指向obj；其他用法时，this都指向代码块当前所在对象（浏览器为window对象）。
```
// 情况一
(obj.foo = obj.foo)() // window
// 情况二
(false || obj.foo)() // window
// 情况三
(1, obj.foo)() // window
```
上面代码中，obj.foo先运算再执行，即使值根本没有变化，this也不再指向obj了。这是因为这时它就脱离了运行环境obj，而是在全局环境执行.  
可以这样理解，在 JavaScript 引擎内部，obj和obj.foo储存在两个内存地址，简称为M1和M2。只有obj.foo()这样调用时，是从M1调用M2，因此this指向obj。但是，上面三种情况，都是直接取出M2进行运算，然后就在全局环境执行运算结果（还是M2），因此this指向全局环境.   

如果某个方法位于多层对象的内部，这时this只是指向当前一层的对象，而不会继承更上面的层。
var a = {
  p: 'Hello',
  b: {
    m: function() {
      console.log(this.p);
    }
  }
};
a.b.m() // undefined

等同于
var b = {
  m: function() {
   console.log(this.p);
  }
};
var a = {
  p: 'Hello',
  b: b
};
(a.b).m() // 等同于 b.m()

// 这里还需要细细考虑一下

## 使用注意点
1. 避免使用多层的this 
由于this的指向是不确定的，所以
切勿在函数中包含多层的this。
var o = {
  f1: function () {
    console.log(this);
    var f2 = function () {
      console.log(this);
    }();
  }
}
o.f1()
// Object
// Window

实际执行的是下面的代码。
var temp = function () {
  console.log(this);
};
var o = {
  f1: function () {
    console.log(this);
    var f2 = temp();
  }
}
一个解决方法是在第二层改用一个指向外层this的变量。
var o = {
  f1: function() {
    console.log(this);
    var that = this;
    var f2 = function() {
      console.log(that);
    }();
  }
}
o.f1()
// Object
// Object
上面代码定义了变量that，固定指向外层的this，然后在内层使用that，就不会发生this指向的改变。
事实上，使用一个变量固定this的值，然后内层函数调用这个变量，是非常常见的做法，有大量应用，请务必掌握。

2. 避免数组处理方法的this
数组的map和foreach方法，允许提供一个函数作为参数。这个函数内部不应该使用this。
var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    this.p.forEach(function (item) {
      console.log(this.v + ' ' + item);
    });
  }
}
o.f()
上面代码中，foreach方法的回调函数中的this，其实是指向window对象，因此取不到o.v的值。原因跟上一段的多层this是一样的，就是内层的this不指向外部，而指向顶层对象。
解决这个问题的一种方法，是使用中间变量。

var o = {
  v: 'hello',
  p: [ 'a1', 'a2' ],
  f: function f() {
    var that = this;
    this.p.forEach(function (item) {
      console.log(that.v+' '+item);
    });
  }
}
o.f()
// hello a1
// hello a2
另一种方法是将this当作foreach方法的第二个参数，固定它的运行环境。

3. 避免回调函数中的this
var o = new Object();
o.f = function () {
  console.log(this === o);
}
o.f() // true
上面代码表示，如果调用o对象的f方法，其中的this就是指向o对象。
但是，如果将f方法指定给某个按钮的click事件，this的指向就变了。
$('#button').on('click', o.f);
点击按钮以后，控制台会显示false。原因是此时this不再指向o对象，而是指向***按钮的DOM对象***，因为f方法是在按钮对象的环境中被调用的。这种细微的差别，很容易在编程中忽视，导致难以察觉的错误。
为了解决这个问题，可以采用下面的一些方法对this进行绑定，也就是使得this固定指向某个对象，减少不确定性。

## 绑定this的方法
this的动态切换，固然为JavaScript创造了巨大的灵活性，但也使得编程变得困难和模糊。有时，需要把this固定下来，避免出现意想不到的情况。JavaScript提供了call、apply、bind这三个方法，来切换/固定this的指向。

### function.prototype.call()
函数实例的call方法，可以指定函数内部this的指向（即函数执行时所在的作用域），然后在所指定的作用域中，调用该函数。
call方法的参数，应该是一个对象。如果参数为空、null和undefined，则默认传入全局对象。
如果call方法的参数是一个原始值，那么这个原始值会自动转成对应的包装对象，然后传入call方法。
call方法还可以接受多个参数。
call的第一个参数就是this所要指向的那个对象，后面的参数则是函数调用时所需的参数。

call方法的一个应用是调用对象的原生方法。
var obj = {};
obj.hasOwnProperty('toString') // false
// 覆盖掉继承的 hasOwnProperty 方法
obj.hasOwnProperty = function () {
  return true;
};
obj.hasOwnProperty('toString') // true
Object.prototype.hasOwnProperty.call(obj, 'toString') // false
上面代码中，hasOwnProperty是obj对象继承的方法，如果这个方法一旦被覆盖，就不会得到正确结果。call方法可以解决这个问题，它将hasOwnProperty方法的原始定义放到obj对象上执行，这样无论obj上有没有同名方法，都不会影响结果。

### function.prototype.apply()
apply方法的作用与call方法类似，也是改变this指向，然后再调用该函数。唯一的区别就是，它接收一个数组作为函数执行时的参数，使用格式如下。
func.apply(thisValue, [arg1, arg2, ...])
apply方法的第一个参数也是this所要指向的那个对象，如果设为null或undefined，则等同于指定全局对象。第二个参数则是一个数组，该数组的所有成员依次作为参数，传入原函数。原函数的参数，在call方法中必须一个个添加，但是在apply方法中，必须以数组形式添加。
利用这一点，可以做一些有趣的应用。
（1）找出数组最大元素
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a)
（2）将数组的空元素变为undefined
Array.apply(null, ["a",,"b"])
空元素与undefined的差别在于，数组的forEach方法会跳过空元素，但是不会跳过undefined。因此，遍历内部元素的时候，会得到不同的结果。
（3）转换类似数组的对象
利用数组对象的slice方法，可以将一个类似数组的对象（比如arguments对象）转为真正的数组。
Array.prototype.slice.apply({0:1,length:1})
// [1]
Array.prototype.slice.apply({0:1})
// []
Array.prototype.slice.apply({0:1,length:2})
// [1, undefined]
Array.prototype.slice.apply({length:1})
// [undefined]
上面代码的apply方法的参数都是对象，但是返回结果都是数组，这就起到了将对象转成数组的目的。从上面代码可以看到，这个方法起作用的前提是，被处理的对象必须有length属性，以及相对应的数字键。
（4）绑定回调函数的对象
var o = new Object();
o.f = function () {
  console.log(this === o);
}
var f = function (){
  o.f.apply(o);
  // 或者 o.f.call(o);
};
$('#button').on('click', f);
点击按钮以后，控制台将会显示true。由于apply方法（或者call方法）不仅绑定函数执行时所在的对象，还会立即执行函数，因此不得不把绑定语句写在一个函数体内。更简洁的写法是采用下面介绍的bind方法。

### function.prototype.bind()
bind方法用于将函数体内的this绑定到某个对象，然后返回一个新函数。

var add = function (x, y) {
  return x * this.m + y * this.n;
}
var obj = {
  m: 2,
  n: 2
};
var newAdd = add.bind(obj, 5);
newAdd(5)
// 20
上面代码中，bind方法除了绑定this对象，还将add函数的第一个参数x绑定成5，然后返回一个新函数newAdd，这个函数只要再接受一个参数y就能运行了。
如果bind方法的第一个参数是null或undefined，等于将this绑定到全局对象，函数运行时this指向顶层对象（在浏览器中为window）

bind方法有一些使用注意点。

1. 每一次返回一个新函数
bind方法每运行一次，就返回一个新函数，这会产生一些问题。比如，监听事件的时候，不能写成下面这样。
element.addEventListener('click', o.m.bind(o));
上面代码中，click事件绑定bind方法生成的一个匿名函数。这样会导致无法取消绑定，所以，下面的代码是无效的。
element.removeEventListener('click', o.m.bind(o));
正确的方法是写成下面这样：
var listener = o.m.bind(o);
element.addEventListener('click', listener);
//  ...
element.removeEventListener('click', listener);

2. 结合回调函数使用
回调函数是JavaScript最常用的模式之一，但是一个常见的错误是，将包含this的方法直接当作回调函数。
var counter = {
  count: 0,
  inc: function () {
    'use strict';
    this.count++;
  }
};
function callIt(callback) {
  callback();
}
callIt(counter.inc)
// TypeError: Cannot re
上面代码中，counter.inc方法被当作回调函数，传入了callIt，调用时其内部的this指向callIt运行时所在的对象，即顶层对象window，所以得不到预想结果。注意，上面的counter.inc方法内部使用了严格模式，在该模式下，this指向顶层对象时会报错，一般模式不会。
解决方法就是使用bind方法，将counter.inc绑定counter。
callIt(counter.inc.bind(counter));
counter.count // 1
还有一种情况比较隐蔽，就是某些数组方法可以接受一个函数当作参数。这些函数内部的this指向，很可能也会出错。
var obj = {
  name: '张三',
  times: [1, 2, 3],
  print: function () {
    this.times.forEach(function (n) {
      console.log(this.name);
    });
  }
};
obj.print()
上面代码中，obj.print内部this.times的this是指向obj的，这个没有问题。但是，forEach方法的回调函数内部的this.name却是指向全局对象，导致没有办法取到值。稍微改动一下，就可以看得更清楚。
解决这个问题，也是通过bind方法绑定this。

obj.print = function () {
  this.times.forEach(function (n) {
    console.log(this.name);
  }.bind(this));
};
obj.print()

3. 结合call方法使用
没太看懂.



















































