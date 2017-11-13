# Date对象
## 概述
Date对象是JavaScript提供的日期和时间的操作接口。它可以表示的时间范围是，1970年1月1日00:00:00前后的各1亿天（单位为毫秒）
Date对象可以作为普通函数直接调用，返回一个代表当前时间的字符串。
注意，即使带有参数，Date作为普通函数使用时，返回的还是当前时间。
无论有没有参数，直接调用Date总是返回当前时间。

## new Date()
Date还可以当作构造函数使用。对它使用new命令，会返回一个Date对象的实例。如果不加参数，生成的就是代表当前时间的对象。
var today = new Date();
这个Date实例对应的字符串值，就是当前时间。
作为构造函数时，Date对象可以接受多种格式的参数。
1. new Date(milliseconds)
Date对象接受从1970年1月1日00:00:00 UTC开始计算的毫秒数作为参数。这意味着如果将Unix时间戳（单位为秒）作为参数，必须将Unix时间戳乘以1000
2. new Date(datestring)
Date对象还接受一个日期字符串作为参数，返回所对应的时间。
日期字符串的完整格式是“month day, year hours:minutes:seconds”，比如“December 25, 1995 13:30:00”。如果省略了小时、分钟或秒数，这些值会被设为0。
但是，其他格式的日期字符串，也可以被解析。事实上，所有可以被Date.parse()方法解析的日期字符串，都可以当作Date对象的参数。
new Date('2013-2-15')
new Date('2013/2/15')
new Date('02/15/2013')
new Date('2013-FEB-15')
new Date('FEB, 15, 2013')
new Date('FEB 15, 2013')
new Date('Feberuary, 15, 2013')
new Date('Feberuary 15, 2013')
new Date('15 Feb 2013')
new Date('15, Feberuary, 2013')

3. new Date(year, month [, day, hours, minutes, seconds, ms])
Date对象还可以接受多个整数作为参数，依次表示年、月、日、小时、分钟、秒和毫秒。如果采用这种格式，最少需要提供两个参数（年和月），其他参数都是可选的，默认等于0。因为如果只使用“年”这一个参数，Date对象会将其解释为毫秒数。

year：四位年份，如果写成两位数，则加上1900
month：表示月份，0表示一月，11表示12月
date：表示日期，1到31
hour：表示小时，0到23
minute：表示分钟，0到59
second：表示秒钟，0到59
ms：表示毫秒，0到999

### 日期的运算
类型转换时，Date对象的实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。所以，两个日期对象进行减法运算，返回的就是它们间隔的毫秒数；进行加法运算，返回的就是连接后的两个字符串。

## Date对象的静态方法
1. Date.now()
Date.now方法返回当前距离1970年1月1日 00:00:00 UTC的毫秒数（Unix时间戳乘以1000）。
2. Date.parse()
Date.parse方法用来解析日期字符串，返回距离1970年1月1日 00:00:00的毫秒数。

标准的日期字符串的格式，应该完全或者部分符合RFC 2822和ISO 8061，即YYYY-MM-DDTHH:mm:ss.sssZ格式，其中最后的Z表示时区。但是，其他格式也可以被解析，请看下面的例子。
Date.parse('Aug 9, 1995')
// 返回807897600000，以下省略返回值
Date.parse('January 26, 2011 13:51:50')
Date.parse('Mon, 25 Dec 1995 13:30:00 GMT')
Date.parse('Mon, 25 Dec 1995 13:30:00 +0430')
Date.parse('2011-10-10')
Date.parse('2011-10-10T14:48:00')

3. Date.UTC()
Date.UTC(year, month[, date[, hrs[, min[, sec[, ms]]]]])

// 用法
Date.UTC(2011, 0, 1, 2, 3, 4, 567)

## Date对象的方法.

get
getTime()：返回距离1970年1月1日00:00:00的毫秒数，等同于valueOf方法。
getDate()：返回实例对象对应每个月的几号（从1开始）。
getDay()：返回星期几，星期日为0，星期一为1，以此类推。
getYear()：返回距离1900的年数。
getFullYear()：返回四位的年份。
getMonth()：返回月份（0表示1月，11表示12月）。
getHours()：返回小时（0-23）。
getMilliseconds()：返回毫秒（0-999）。
getMinutes()：返回分钟（0-59）。
getSeconds()：返回秒（0-59）。
getTimezoneOffset()：返回当前时间与UTC的时区差异，以分钟表示，返回结果考虑到了夏令时因素。

set
setDate(date)：设置实例对象对应的每个月的几号（1-31），返回改变后毫秒时间戳。
setYear(year): 设置距离1900年的年数。
setFullYear(year [, month, date])：设置四位年份。
setHours(hour [, min, sec, ms])：设置小时（0-23）。
setMilliseconds()：设置毫秒（0-999）。
setMinutes(min [, sec, ms])：设置分钟（0-59）。
setMonth(month [, date])：设置月份（0-11）。
setSeconds(sec [, ms])：设置秒（0-59）。
setTime(milliseconds)：设置毫秒时间戳。





















