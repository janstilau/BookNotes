# LOGGER

这个类的作用

1. 如果是发型版本, 将打印的信息用bugly收集
1. 如果是debug, 如果连着xocde, 打印到xcode
1. 如果是debug, 没有连着xcode, 打印到文件系统
1. 提供一个判断的依据, 例如, 有的时候需要判断是不是debug进行不同的代码运行, 这个时候是不能用宏的. 有这个类的manager作为记录当前环境的内存变量, 很有必要.

redirectNSLogToDocumentFolder 这个函数, 会DEBUG的时候把stdout的数据, 如果没有连接xcode, 打印到文件系统里.

``` OC
    //启动异常处理
    InstallSignalHandler();//信号量截断
    InstallUncaughtExceptionHandler();//系统异常捕获
```

上面的没太明白