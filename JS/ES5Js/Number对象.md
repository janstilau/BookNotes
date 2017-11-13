# Number对象
## 概述.
作为构造函数时，它用于生成值为数值的对象。
工具函数时，它可以将任何类型的值转为数值。
var n = new Number(1);
typeof n // "object"
Number(true) // 1

## Number对象的属性
```
Number.POSITIVE_INFINITY：正的无限，指向Infinity。
Number.NEGATIVE_INFINITY：负的无限，指向-Infinity。
Number.NaN：表示非数值，指向NaN。
Number.MAX_VALUE：表示最大的正数，相应的，最小的负数为-Number.MAX_VALUE。
Number.MIN_VALUE：表示最小的正数（即最接近0的正数，在64位浮点数体系中为5e-324），相应的，最接近0的负数为-Number.MIN_VALUE。
Number.MAX_SAFE_INTEGER：表示能够精确表示的最大整数，即9007199254740991。
Number.MIN_SAFE_INTEGER：表示能够精确表示的最小整数，即-9007199254740991。
```

## Number对象实例方法
Number对象有4个实例方法，都跟将数值转换成指定格式有关。
### Number.prototype.toString()
Number对象部署了自己的toString方法，用来将一个数值转为字符串形式。
toString方法可以接受一个参数，表示输出的进制。如果省略这个参数，默认将数值先转为十进制，再输出字符串；否则，就根据参数指定的进制，将一个数字转化成某个进制的字符串。
### Number.prototype.toFixed()
toFixed方法用于将一个数转为指定位数的小数，返回这个小数对应的字符串。
(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
toFixed方法的参数为指定的小数位数，有效范围为0到20，超出这个范围将抛出RangeError错误。
### Number.prototype.toExponential()
toExponential方法用于将一个数转为科学计数法形式。
### Number.prototype.toPrecision()
toPrecision方法用于将一个数转为指定位数的有效数字



