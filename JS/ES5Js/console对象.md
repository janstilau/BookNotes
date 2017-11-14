# console对象
console对象是 JavaScript 的原生对象，它有点像 Unix 系统的标准输出stdout和标准错误stderr，可以输出各种信息到控制台，并且还提供了很多有用的辅助方法。
它的常见用途:
1. 调试程序，显示网页代码运行时的错误信息。
2. 提供了一个命令行接口，用来与网页代码互动。

## 浏览器实现
工具->开发者工具
Elements：查看网页的HTML源码和CSS代码。
Resources：查看网页加载的各种资源文件（比如代码文件、字体文件、css文件等），以及在硬盘上创建的各种内容（比如本地缓存、Cookie、Local Storage等）。
Network：查看网页的 HTTP 通信情况。
Sources：查看网页加载的所有源码。
Timeline：查看各种网页行为随时间变化的情况。
Performance：查看网页的性能情况，比如 CPU 和内存消耗。
Console：用来运行 JavaScript 命令。
### console 对象的方法
#### console.log()，console.info()，console.debug()
console.log方法用于在控制台输出信息。它可以接受多个参数，将它们的结果连接起来输出。
console.log('Hello World')
// Hello World
console.log('a', 'b', 'c')
// a b c
console.log方法会自动在每次输出的结尾，添加换行符。
console.log(1);
console.log(2);
console.log(3);
// 1
// 2
// 3

如果第一个参数是格式字符串（使用了格式占位符），console.log方法将依次用后面的参数替换占位符，然后再进行输出。
console.log(' %s + %s = %s', 1, 1, 2)
//  1 + 1 = 2
console.log方法支持以下占位符，不同格式的数据必须使用对应格式的占位符。
%s 字符串
%d 整数
%i 整数
%f 浮点数
%o 对象的链接
%c CSS格式字符串

使用%c占位符时，对应的参数必须是CSS语句，用来对输出内容进行CSS渲染。
console.log(
  '%cThis text is styled!',
  'color: red; background: yellow; font-size: 24px;'
)
上面的打印, 在浏览器里面会输出黄色背景红色的24号 This text is styled. 但是在VS中没有表现出来. 如果把%c移到最后, 前面的还是没有css的输出, 如果在%c的后面添加文字, 这些%c后的文字, 会被富文本输出. 

console.log方法的两种参数格式，可以结合在一起使用。
console.log(' %s + %s ', 1, 1, '= 2')
// 1 + 1  = 2
如果参数是一个对象，console.log会显示该对象的值。
console.log({foo: 'bar'})
// Object {foo: "bar"}
console.log(Date)
// function Date() { [native code] }

console.info()和console.debug()都是console.log方法的别名，用法完全一样。只不过console.info方法会在输出信息的前面，加上一个蓝色图标。
console对象的所有方法，都可以被覆盖。因此，可以按照自己的需要，定义console.log方法。
['log', 'info', 'warn', 'error'].forEach(function(method) {
  console[method] = console[method].bind(
    console,
    new Date().toISOString()
  );
});
console.log("出错了！");
// 2014-05-18T09:00.000Z 出错了！



## console.warn(),console.error()  

warn方法和error方法也是在控制台输出信息，它们与log方法的不同之处在于，warn方法输出信息时，在最前面加一个黄色三角，表示警告；error方法输出信息时，在最前面加一个红色的叉，表示出错，同时会显示错误发生的堆栈。其他方面都一样。
上面说的红色的叉, 黄色的三角, 也都是要在浏览器环境下才会有的. 

## console.table()
对于某些复合类型的数据，console.table方法可以将其转为表格显示。
上面这个table, 也是要在浏览器的环境下才可以使用. 最后, 数据会被渲染在一个表格里面. 
var languages = [
  { name: "JavaScript", fileExtension: ".js" },
  { name: "TypeScript", fileExtension: ".ts" },
  { name: "CoffeeScript", fileExtension: ".coffee" }
];
console.table(languages);

复合型数据转为表格显示的条件是，必须拥有主键。对于数组来说，主键就是数字键。对于对象来说，主键就是它的最外层键。
var languages = {
  csharp: { name: "C#", paradigm: "object-oriented" },
  fsharp: { name: "F#", paradigm: "functional" }
};
console.table(languages);

## console.count()
count方法用于计数，输出它被调用了多少次。

## console.dir()，console.dirxml()
dir方法用来对一个对象进行检查（inspect），并以易于阅读和打印的格式显示。
该方法对于输出 DOM 对象非常有用，因为会显示 DOM 对象的所有属性。
dirxml方法主要用于以目录树的形式，显示 DOM 节点。

## console.assert()
assert方法主要用于程序运行过程中，进行条件判断，如果不满足条件，就显示一个错误，但不会中断程序执行。这样就相当于提示用户，内部状态不正确。
它接受两个参数，第一个参数是表达式，第二个参数是字符串。只有当第一个参数为false，才会提示有错误，在控制台输出第二个参数，否则不会有任何结果。

console.assert(false, '判断条件不成立')
// Assertion failed: 判断条件不成立
// 相当于
try {
  if (false) {
    throw new Error('判断条件不成立');
  }
} catch(e) {
  console.error(e);
}

## console.time()，console.timeEnd()
这两个方法用于计时，可以算出一个操作所花费的准确时间。
console.time('Array initialize');
var array= new Array(1000000);
for (var i = array.length - 1; i >= 0; i--) {
    array[i] = new Object();
};
console.timeEnd('Array initialize');

time方法表示计时开始，timeEnd方法表示计时结束。它们的参数是计时器的名称。调用timeEnd方法之后，console窗口会显示“计时器名称: 所耗费的时间”。

## console.trace()，console.clear()
console.trace方法显示当前执行的代码在堆栈中的调用路径。
console.clear方法用于清除当前控制台的所有输出，将光标回置到第一行。如果用户选中了控制台的“Preserve log”选项，网页脚本调用console.log将不起作用，但手动在控制台执行该方法依然有效。


# 命令行API__这个目录下的东西没看, 用到的时候再说.


控制台中，除了使用console对象，还可以使用一些控制台自带的命令行方法。

（1）$_

$_属性返回上一个表达式的值。

2 + 2
// 4
$_
// 4
（2）$0 - $4

控制台保存了最近5个在Elements面板选中的DOM元素，$0代表倒数第一个，$1代表倒数第二个，以此类推直到$4。

（3）$(selector)

$(selector)返回第一个匹配的元素，等同于document.querySelector()。注意，如果页面脚本对$有定义，则会覆盖原始的定义。比如，页面里面有 jQuery，控制台执行$(selector)就会采用 jQuery 的实现，返回一个数组。

（4）$$(selector)

$$(selector)返回一个选中的DOM对象，等同于document.querySelectorAll。

（5）$x(path)

$x(path)方法返回一个数组，包含匹配特定XPath表达式的所有DOM元素。

$x("//p[a]")
上面代码返回所有包含a元素的p元素。

（6）inspect(object)

inspect(object)方法打开相关面板，并选中相应的元素：DOM元素在Elements面板中显示，JavaScript对象在Profiles面板中显示。

（7）getEventListeners(object)

getEventListeners(object)方法返回一个对象，该对象的成员为登记了回调函数的各种事件（比如click或keydown），每个事件对应一个数组，数组的成员为该事件的回调函数。

（8）keys(object)，values(object)

keys(object)方法返回一个数组，包含特定对象的所有键名。

values(object)方法返回一个数组，包含特定对象的所有键值。

var o = {'p1': 'a', 'p2': 'b'};

keys(o)
// ["p1", "p2"]
values(o)
// ["a", "b"]
（9）monitorEvents(object[, events]) ，unmonitorEvents(object[, events])

monitorEvents(object[, events])方法监听特定对象上发生的特定事件。当这种情况发生时，会返回一个Event对象，包含该事件的相关信息。unmonitorEvents方法用于停止监听。

monitorEvents(window, "resize");
monitorEvents(window, ["resize", "scroll"])
上面代码分别表示单个事件和多个事件的监听方法。

monitorEvents($0, 'mouse');
unmonitorEvents($0, 'mousemove');
上面代码表示如何停止监听。

monitorEvents允许监听同一大类的事件。所有事件可以分成四个大类。

mouse：”mousedown”, “mouseup”, “click”, “dblclick”, “mousemove”, “mouseover”, “mouseout”, “mousewheel”
key：”keydown”, “keyup”, “keypress”, “textInput”
touch：”touchstart”, “touchmove”, “touchend”, “touchcancel”
control：”resize”, “scroll”, “zoom”, “focus”, “blur”, “select”, “change”, “submit”, “reset”
monitorEvents($("#msg"), "key");
上面代码表示监听所有key大类的事件。

（10）profile([name])，profileEnd()

profile方法用于启动一个特定名称的CPU性能测试，profileEnd方法用于结束该性能测试。

profile('My profile')
profileEnd('My profile')
（11）其他方法

命令行API还提供以下方法。

clear()：清除控制台的历史。
copy(object)：复制特定DOM元素到剪贴板。
dir(object)：显示特定对象的所有属性，是console.dir方法的别名。
dirxml(object)：显示特定对象的XML形式，是console.dirxml方法的别名。


## debugger语句

debugger语句主要用于除错，作用是设置断点。如果有正在运行的除错工具，程序运行到debugger语句时会自动停下。如果没有除错工具，debugger语句不会产生任何结果，JavaScript引擎自动跳过这一句。
在Chrome浏览器中，当代码运行到debugger语句时，就会暂停运行，自动打开控制台界面。
for(var i = 0; i < 5; i++){
  console.log(i);
  if (i === 2) debugger;
}
上面代码打印出0，1，2以后，就会暂停，自动打开控制台，等待进一步处理。

debugger这个语句, 在浏览器环境下有效
 




































