# Elements of Programming

When we describe a language, we should pay particular attention to the means that the language provides for combining simple ideas to form more complex ideas. Every powerful language has three such mechanisms:
1. primitive expressions and statements, which represent the simplest building blocks that the language provides,
1. means of combination, by which compound elements are built from simpler ones, and
1. means of abstraction, by which compound elements can be named and manipulated as units.


In programming, we deal with two kinds of elements: functions and data. (Soon we will discover that they are really not so distinct.) Informally, data is stuff that we want to manipulate, and functions describe the rules for manipulating the data.Thus, any powerful programming language should be able to describe primitive data and primitive functions, as well as have some methods for combining and abstracting both functions and data.
这里所说的function, 不只是函数, 而且也包括运算符. 其实运算符就可以认为是一个 语言级别提供的函数而已.

A expression describes a computation and evaluates to a value.
All expressions can use function call notation.

Evaluation procedure for call expression:
operator give us a function, and operand give us a value.
1. evaluate the operator and then the operand subexpressions
1. 


























