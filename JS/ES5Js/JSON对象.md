# JSON对象
## JSON格式
JSON 格式（JavaScript Object Notation 的缩写）是一种用于数据交换的文本格式
相比 XML 格式，JSON 格式有两个显著的优点：书写简单，一目了然；符合 JavaScript 原生语法，可以由解释引擎直接处理，不用另外添加解析代码。

简单说，每个 JSON 对象，就是一个值。要么是简单类型的值，要么是复合类型的值，但是只能是一个值，不能是两个或更多的值。这就是说，每个 JSON 文档只能包含一个值。
JSON 对值的类型和格式有严格的规定。
复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
简单类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和null（不能使用NaN, Infinity, -Infinity和undefined）。
字符串必须使用双引号表示，不能使用单引号。
对象的键名必须放在双引号里面。
数组或对象最后一个成员的后面，不能加逗号。
例如:
["one", "two", "three"]
{ "one": 1, "two": 2, "three": 3 }
{"names": ["张三", "李四"] }
[ { "name": "张三"}, {"name": "李四"} ]
以下是不合格的 JSON 值
{ name: "张三", 'age': 32 }  // 属性名必须使用双引号
[32, 64, 128, 0xFFF] // 不能使用十六进制值
{ "name": "张三", "age": undefined } // 不能使用undefined
{ "name": "张三",
  "birthday": new Date('Fri, 26 Aug 2011 07:13:10 GMT'),
  "getName": function() {
      return this.name;
  }
} // 不能使用函数和日期对象

空数组和空对象都是合格的 JSON 值，null本身也是一个合格的 JSON 值

## JSON.stringify()
JSON.stringify方法用于将一个值转为字符串。该字符串符合 JSON 格式，并且可以被JSON.parse方法还原。
JSON.stringify('abc') // ""abc""
JSON.stringify(1) // "1"
JSON.stringify(false) // "false"
JSON.stringify([]) // "[]"
JSON.stringify({}) // "{}"
JSON.stringify([1, "false", false])
// '[1,"false",false]'
JSON.stringify({ name: "张三" })

对于原始类型的字符串，转换结果会带双引号。
JSON.stringify('foo') === "foo" // false
JSON.stringify('foo') === "\"foo\"" // true
上面代码中，字符串foo，被转成了""foo""。这是因为将来还原的时候，双引号可以让 JavaScript 引擎知道，foo是一个字符串，而不是一个变量名。
如果原始对象中，有一个成员的值是undefined、函数或 XML 对象，这个成员会被过滤。
如果数组的成员是undefined、函数或 XML 对象，则这些值被转成null。
正则对象会被转成空对象。

JSON.stringify方法还可以接受一个数组，作为第二个参数，指定需要转成字符串的属性。
上面代码中，JSON.stringify方法的第二个参数指定，只转prop1和prop2两个属性。
这个类似“白名单”的数组，只对对象的属性有效，对数组无效。

JSON.stringify还可以接受第三个参数，用于增加返回的JSON字符串的可读性。如果是数字，表示每个属性前面添加的空格（最多不超过10个）；如果是字符串（不超过10个字符），则该字符串会添加在每行前面。
JSON.stringify({ p1: 1, p2: 2 }, null, 2);
/*
"{
  "p1": 1,
  "p2": 2
}"
*/
JSON.stringify({ p1:1, p2:2 }, null, '|-');
/*
"{
|-"p1": 1,
|-"p2": 2
}"
*/

## toJSON 方法
如果对象有自定义的toJSON方法，那么JSON.stringify会使用这个方法的返回值作为参数，而忽略原对象的其他属性。
var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  }
};
JSON.stringify(user)
// "{"firstName":"三","lastName":"张","fullName":"张三"}"

var user = {
  firstName: '三',
  lastName: '张',

  get fullName(){
    return this.lastName + this.firstName;
  },

  toJSON: function () {
    var data = {
      firstName: this.firstName,
      lastName: this.lastName
    };
    return data;
  }
};
JSON.stringify(user)
// "{"firstName":"三","lastName":"张"}"
JSON.stringify发现参数对象有toJSON方法，就直接使用这个方法的返回值作为参数，而忽略原对象的其他参数。

toJSON方法的一个应用是，将正则对象自动转为字符串。因为JSON.stringify默认不能转换正则对象，但是设置了toJSON方法以后，就可以转换正则对象了。
var obj = {
  reg: /foo/
};
// 不设置 toJSON 方法时
JSON.stringify(obj) // "{"reg":{}}"
// 设置 toJSON 方法时
RegExp.prototype.toJSON = RegExp.prototype.toString;
JSON.stringify(/foo/) // ""/foo/""
上面代码在正则对象的原型上面部署了toJSON方法，将其指向toString方法，因此遇到转换成JSON时，正则对象就先调用toJSON方法转为字符串，然后再被JSON.stingify方法处理。

## JSON.parse()
JSON.parse方法用于将JSON字符串转化成对象。

JSON.parse('{}') // {}
JSON.parse('true') // true
JSON.parse('"foo"') // "foo"
JSON.parse('[1, 5, "false"]') // [1, 5, "false"]
JSON.parse('null') // null

var o = JSON.parse('{"name": "张三"}');
o.name // 张三
如果传入的字符串不是有效的JSON格式，JSON.parse方法将报错。

JSON.parse("'String'") // illegal single quotes
// SyntaxError: Unexpected token ILLEGAL
上面代码中，双引号字符串中是一个单引号字符串，因为单引号字符串不符合JSON格式，所以报错。

为了处理解析错误，可以将JSON.parse方法放在try...catch代码块中。

JSON.parse方法可以接受一个处理函数，用法与JSON.stringify方法类似。

function f(key, value) {
  if (key === ''){
    return value;
  }
  if (key === 'a') {
    return value + 10;
  }
}

var o = JSON.parse('{"a":1,"b":2}', f);
o.a // 11
o.b // undefined



































