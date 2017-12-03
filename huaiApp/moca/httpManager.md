# HttpManager

httpManager是对Afn的封装, 主要功能有:

    * 缓存, 对之前的网络请求缓存, 在进入新的页面的时候, 可以首先加载之前的页面, 然后在网络请求返回的时候重绘.
    * 添加对于协议的支持. moca的http协议的返回内容进行了分层, h,p,n,m, 可以在HttpManager里面直接进行处理, 例如, 在返回码(这个返回码不是http的返回码)为某个特定值的时候, 直接进行, 例如返回上个页面的处理, 然后进行弹窗, 这个弹窗内容在n中. 只有返回码为2**的时候, 调用回调函数, 并把p里面的内容传进去.

## NSURLCache

NSURLCache主要提供了对于请求内容的缓存的功能

[NSHipster上的讲解](http://nshipster.cn/nsurlcache/)
>
The NSURLCache class implements the caching of responses to URL load requests by mapping NSURLRequest objects to NSCachedURLResponse objects. It provides a composite in-memory and on-disk cache, and lets you manipulate the sizes of both the in-memory and on-disk portions. You can also control the path where cache data is stored persistently.

在MOCA里面, http缓存策略使用的是NSURLRequestReloadIgnoringCacheData, 也就是不适用http的缓存, 然后用NSURLCache的内容进行缓存的管理. 这是很有必要的, 说实话, http的缓存策略的值到底怎么用, 不是很清楚, 将控制完全交给app这边, 反而可以很好地控制.

* initWithMemoryCapacity:diskCapacity:diskPath:
* storeCachedResponse:forRequest:
* cachedResponseForRequest:
* removeCachedResponseForRequest:

上面是用到的几个方法, 可以看到, NSURLCache是用request为key缓存的Response.

## Httpmanager的功能

其中一些关于序列化和反序列化的内容, 还有sesstionManager的东西, 是关于AFN的, 在AFN里面, 在做专门的处理.

``` Oc
/** GET 请求 */
- (NSURLSessionDataTask *)getRequestToUrl:(NSString *)url params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete;

/** GET 请求并添加到缓存，未联网时使用缓存数据 */
- (NSURLSessionDataTask *)getCacheToUrl:(NSString *)url params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete;

/** POST 请求 */
- (NSURLSessionDataTask *)postRequestToUrl:(NSString *)url params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete;

/** POST 请求并添加到缓存，未联网时使用缓存数据 */
- (NSURLSessionDataTask *)postCacheToUrl:(NSString *)url params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete;

- (NSURLSessionDataTask *)requestToUrl:(NSString *)url method:(NSString *)method useCache:(BOOL)useCache
              params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete
```

上面的是主要的获取NSURLSessionDataTask方法, 最后都会汇总到最后的requestToUrl的方法, 用request是因为在NSURLConnnection的时候的代码了, 在升级的时候没有进行修改.

这个总的方法有5个参数, url这是都会有的, methos分别是get, post, useCache控制缓存, params控制参数, 还有就是回调函数.

### 获取request

* (NSMutableURLRequest *)cacheRequestUrl:(NSString *)url method:(NSString *)method useCache:(BOOL)useCache params:(NSDictionary *)params
* (NSMutableURLRequest *)requestWithUrl:(NSString *)url method:(NSString *)method useCache:(BOOL)useCache params:(NSDictionary *)params

上面的cacheRequestUrl其实是调用了下面的requestWithUrl.他们都会调用`getRequestBodyWithParams`这样的一个函数, 获取一个request.这个函数的作用

1. 把params的emoji改变成为cheatCode, 疑问, 这样做的目的是什么?
1. 存入time, 这个time是本地时间加上本地时间和服务器时间的差值, 这个差值每次都会重新计算.
1. 存入platform,version,version_api,distributor还有sessionkey的信息. 这个sessionkey信息是在登录接口中返回的, 作为用户的标示, 服务器端会对这个用户作为检测. 例如, 本地存了一个sessionkey, 然后在另外的一个机器上登录了, 那么这个后登录的sessionkey会是一个新的sessionkey. 然后在原来的机器上操作的时候, 会发送原来的sessionkey, 这样服务器端就会检测到这是原来的sessionkey, 返回一个错误码过来, 客户端这里就强制退出.

而cacheRequestUrl在会在上面获取完之后, 去除一些参数, 这些参数是time, lat, lng, 其中lat和lng代表经纬度, 在每次获取用户位置的时候存入偏好设置. 然后增加'isCacheRequest'为yes. 它的作用在于, 去除那些和变换的参数, 然后调用requestWithUrl. 这个函数的主要作用在于

1. 如果isCacheRequest为no, 也就是不是从cacheRequest过来的, 获取基本参数.
1. 如果是发布环境, methos为post
1. 在url中增加device_id和用户的login_uid信息. 疑问, 为什么这两个要放在url中.
1. 然后调用afn的requestSerializer, 将url和参数传入生成一个request. 设置timeout时间和缓存策略, 设置cookie, 然后返回
1. 把request的参数和时间存入accessibility信息, 用于response的时候打印信息

### 发送请求

在获取完request之后, 就是发送请求了, 如果是useCache为no的话, 就是getRequest或者postRequest的话, 就直接调用sessionManager的dataTaskWithRequest方法了.否则获取cacheRequest, 这个cacheRequest用于存储到NSURLCache中的key, 它会调用`cacheDataTaskWithRequest`方法, 这个方法的作用在于

1. 还是调用sessionManager的dataTaskWithRequest方法, 但是在回调用增加了处理.
    * error.code == NSURLErrorNotConnectedToInternet || error.code == NSURLErrorCannotConnectToHost, 这代表没有连上网络, 尝试去[NSURLCache sharedURLCache]用cacheRequest获取cacheResponse, 如果能够获取, 就用这个cacheResponse(标示这是缓存数据)传入到回调里面, 相当于没有报错. 没有找到, 或者错误码不是这两个, 就将错误传入到毁掉中
1. 没有发生错误, 会将respone缓存到NSURLCache sharedURLCache中, 然后调用回调
1. 总之, 调用的时候, 带cache的方法, 会有一次缓存处理, 直接request是没有缓存处理的.

无论是cache, 还是request, 他们的回调都是一样的.

1. 打印数据, 包括url, 参数, get还是post.
1. 生成一个httpResponse, 这个东西里面存储了request的信息, 包括url和参数信息, 还会存储response的的信息. 作为调用httpManager的一个统一的信息体
1. 如果出错了, 回调后, 打印您的网络不给力哦等信息.
1. 如果没有出错, 进行一次解析操作. 将afn给回的数据, 解析成为对象. 如果是缓存数据表明是缓存数据. 然后在主线程里面调用对于这个对象的解析.
1. 解析工作有一个前提, 就是现实框架解析, 然后才是业务解析. 框架解析从c,h,m,n的内容, 进行拦截.
    * 首先, 存储客户端和服务器之间的时间差值, 在发送请求的时候, 将这个差值加回去, 也就是变成服务器时间.
    * 判断c的值, 如果是200, 直接进行业务回调
    * 如果是缓存数据, 也进行业务回调, 不过success设置为No
    * 如果是其他情况, 也就是不是缓存也不是200的, 业务回调(no)之后, 进行处理, 例如, 401, 307, 表示有其他登录设备, 就弹框提示, 然后强制退出.如果是404, 就强制退回到主界面, 无论什么情况, n的内容 都会进行弹框.

### - (void)localCacheToUrl:(NSString *)url params:(NSDictionary *)params complete:(void (^)(BOOL successed, HttpResponse *response))complete

从NSURLCache中尝试寻找数据, 一般在界面加载的过程中, 先用这个让界面有个显示, 然后调用Cache方法, 进行网络数据的显示.

## 上传下载函数

``` oc
/*
 files : 需要上传的文件数组，数组里为多个字典
 字典里的key:
 1、name: 文件名称（如：demo.jpg）
 2、file: 文件   （支持四种数据类型：NSData、UIImage、NSURL、NSString）NSURL、NSString为文件路径
 3、key : 文件对应字段的key（默认：file）
 4、type: 文件类型（默认：image/jpeg）
 示例： @[@{@"file":_headImg.currentBackgroundImage,@"name":@"head.jpg"}];
 */
- (NSURLSessionUploadTask *)uploadToUrl:(NSString *)url
                                 params:(NSDictionary *)params
                                  files:(NSArray *)files
                               complete:(void (^)(BOOL successed, HttpResponse *response))complete;


//可以查看进度 process_block
- (NSURLSessionUploadTask *)uploadToUrl:(NSString *)url
                                 params:(NSDictionary *)params
                                  files:(NSArray *)files
                                process:(void (^)(int64_t writedBytes, int64_t totalBytes))process
                               complete:(void (^)(BOOL successed, HttpResponse *response))complete;
/**
 filePath : 下载文件的存储路径
 response : 接口返回的不是文件而是json数据
 process  : 进度
 */
- (NSURLSessionDownloadTask *)downloadFromUrl:(NSString *)url
                                   filePath:(NSString *)filePath
                                   complete:(void (^)(BOOL successed, HttpResponse *response))complete;

- (NSURLSessionDownloadTask *)downloadFromUrl:(NSString *)url
                                     params:(NSDictionary *)params
                                   filePath:(NSString *)filePath
                                    process:(void (^)(int64_t readBytes, int64_t totalBytes))process
                                   complete:(void (^)(BOOL successed, HttpResponse *response))complete;
```

### 上传数据

1. 利用afn的requestRequestSerializer的 multipartFormRequestWithMethod方法, 制作出一个request来, 具体知识在http中, 简单来说, 就是这个是muti-part的http请求, 要将数据组合到http请求体中.
1. 然后调用afn的sessionManager的uploadTaskWithStreamedRequest方法, 把这个请求, 中间处理回调, 完成回调传进去.

### 下载数据

1. 调用_sessionManager downloadTaskWithRequest方法, 传入下载过程回调, 完成回调. 注意, imageCache中, 大量调用了这个方法.