var root = this;
var breaker = {};

var
    ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype;
var
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    concat = ArrayProto.concat,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
var
    nativeForEach = ArrayProto.forEach,
    nativeMap = ArrayProto.map,
    nativeReduce = ArrayProto.reduce,
    nativeReduceRight = ArrayProto.reduceRight,
    nativeFilter = ArrayProto.filter,
    nativeEvery = ArrayProto.every,
    nativeSome = ArrayProto.some,
    nativeIndexOf = ArrayProto.indexOf,
    nativeLastIndexOf = ArrayProto.lastIndexOf,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind;

var _ = function () { };
root._ = _;

// 这里的iterator模仿array.forEach里的forEach中的闭包,需要三个参数,1element,2elementIndex,3array本身.
// 在构造函数里面,array.forEach中写this,里面的this并不能代表构造函数里新生成的对象,要在forEach的第二个参数里明确写this.可能这就是许多情况下要一个明确this是谁的参数的原因了.
var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) { // 这样几乎可以肯定obj是array了
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var keys = _.keys(obj); // obj has no length property
        for (var i = 0, length = keys.length; i < length; i++) {
            if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
        }
    }
    return obj;    
}

/*
=== breaker 是什么意思.
这其实是作者提前退出的一个标志.这个标志就用了一个框架下全局的一个对象代表的.在参数的iterator里面,如果满足提前退出的条件,就返回breaker.
因为这个each其实不一定要全部完成的,必须contains的判断,只要知道一个元素和参数相等,就该返回了.这时候,循环要有一个标志提前退出.

 // if (typeof obj.length === "number" && !isNaN(obj.length))
先说一下全等号的作用，在一般的if判断中，我们更多的是使用‘==’，这种模式比如if(2 == ‘2’)，这时候我们得到的返回结果为true，但在‘===’，这种模式下，我们得到的结果是false。这是因为全等符号是不会将比较的对象进行类型转换的。

再说一下‘+’，在此处说所起到的作用,你可以动手做一个实验，在控制台中执行下面这句话+’2’,你可以看到返回值为数字类型的2，其实不难理解，’+’号其实是将后面跟的操作数转型成了数字类型。

我们在是想一下作者这样写的目的，如果obj是一个string类型，如”abc”,我们可以拿到length属性，如果是一个function，或者一个数组，我们都可以拿到他们的length属性，但如果是一个object类型的数据，它可能是不包含length属性的。对于非数组、非字符串、非函数类型的数据，我们可以尝试使用for in循环来遍历数据。这样看来其实作者这样的写法，更是想能区分数组类型的数据或者类数组数据如字符串等
*/

_.keys = function(obj){
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) {
        if (_.has(obj, key)) keys.push(key);
    }
    return keys;
}

_.isObject = function(obj) {
    return obj === Object(obj);
}

// The Object constructor creates an object wrapper for the given value. If the value is null or undefined, it will create and return an empty object, otherwise, it will return an object of a Type that corresponds to the given value. If the value is an object already, it will return the value. 也就是说,基本类型,null,或者undefined会返回一个包装类型,但是obj类型会返回本身.

_.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
}

_.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results; 
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
    });
    return results;
}
// 这里,我们是没有办法限制iterator的.iterator理应是一个有返回值的函数,但是写一个没有返回值的也可以,不过得到undefined的数组,但不报错
/*
function(value, index, list) {
        results.push(iterator.call(context, value, index, list));
} 这个函数,在each里面充当的是iterator的角色,这里each没有调用context,因为这个函数里面没有this的操作.而map的iterator是需要制定context的,值得注意的是,函数的调用关系是不会对作用域链有影响的.push这个函数,context就是map里面的形参的context,不会因为它在map里面被调用就会先找到map里面的context.map里面的iterator调用的时候,指定context,也符合这个函数本来的context确定iterator中this的意图.
*/

_.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
        if (context) iterator = _.bind(iterator, context); // 因为原始的reduce没有指定this的参数,所以这里绑定下.
        return initial? obj.reduce(iterator, memo) : obj.reduce(iterator)
    }
    each(obj, function(value, index, list){
        if (!initial) {
            memo = value;
            initial = true; // 优雅...
        } else {
            memo = iterator.call(context, memo, value, index, list);
        }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
}

// 没细看
_.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
        if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
        ctor.prototype = func.prototype;
        var self = new ctor;
        ctor.prototype = null;
        var result = func.apply(self, args.concat(slice.call(arguments)));
        if (Object(result) === result) return result;
        return self;
    };
};
