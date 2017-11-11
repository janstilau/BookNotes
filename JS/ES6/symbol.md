# symbol 
## symbol 的含义
symbol引入, 就是为了表示一个独一无二的值. 它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。
Symbol 值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 Symbol 类型。凡是属性名属于 Symbol 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。
Symbol 是一个原始类型的值，不是对象。也就是说，由于 Symbol 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型
Symbol函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。这个参数, 仅仅是为了描述用的, 相同的字符串创建两个symbol, 这两个symbol不相同. 
Symbol 值不能与其他类型的值进行运算，会报错。
// ${sym}` 这是什么

## 作为属性名的symbol
由于每一个 Symbol 值都是不相等的，这意味着 Symbol 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖. 
Symbol 值作为对象属性名时，不能用点运算符. 
```
    let mySymbol = Symbol();
    // 第一种写法
    let a = {};
    a[mySymbol] = 'Hello!';
    // 第二种写法
    let a = {
    [mySymbol]: 'Hello!'
    };
    // 第三种写法
    let a = {};
    Object.defineProperty(a, mySymbol, { value: 'Hello!' });
    // 以上写法都得到同样结果
    a[mySymbol] // "Hello!"
```
上面代码中，因为点运算符后面总是字符串，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。
在对象的内部，使用 Symbol 值定义属性时，Symbol 值必须放在方括号之中, 如果, symbol的值没有放在方括号中, 那么这个属性的键名就是字符串, 而不是s所代表的symbol的值, 这和.之后直接写symbol是一样的.  

### 实例_消除魔术字符串
魔术字符串指的是，在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。风格良好的代码，应该尽量消除魔术字符串，改由含义清晰的变量代替。
常用的消除魔术字符串的方法，就是把它写成一个变量。
const shapeType = {
  triangle: 'Triangle'
};
仔细分析，可以发现shapeType.triangle等于哪个值并不重要，只要确保不会跟其他shapeType属性的值冲突即可. 因此, 这里就很适合用Symbol值. 

### 属性名的遍历  
Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。
Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。仅仅是symbol类型的值. 
一个新的API，Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名. 
由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。



### Symbol.for(), Symbol.keyFor()
#### symbol.for()
我们希望重新使用同一个 Symbol 值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值.  
Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会先检查给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat")30次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30次，会返回30个不同的 Symbol 值。
由于Symbol() 的写法没有登记机制, 所以每次调用的返回, 都是一个不同的值. 
#### symbol.keyfor()
Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
这里, 可以看出来, symbol()函数, 本身返回一个symbol类型的变量, 但是这个变量算成是没有被登记的变量. 在keyfor函数里面, 返回的是undefined.  

