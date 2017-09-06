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

var _ = function() {};
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
在后面,filter在调用each的时候,传入each的函数, 没有返回breaker,而any传入each的函数,返回breaker.
到底提不提前结束,是each的调用者决定的.

 // if (typeof obj.length === "number" && !isNaN(obj.length))
先说一下全等号的作用，在一般的if判断中，我们更多的是使用‘==’，这种模式比如if(2 == ‘2’)，这时候我们得到的返回结果为true，但在‘===’，这种模式下，我们得到的结果是false。这是因为全等符号是不会将比较的对象进行类型转换的。

再说一下‘+’，在此处说所起到的作用,你可以动手做一个实验，在控制台中执行下面这句话+’2’,你可以看到返回值为数字类型的2，其实不难理解，’+’号其实是将后面跟的操作数转型成了数字类型。

我们在是想一下作者这样写的目的，如果obj是一个string类型，如”abc”,我们可以拿到length属性，如果是一个function，或者一个数组，我们都可以拿到他们的length属性，但如果是一个object类型的数据，它可能是不包含length属性的。对于非数组、非字符串、非函数类型的数据，我们可以尝试使用for in循环来遍历数据。这样看来其实作者这样的写法，更是想能区分数组类型的数据或者类数组数据如字符串等
*/

_.keys = function(obj) {
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
        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator)
    }
    each(obj, function(value, index, list) {
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

// If such an element is found, some() immediately returns true.  This is why each function need to check the breaker return value.
// 这里,如果是array类型的,就调用array的some函数,不然就调用作者写的each,some函数中应该有着条件满足就停止遍历的控制,而作者写的each函数中,除了模拟系统的forEach之外,又添加了控制中断的breaker.在调用each的闭包里面,如果当前的功能需要提前退出,就返回breaker,让each可以提前退出.
// https://stackoverflow.com/questions/21927413/why-is-this-extra-check-necessary-in-if-condition/21929746 why in the if condition has a first result check 简单来说,因为原生的forEach没有短路机制,所以它会运转到最后的一个元素,第一个result 就是为了在obj是array的时候,立即停止遍历.

var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identify); // set predicate if predicate is null
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) {
        return obj.some(predicate, context)
    };
    each(obj, function(value, index, list) {
        if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result; // 第一次取反是将result变化成为boolean值,第二次取反是回归result的本意.因为弱类型,直接将result返回的话,返回的是result的原始类型.
}

_.identify = function(value) {
    return value;
}

_.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
        return value === target;
    });
}

_.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
        if (predicate.call(context, value, index, list)) {
            result = value;
            return true;
        }
    });
    // 这里为什么不直接用any return any(obj, predicate, context) . 因为any返回的是一个boolean值,而find返回的是value值.直接调用所以,这里传给any的闭包中,加了一下对于返回值赋值的处理逻辑.
    return result;
};

_.filter = _.select = function(obj, predicate, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
        each(obj, function(value, index, list) {
            if (predicate.call(context, value, index, list)) results.push(value);
        });
        return results;
    }
    /*
    想象一下,如果没有闭包技术这个东西应该怎么写.首先,predicate是一个函数,each里面的那个闭包是个函数,each又是一个闭包.
    id results
    predicate(id value, int index, id obj);
    each(id obj, void(*action)(id value, int index, id obj))
    eachInFunc(id value, int index, id obj) {if (predicate)(value, index, obj) results.append}
    如果我们要写出闭包的那种效果.
    首先each和eachInnner是同函数签名的函数,为了能保持这个函数签名,predicate和results就得是全局变量.实际上,block捕获的意义,也就是让这两个东西变成了类全局变量的东西.
    于是,交给each的应该是eachInFunc这样的一个函数指针,这个函数指针里面,调用了predicate这个函数,根据返回值操作了results这个类全局变量.如果我们要用C风格的代码实现上面的代码,是很痛苦的事情.
    但是应该记住的是,闭包,就是捕获加函数指针,无论怎么优雅,都要有着函数代码的存在.也就是说,写一个闭包,就要有一个二进制函数在函数区里面躺着.
    !!! https://www.zhihu.com/question/19801131/answer/17156023 知乎,回调函数是什么
    里面讲到,在把funciton当做first class 的语言,是可以将代码整体当做数据存储在闭包对象里的,这和oc的实现是不太一样的.
     */

_.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(predicate), context);
};
_.negate = function(predicate) {
    return function() {
        return !predicate.apply(this, arguments);
    }
};
/*
negate难理解的地方在于,他省略了很多的东西,如果用下面的方式,就明了很多了.
_.negate = function(bool( * action)(id value, int index, id array)) {
    return ^(bool)(id value, int index, id array) {
        return !action(value, index, array);
    }
}
*/

_.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identify);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
        // if (!result || !(result = predicate.call(context, value, index, list))) return breaker;
        // 上面是正常的逻辑,下面是精简之后的逻辑.可能是为了代码简练,但是不容易阅读.里面运用了&&的短路机制.
        if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
}

_.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
        return (isFunc ? method : value[method]).apply(value, args);
    });
};

_.isFunction = function(obj) {
    return typeof obj === 'function';
}

_.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
};

_.property = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};

// https://stackoverflow.com/questions/7452341/what-does-void-0-mean void 0 mean
/* 回答的意思是,undefined,是一个全局对象的属性,可以被更改,或者,当你定义了一个名字为undefined的变量并且赋值之后,这个undefined就是那个新值了.
    而void是一个keyword,它接受一个参数并且永远永远返回最初的那个undefined的那个值.
*/


_.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
}

_.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
};

_.matches = function(attrs) {
    return function(obj) {
        if (obj === attrs) { return true; }
        for (var key in attrs) {
            if (attrs[key] !== obj[key]) {
                return false;
            }
        }
        return true;
    }
};

_.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
};

_.max = function(obj, iterator, context) {
    var result = -Infinity,
        lastComputed = -Infinity,
        value, computed;
    if (!iterator && _.isArray(obj)) {
        for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value > result) {
                result = value;
            }
        }
    } else {
        each(obj, function(value, index, list) {
            computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed > lastComputed) {
                result = value;
                lastComputed = computed;
            }
        });
    }
    return result;
};

_.min = function(obj, iterator, context) {
    var result = Infinity,
        lastComputed = Infinity,
        value, computed;
    if (!iterator && _.isArray(obj)) {
        for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value < result) {
                result = value;
            }
        }
    } else {
        each(obj, function(value, index, list) {
            computed = iterator ? iterator.call(context, value, index, list) : value;
            if (computed < lastComputed) {
                result = value;
                lastComputed = computed;
            }
        });
    }
    return result;
};

_.random = function(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};

_.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
        rand = _.random(index++);
        shuffled[index - 1] = shuffled[rand];
        shuffled[rand] = value;
    });
    return shuffled;
};

_.sample = function(obj, n, guard) {
    if (n == null || guard) {
        if (obj.length !== +obj.length) obj = _.values(obj);
        return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
};

var lookupIterator = function(value) {
    if (value == null) return _.identify;
    if (_.isFunction(value)) return value;
    return _.property(value);
}


// 首先,根据map函数把原来的数组或者对象的各个属性进行了一次copy操作,不过新的数组里面,存了原始值,原始的index值以及原始值根据iteraotr算法计算出来的排序所用的标准值.
// 然后,进行sort操作. 最后根据pluck操作,把原始值抽取出来.
_.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var copyArray = _.map(obj, function(value, index, list) {
        return {
            value: value,
            index: index,
            criteria: iterator.call(context, value, index, list)
        };
    });
    copyArray.sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
            if (a > b || a === void 0) return 1;
            if (a < b || b === void 0) return -1; // why check void 0
        }
        return left.index - right.index;
    });

    return _.pluck(copyArray, 'value');
};

// group 的思路 --> iterator是计算每个value的划分group的值的,在each里面,计算出每个value的groupBy值,然后将这个值,value,交给分组函数处理.分组函数根据groupBy值,操作result数据.
var group = function(behavior) {
    return function(obj, iterator, context) {
        var result = {};
        iterator = lookupIterator(iterator);
        each(obj, function(value, index) {
            var key = iterator.call(context, value, index, obj);
            behavior(result, key, value);
        });
        return result;
    };
};

_.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
});

_.indexBy = group(function(result, key, value) {
    result[key] = value;
});

_.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
});

_.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator); // if the iterator is null, lookupIteraotor will return a function which just return the value.
    var low = 0,
        hight = array.length;
    while (low <= hight) {
        var mid = (low + high) >>> 1;
        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
}

_.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
};

_.identity = function(value) {
    return value;
};

_.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
};

_.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
};

_.initial = function(array, n) {
    return slice.call(array, 0, array.length - ((n == null) ? 1 : n));
};

_.last = function(array, n) {
    if (array == null) return void 0;
    if ((n == null)) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
}

_.rest = _.tail = _.drop = function(array, n) {
    return slice.call(array, (n == null) ? 1 : n);
};

_.compact = function(array) {
    return _.filter(array, _.identity);
};

var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
        return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
        var value = input[i];
        if (!_.isArray(value) && !_.isArguments(value)) {
            if (!strict) output.push(value);
        } else if (shallow) {
            push.apply(output, value);
        } else {
            flatten(value, shallow, strict, output);
        }
    }
    return output;
};

_.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value) {
        return _.contains(rest, value);
    });
};

_.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
};

_.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
}

_.partition = function(obj, predicate, context) {
    predicate = lookupIterator(predicate);
    var pass = [],
        fail = [];
    each(obj, function(ele){
        (predicate.call(context, ele) ? pass: fail).push(ele);
    });

    return [pass, fail];
}

_.isArguments = function(obj) {
    return obj && _.has(obj, 'callee');
};

_.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (array == null) return [];
    if (_.isFunction(isSorted)) {
        context = iterator;
        iterator = isSorted;
        isSorted = false;
    }

    var result = [],
        seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
        var value = array[i];
        if (iterator) value = iterator.call(context, value, i, array);
        if (isSorted? (!i || seen !== value) : !_.contains(seen, value)) {
            if (isSorted) seen = value;
            else seen.push(value);
            result.push(array[i]);
        }
    }
}

_.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
}

_.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item){
        return _.every(rest, function(other){
            return _.contains(other, item);
        });
    }); 
}

_.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
        if (values) {
            result[list[i]] = values[i];
        } else {
            result[list[i][0]] = list[i][1];
        }
    }
    return result;
};



console.log("begin");
var array = [1, 2, 3, 4, 5, 6];



function Person(name, age) {
    this.name = name;
    this.age = age;
}

var text = "niubidehehe"
var actionArray = _.map(text, _.identity);

var single = new Person("jansti", 1);
var compared = new Person("apple", 2);
var third = new Person("third", 3);

console.log(Person.arguments);
console.log(Person[1]);
