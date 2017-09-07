// 重构,在不改变代码的外在行为的前提下,对代码做出修改,以改进代码的内部结构的过程.
// 模块的三项职责. 1 完成功能 2应对变化 3阅读沟通
// 重构的目的,就是清洁代码,为了能够用最小的努力维护对系统的扩展和修改,就是要保持代码的清洁.

/*
2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
*/
function generatePrimes(maxValue) {
    var result = new Array();
    if (maxValue >= 2) {
        var size = maxValue + 1;
        var isPrimes = new Array();
        (function() {
            for (var i = 0; i < size; i++) {
                isPrimes.push(true);
            }
        })();
        isPrimes[0] = isPrimes[1] = false;
        (function() {
            for (var i = 2; i < Math.sqrt(size) + 1; i++) {
                for (var j = 2 * i; j < size; j += i) {
                    isPrimes[j] = false;
                }
            }
        })();

        var count = 0;
        (function() {
            for (var i = 0; i < size; i++) {
                if (isPrimes[i]) {
                    result.push(i);
                }
            }
        })();
    }
    return result;
}


function PrimeGenerator() {
    var isPrimes = new Array();
    var results = new Array();

    this.generaoePrimes = function(maxValue) {
        isPrimes.length = 0;
        results.length = 0;
        if (maxValue < 2) {
            return new Array();
        } else {
            this.initialIsPrimes(maxValue);
            this.filterPrimes();
            this.loadPrimes();
            return results;
        }
    };

    this.initialIsPrimes = function(maxValue) {
        var size = maxValue + 1;
        for (var i = 0; i < size; i++) {
            isPrimes.push(true);
        }
        isPrimes[0] = isPrimes[1] = false;
    };

    this.filterPrimes = function() {
        for (var i = 2; i < Math.sqrt(isPrimes.length) + 1; i++) {
            for (var j = 2 * i; j < isPrimes.length; j += i) {
                isPrimes[j] = false;
            }
        }
    };

    // Math.sqrt(isPrimes.length) + 1 在书里面也被摘取成一个独立的函数,
    // for (var j = 2 * i; j < isPrimes.length; j += i) 在书里面也被摘取成为一个独立的函数.

    this.loadPrimes = function() {
        for (var i = 0; i < isPrimes.length; i++) {
            if (isPrimes[i]) {
                results.push(i);
            }
        }
    };
    // isPrimes[i] 在书里面也被摘取成了一个独立的函数
}

// 最后的测试程序,用了穷举的办法.判断一个数是素数,就从1到这个数本身查看中间有没有整除,有的话就assert,这是比较严禁的办法.

var primes = generatePrimes(200);
// console.log(primes);
var generaotr = new PrimeGenerator();
console.log(generaotr.generaoePrimes(100));