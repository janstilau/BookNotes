# 缩进 
tab或者空格, JS6中用了两个空格这种
# 区块
总是使用大括号表示区块, 包括只有一行代码的if, while, dowhile
起首的大括号跟在关键字的后面。
block {
  // ...
}
JS中选用的这一种, 因为JavaScript会自动添加句末的分号，导致一些难以察觉的错误。
return
{
  key: value
};
// 相当于
return;
{
  key: value
};
# 圆括号
圆括号（parentheses）在JavaScript中有两种作用，一种表示函数的调用，另一种表示表达式的组合（grouping）。
// 圆括号表示函数的调用
console.log('abc');
// 圆括号表示表达式的组合
(1 + 2) * 3
表示函数调用时，函数名与左括号之间没有空格。
表示函数定义时，函数名与左括号之间没有空格。
其他情况时，前面位置的语法元素与左括号之间，都有一个空格。
按照上面的规则，下面的写法都是不规范的。
foo (bar)
return(a+b);
if(a === 0) {...}
function foo (b) {...}
function(x) {...}
上面代码的最后一行是一个匿名函数，function是语法关键字，不是函数名，所以与左括号之间应该要有一个空格。

# 行尾的分号
最好不省略

# 全局变量
JavaScript最大的语法缺点，可能就是全局变量对于任何一个代码块，都是可读可写。这对代码的模块化和重复使用，非常不利。
因此，避免使用全局变量。如果不得不使用，用大写字母表示变量名，比如UPPER_CASE。

# 变量声明
由于变量提升, 最好将所有的变量声明, 放在函数的最前面.

# new命令
JavaScript使用new命令，从构造函数生成一个新对象。
var o = new myObject();
上面这种做法的问题是，一旦你忘了加上new，myObject()内部的this关键字就会指向全局对象，导致所有绑定在this上面的变量，都变成全局变量。
因此，建议使用Object.create()命令，替代new命令。如果不得不使用new，为了防止出错，最好在视觉上把构造函数与其他函数区分开来。比如，构造函数的函数名，采用首字母大写（InitialCap），其他函数名一律首字母小写。

# 不要使用with语句
# 只使用“严格相等”（===）运算符
# 不要将不同目的的语句，合并成一行。
# 自增（++）和自减（--）运算符尽量使用+=和-=代替
# switch…case结构
switch...case结构要求，在每一个case的最后一行必须是break语句，否则会接着运行下一个case。这样不仅容易忘记，还会造成代码的冗长。

而且，switch...case不使用大括号，不利于代码形式的统一。此外，这种结构类似于goto语句，容易造成程序流程的混乱，使得代码结构混乱不堪，不符合面向对象编程的原则。

function doAction(action) {
  switch (action) {
    case 'hack':
      return 'hack';
      break;
    case 'slash':
      return 'slash';
      break;
    case 'run':
      return 'run';
      break;
    default:
      throw new Error('Invalid action.');
  }
}
上面的代码建议改写成对象结构。

function doAction(action) {
  var actions = {
    'hack': function () {
      return 'hack';
    },
    'slash': function () {
      return 'slash';
    },
    'run': function () {
      return 'run';
    }
  };

  if (typeof actions[action] !== 'function') {
    throw new Error('Invalid action.');
  }

  return actions[action]();
}
建议避免使用switch...case结构，用对象结构代替