# node.js的模块仓库npm大部分运用CommonJS格式
## CommonJS
CommonJS制定了解决这些问题的一些规范，而Node.js就是这些规范的一种实现。Node.js自身实现了require方法作为其引入模块的方法，同时NPM也基于CommonJS定义的包规范，实现了依赖管理和模块自动安装等功能。这里我们将深入一下Node.js的require机制和NPM基于包规范的应用。
在Node.js中，定义一个模块十分方便。我们以计算圆形的面积和周长两个方法为例，来表现Node.js中模块的定义方式。
var PI = Math.PI;
exports.area = function (r) {
    return PI * r * r;
};
exports.circumference = function (r) {
    return 2 * PI * r;
};
将这个文件存为circle.js，并新建一个app.js文件，并写入以下代码：
var circle = require('./circle.js');
console.log( 'The area of a circle of radius 4 is ' + circle.area(4));

从这里, 我们看到, 最后输出的是exports这个对象, 如果我们在js文件里面定义了一个对象, 然后用这个对象把exports覆盖了, 那么这个对象就是输出对象了. 
在require了这个文件之后，定义在exports对象上的方法便可以随意调用。Node.js将模块的定义和调用都封装得极其简单方便，从API对用户友好这一个角度来说，Node.
Node.js的模块分为两类，一类为原生（核心）模块，一类为文件模块。原生模块在Node.js源代码编译的时候编译进了二进制执行文件，加载的速度最快。另一类文件模块是动态加载的，加载速度比原生模块慢。但是Node.js对原生模块和文件模块都进行了缓存，于是在第二次require时，是不会有重复开销的。其中原生模块都被定义在lib这个目录下面，文件模块则不定性。

加载文件模块的工作，主要由原生模块module来实现和完成，该原生模块在启动时已经被加载，进程直接调用到runMain静态方法。
// bootstrap main module.
Module.runMain = function () {
    // Load the main module--the command line argument.
    Module._load(process.argv[1], null, true);
};// 也就是我们在打node someapp.js 的时候的操作 .

实际上在文件模块中，又分为3类模块。这三类文件模块以后缀来区分，Node.js会根据后缀名来决定加载方法。
.js。通过fs模块同步读取js文件并编译执行。
.node。通过C/C++进行编写的Addon。通过dlopen方法进行加载。
.json。读取文件，调用JSON.parse解析加载。

require方法实际调用的就是load方法. load方法在载入、编译、缓存了module后，返回module的exports对象。这就是circle.js文件中只有定义在exports对象上的方法才能被外部调用的原因。

### require方法接受以下几种参数的传递：
http、fs、path等，原生模块。
./mod或../mod，相对路径的文件模块。
/pathtomodule/mod，绝对路径的文件模块。
mod，非原生模块的文件模块。

## CommonJS 规范的包结构
* 一个package.json文件应该存在于包顶级目录下
* 二进制文件应该包含在bin目录下
* JavaScript代码应该包含在lib目录下
* 文档应该在doc目录下。
* 单元测试应该在test目录下。



## 分析require语句
这种格式的核心就是 require 语句，模块通过它加载。学习 Node.js ，必学如何使用 require 语句。本文通过源码分析，详细介绍 require 语句的内部运行机制，帮你理解 Node.js 的模块机制。   

require 语句的内部逻辑
`
当 Node 遇到 require(X) 时，按下面的顺序处理。
（1）如果 X 是内置模块（比如 require('http'）) 
　　a. 返回该模块。 
　　b. 不再继续执行。
（2）如果 X 以 "./" 或者 "/" 或者 "../" 开头 
　　a. 根据 X 所在的父模块，确定 X 的绝对路径。 
　　b. 将 X 当成文件，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
X
X.js
X.json
X.node
　　c. 将 X 当成目录，依次查找下面文件，只要其中有一个存在，就返回该文件，不再继续执行。
X/package.json（main字段）
X/index.js
X/index.json
X/index.node
（3）如果 X 不带路径 
　　a. 根据 X 所在的父模块，确定 X 可能的安装目录。 
　　b. 依次在每个目录中，将 X 当成文件名或目录名加载。
（4） 抛出 "not found"
`

require 的源码在 Node 的 lib/module.js 文件。
