# Class的定义

## 写法  

class Person {
    constructor() {
        this.x = 1
        this.y = 2
    }

    toString() {
        
    }
}

这样的写法, 其实还是用的之前ES5的protoType. 也就是说, toString 和 constructor 其实还是定义在了Person的prototype 之上, 而在constructor上面给this赋值的x, y是定义在了Person的实例之上了. 用typeof 观察Person 的话, 会发现返回的是'function', 而Person的实例的constructor === Person, 也就是说, class 的这种形式, 是在书写的内容上向别的语言进行找齐, 但是实现的思路, 还是按照js原来的思想, class 这种写法, 也就是一个语法糖这样的东西.  

class 里面, 定义的方法, 都是不可枚举的, 定义的方法之前没有逗号分割, 也就是Person.keys里面是不返回的, 不能进行遍历的. 
可以通过Object.assign方法, 给Person.prototype进行赋值   
Object.assign(Person.prototype, {
    saySth() {
        console.log('say sth');
    }, // 这里的逗号是必须的.
    sayAnyth() {
        console.log('sayAnyth');
    }
});

class 定义的Person, 想要使用, 必须要用new. 之前ES5的版本, 构造函数 Person, 可以直接Person() 这样调用, 没有new, 就是调用Person() 里面的函数体, 但是用class 这样写, 不可以缺少new进行调用, 会报错.  

对于继承, js中只有实现继承, 没有接口继承, 因为js中函数没有函数签名.而js中的继承本质是重写原型对象, 代之以一个新类型的实例. 也就是, 父类的实例成为了子类的原型, 而父类中的所有的属性和方法, 成为了子类原型中的一部分, 也可以被子类使用了. 

对于代码提升, 代码提升就是引擎将代码从出现位置, 提升到作用域的最开始的位置. 例如var, function, 还有构造函数等关键字定义的变量和函数, 这些不是通过字面量定义的, 会首先被引擎扫描, 然后统一在代码执行之前进行执行. 所以, 代码提升会改变这些代码的执行时机. 但是class没有被代码提升. 因为继承的现在有了class B extends A{} 这种形式了, 而这种形式, 一定要先知道A类才可以. 之前的原型链的形式, 是在定义完构造函数之后, 在构造函数之后在用赋值的形式, 将一个父类的实例赋值成为子类的prototype, 这个操作是实现继承的关键, 但是这是一个不会代码提升的语句, 所以不用担心在代码提升之前执行有关继承的操作引起各种问题. 

// 原型的搜索机制 : 读取一个实例属性的时候, 首先会实例中搜索, 然后在原型中, 然后搜索原型中的原型. instanceOf的机制是什么, 测试实例与原型链中出现过的构造函数. 

### 私有方法.   
私有方法, 在es6中不存在, 可以通过变通方法实现.  
1. 通过命名
class widget {
    foo (baz) {
        this._bar(baz);
    }

    _bar(baz) {
        return this.snaf = baz;
    }
}
// 这里通过下划线, 来表示这是一个私有方法, 不够这是程序员之间的规范, 并不能保证类外不会调用到这个方法.   
 
2.  另外一种方法就是将私有方法移除模块, 因为模块内部的所有方法都是对外可见的.  
class Widget {
  foo (baz) {
    bar.call(this, baz);
    // 这里调用了bar.call(this, baz). 
  }
  // ...
}
function bar(baz) {
  return this.snaf = baz;
}

3. 通过Symbol关键字.  

### 私有属性  
还有没正式的规定, 有个提案是用#标示.  

### this的指向
类的方法内部如果含有this, 它默认指向类的实例. 
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }
  print(text) {
    console.log(text);
  }
}
const logger = new Logger();
const { printName } = logger; 
// 这里是什么意思, 对象的结构赋值. 具体在第二节内容. 结构的手, 数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值.对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者. 前者是匹配的模式, 后者才是真正的变量, 如果只有前者, 那么系统会自动创建一个和前者相同的后者. 所以, 看起来才像是前者被赋值了. 
printName();
上面代码中，printName方法中的this，默认指向Logger类的实例。但是，如果将这个方法提取出来单独使用，this会指向该方法运行时所在的环境，因为找不到print方法而导致报错. 
    * 一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了。
    * 另一种解决方法是使用箭头函数 -- > 箭头函数的定义在函数一章. 

### name属性 name属性总是返回紧跟在class关键字后面的类名.  

### get and set 方法.    
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}
prop属性有对应的存值函数和取值函数，因此赋值和读取行为都被自定义了. 存值函数和取值函数是设置在属性的 Descriptor 对象上的。








