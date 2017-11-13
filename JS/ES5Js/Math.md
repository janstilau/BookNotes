# Math对象
## 概述
Math是JavaScript的内置对象，提供一系列数学常数和数学方法。该对象不是构造函数，不能生成实例，所有的属性和方法都必须在Math对象上调用。

## 属性
Math.E：常数e。
Math.LN2：2的自然对数。
Math.LN10：10的自然对数。
Math.LOG2E：以2为底的e的对数。
Math.LOG10E：以10为底的e的对数。
Math.PI：常数Pi。
Math.SQRT1_2：0.5的平方根。
Math.SQRT2：2的平方根。

Math.E // 2.718281828459045
Math.LN2 // 0.6931471805599453
Math.LN10 // 2.302585092994046
Math.LOG2E // 1.4426950408889634
Math.LOG10E // 0.4342944819032518
Math.PI // 3.141592653589793
Math.SQRT1_2 // 0.7071067811865476
Math.SQRT2 // 1.4142135623730951

## 方法
Math对象提供以下一些数学方法
Math.abs()：绝对值
Math.ceil()：向上取整
Math.floor()：向下取整
Math.max()：最大值
Math.min()：最小值
Math.pow()：指数运算
Math.sqrt()：平方根
Math.log()：自然对数
Math.exp()：e的指数
Math.round()：四舍五入
Math.random()：随机数

### random()
Math.random()返回0到1之间的一个伪随机数，可能等于0，但是一定小于1。
生成任意范围的随机数函数如下:
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

### 三角函数方法
Math对象还提供一系列三角函数方法。
Math.sin()：返回参数的正弦
Math.cos()：返回参数的余弦
Math.tan()：返回参数的正切
Math.asin()：返回参数的反正弦（弧度值）
Math.acos()：返回参数的反余弦（弧度值）
Math.atan()：返回参数的反正切（弧度值）




















