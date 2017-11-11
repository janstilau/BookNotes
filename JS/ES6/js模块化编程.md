# 模块化编程

模块, 就是实现特定功能的一组方法.   
只要把不同的函数(以及记录状态的变量)简单的放在一起, 就算做是一个模块. 
如果, 全部写在一起, 就会污染全局变量, 无法保证不与其他模块发生变量名的冲突, 而且, 模块之间看不出分隔, 所有的代码都挤在一个文件中. 

## 对象写法
把模块写成一个对象, 所有的模块成员都放在这个对象里面. 
var module_a = {
    _count: 0,
    m1: function() {
    },
    m2: function() {
    }
}
那么, 使用的时候, 就是调用这个对象的属性. 
这样写的缺点, 就是不会暴露所有的模块成员, 内部状态可以被外部改写. 

## 立即执行函数写法  
var module1 = (function(){
　　　　var _count = 0;
　　　　var m1 = function(){
　　　　　　//...用到了_count
　　　　};
　　　　var m2 = function(){
　　　　　　//...用到了_count
　　　　};
　　　　return {
　　　　　　m1 : m1,
　　　　　　m2 : m2
　　　　};
　　})();
这样写, 还是返回一个对象, 但是这个对象里面的成员是都是函数, 而函数用到的成员变量, 是隐藏在生成它的函数里面的, 外界访问不到. 


## 放大模式 
var module1 = (function (mod){
　　　　mod.m3 = function () {
　　　　　　//...
　　　　};
　　　　return mod;
　　})(module1);
这个方法就是将模块传入, 然后给模块增加一个新的方法, 然后返回. 

## 宽放大模式 
在浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上一节的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"。
var module1 = ( function (mod){
　　　　//...
　　　　return mod;
　　})(window.module1 || {});
这样写的写法, 就是可以是空对象传入.

## 明确的将全局变量作为输入参数
从上面我们可以看出, 模块化模块化, 最后我们得到的, 是一个对象, 而这个对象里面, 包含着我们在定义模块的时候, 编写的方法代码. 想要调用这些代码, 直接用模块对象调用. 
独立性是模块的重要特点，模块内部最好不与程序的其他部分直接交互。
如果, 要在模块内调用全局变量, 必须显示的将其他变量输入到模块内部.
var module1 = (function ($, YAHOO) {
　　　　//...
　　})(jQuery, YAHOO);


# 模块的规范 

## CommonJs
在CommonJS中，有一个全局性方法require()，用于加载模块。
由于一个重大的局限，使得CommonJS规范不适用于浏览器环境.
var math = require('math');
　　math.add(2, 3);
第二行math.add(2, 3)，在第一行require('math')之后运行，因此必须等math.js加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。
这对服务器端不是一个问题，因为所有的模块都存放在本地硬盘，可以同步加载完成，等待时间就是硬盘的读取时间。但是，对于浏览器，这却是一个大问题，因为模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。
浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是AMD规范诞生的背景。

## AMD'Asynchronous'
它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。
AMD也采用require()语句加载模块，但是不同于CommonJS，它要求两个参数：
require([module], callback);
第一个参数[module]，是一个数组，里面的成员就是要加载的模块；第二个参数callback，则是加载成功之后的回调函数。如果将前面的代码改写成AMD形式，就是下面这样：
require(['math'], function (math) {
　　　　math.add(2, 3);
　　});
math.add()与math模块加载不是同步的，浏览器不会发生假死。所以很显然，AMD比较适合浏览器环境。

# require.js
## 什么是require.js
最早的时候，所有Javascript代码都写在一个文件里面，只要加载这一个文件就够了。后来，代码越来越多，一个文件不够了，必须分成多个文件，依次加载。下面的网页代码，相信很多人都见过。
　　<script src="1.js"></script>
　　<script src="2.js"></script>
　　<script src="3.js"></script>
　　<script src="4.js"></script>
　　<script src="5.js"></script>
　　<script src="6.js"></script>
这段代码依次加载多个js文件。
这样的写法有很大的缺点。首先，加载的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长；其次，由于js文件之间存在依赖关系，因此必须严格保证加载顺序（比如上例的1.js要在2.js的前面），依赖性最大的模块一定要放到最后加载，当依赖关系很复杂的时候，代码的编写和维护都会变得困难。

* 而require.js的作用则在于:
    1. 实现js文件的异步加载, 避免网页失去响应
    2. 管理模块之间的依赖性, 便于代码的编写和维护  


<script src="js/require.js"></script>
有人可能会想到，加载这个文件，也可能造成网页失去响应。解决办法有两个，一个是把它放在网页底部加载，另一个是写成下面这样：
　　<script src="js/require.js" defer async="true" ></script>
async属性表明这个文件需要异步加载，避免网页失去响应。IE不支持这个属性，只支持defer，所以把defer也写上。
加载require.js以后，下一步就要加载我们自己的代码了。假定我们自己的代码文件是main.js，也放在js目录下面。那么，只需要写成下面这样就行了：
　　<script src="js/require.js" data-main="js/main"></script>
data-main属性的作用是，指定网页程序的主模块。在上例中，就是js目录下面的main.js，这个文件会第一个被require.js加载。由于require.js默认的文件后缀名是js，所以可以把main.js简写成main。    
也就是说, html里面, 仅仅写上上面的src="js/require.js"的语句, 然后在require.js加载完成之后, 会自动去加载require.js, 执行里面的代码. 
## main.js怎么写
　// main.js
　　require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
　　　　// some code here
　　});
















