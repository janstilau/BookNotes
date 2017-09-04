
//
//  UnderScore.h
//  BookNotes
//
//  Created by jansti on 2017/9/4.
//  Copyright © 2017年 jansti. All rights reserved.
//

#ifndef UnderScore_h
#define UnderScore_h
/*
 
 _ 是一个function,然后root._ = _. root被初始化为this,this是window对象.于是,window对象里面就有一个_属性了.
 然后_.each = _.forEach = function(obj, iterator, context) {
 }
 就为_添加了许许多多的方法,而在用underScore的时候就可以直接
 _.each()这样进行操作了.
 
 this https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
 
 global context 环境下,this指的是global object.在浏览器环境下就是window对象了.
 function context 环境下. depend how the function called.
 在非严格模式下,this 指的是global object.
 在strict mode, if this was not defined by the execution context, it remains undefined.
 To pass the value of this from one context to another, use call, or apply:
 Where a function uses the this keyword in its body, its value can be bound to a particular object in the call using the call or apply methods which all functions inherit from Function.prototype.
 
 
 js的函数有着太大的灵活性.比如,array.forEach,里面可以传入遍历的方法,但是,js里面方法
 可以随便传,并没有方法签名的限制.比如,forEach要求的方法,是要有三个形参的方法,第一个是
 ele(遍历的当前元素),第二个是index(当前元素的index),第三个是array(遍历的数组).但是
 我们可以传入一个alert函数.传入alert,alert仅仅需要一个参数,也就是只有ele会被传进去.
 但是没有问题.因为js里面的函数不在乎.
 在js里面,传入多少参数,arguments里面就塞入多少参数.
 比如一个函数 sayhi(a,b,c), sayhi(1)
 a:1, b:undefined, c:undefined, arguments:0:1, callee, length, __proto__
 sayhi(1,2,3,4,5,6)
 a:1, b:2, c:3, arguments:0:1,1:2,2:3,3:4,4:5,5:6,callee,length,__proto__
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
*/
#endif /* UnderScore_h */
