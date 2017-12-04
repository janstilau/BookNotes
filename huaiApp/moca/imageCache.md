# ImageCache

## NSData

ADD_DYNAMIC_PROPERTY(NSNumber *,disk_exist,setDisk_exist);

``` OC
+ (void)dataWithURL:(NSString *)url
           identify:(NSString *)identify
            process:(void (^)(int64_t readBytes, int64_t totalBytes))process
          completed:(void(^)(NSData *data))completed;
```

这个函数的功能在于什么呢?这个功能是所有功能的开始. 只有现有数据data, 才会有后面对于数据data变换成image, 设置到imageView上的处理.

1. 如果url不合法, 直接调用回调(nil)
1. 通过url, 计算出图片的缓存地址, 通过url的md5值生成, 如果已经缓存了, 直接读取数据, 传入到回调中, 注意这里的回调是data, 关于image的处理是在这个回调的基础上进行的.
1. 如果没有回调, 就添加到imageCacheManager的下载序列中

```OC
NSMutableDictionary *operation = [[NSMutableDictionary alloc] init];
        [operation setValue:url forKey:@"url"];
        [operation setValue:process forKey:@"process"];
        [operation setValue:completed forKey:@"completed"];
        [[ImageCacheManager defaultManager] addOperation:operation identify:identify];
```

## UIImage

ADD_DYNAMIC_PROPERTY(NSString *,cache_url,setCache_url);
ADD_DYNAMIC_PROPERTY(NSNumber *,disk_exist,setDisk_exist);

```OC
+ (void)imageWithURL:(NSString *)url
            identify:(NSString *)identify
             process:(void (^)(int64_t readBytes, int64_t totalBytes))process
           completed:(void(^)(UIImage *image))completed
```

这个函数主要做了什么呢?

1. 它调用了NSData的dataWithURL方法, 然后, 它的所有的操作都在回调里面.前面三个值都是直接传过去了, completed在则是添加了一些列操作之后调用的.
1. 回调里面的操作, 这个回调里面添加的方法, 主要就是生成图片, 内容中缓存图片, 然后调用completed回调. 而这个completed回调, 一般就是imageView传过来的.
    * 首先, 能够到NSData的回调里面, 就是已经拿完了数据了, 可能获取成功, 也可能失败. 首先要做的就是生成图片, 这里比较特殊的就是生成gif图片. 
    * 将生成的lastImage.disk_exist = data.disk_exist, 这是个动画的标志. 如果不是缓存的图片, 就有一个动画渐隐效果.
    * 如果有图, 就将图混存到[ImageCacheManager defaultManager].imageMemoryCache 中去
    * 如果没有图, 就将本地的图删除. 疑问, 为什么要这样?
    * 最后调用传过来的回调.

## UIImageView

ADD_DYNAMIC_PROPERTY(NSString *,cache_url,setCache_url);
ADD_DYNAMIC_PROPERTY(NSString *,cache_identify,setCache_identify);

``` OC
- (void)setImageWithURL:(NSString *)url identify:(NSString *)identify completed:(void(^)(UIImage *image))completed
```

这个函数做了什么呢?

1. 首先, dispatch_async_on_main_queue(这个函数的所有操作), 异步在主线程执行里面的操作
1. 检查内存中有没有url对应的内容, 如果有, 直接将图片赋值到self.image, 并执行回调.
1. 设置image的cache_identify. 如果传进来了, 就用传进来的, 如果没有, 就用1. imageView所在的controller名 2. imageView没有controller上, 就用界面上最上层的可见controller类名
1. 调用UIImage 的imageWithURL, 传进去url, 和identify. 注意, 这个时候写的block, 是在NSdata的中获得了data之后做的操作. 所以, 从imageView的这个操作开始计算是: imageView在主线程中, 先做内存中缓存命中, 命中了直接调用自己的回调; 否则, 调用UIImage 的方法生成image, 而这个方法里, 是调用NSData的方法, 先生成data, 在这个过程中, 可能要去网络上下载图片, 然后用data生成image, 最后拿生存的这个image调用自己的回调.
1. 这里UIImage的回调写的是
    * 如果[image.cache_url isEqualToString:sself.cache_url]就执行下面操作, 否则返回, 就是判断这个imageView后面是不是赋值新的图了
    * 如果这个图, 是下载的图, 就加一个过渡动画上去.
    * 最后执行自己的回调.

## ImageCacheManager

这个类, 是下载类, 上面的所有操作, 如果文件没有缓存的话, 都要通过这个下载类先下载图片, 才能有后面的操作.

### 首先是两个通知处理函数

UIApplicationDidEnterBackgroundNotification -- > autoCleanImageCache:这个函数的职责是

_visitDateDictionary存储了每个图片url和下载的时间, 计算出六天之上的, 那这些删除, 然后把对应的图片从磁盘上删除, 并将这个记录文本写到磁盘上, 这样就能够控制图片的缓存磁盘大小.

UIApplicationWillTerminateNotification --> synchronizeVistDateList:这个函数的职责是

将_visitDateDictionary异步的写到磁盘中, 也就是把url还有对应的下载时间写到磁盘中.

### 然后是下载相关的函数

_identifyQueue是一个identify的队列, 这里就用到了identify了, identify是类名, 这里就保持了某个控制器上的图片先下载.

_operationClassify是记录所有的任务的地方, 它的键是图片url, 图片的identify, 和时间生成一个uniqueID

_identifyClassify则记录的是上面的uniqueID的数组, 它是记录一个identify下有多少任务.

_urlClassify记录的是上面的uniqueID组成的数组, 键值是url, 就是避免多个url多次下载. _urlClassify本质上记录的是operation的队列. 这个记录主要为了防止一个url多次下载.

* - (void)addOperation:(NSDictionary *)operation identify:(NSString *)identify

这个函数是NSData里面调用的, operation有三个值, url, process过程回调, completed完成回调. identify则是在imageView里面传进来的, 控制器的类名.

函数首先会将identify在_identifyQueue的位置提前, 然后根据url, identify, 时间生成一个uniqueID, 将这个uniqueID和operation关联, 并更新上面几个classify的数据. 然后调用startDownload

* - (void)startDownload

如果_identifyQueue是一个identify的队列还没空呢, 并且_downloadingUrl也没值, 代表还有要下载的图. 否则的话_requestOperation(代表当前下载任务) = nil

* 有图要下载
    1. 取最新的任务, 在这个过程中, 如果某个数组没有值了, 更新几个classify的值并递归调用自己. 注意, 这个过程之中, 有着取operation取不到的过程, 是因为在下面一个url下载过程结束之后, 会将同一个url的所有operation都执行完成回调, 然后在_operationClassify将这个operation就删除了, 所以取不到. 因为这个operation在相同的url的其他下载任务结束的时候已经执行了, 应该被删除.
    1. 设置过程回调为, 取出_urlClassify记录的所有相同url记录的operation, 调用他们的过程回调
    1. 设置完成回调为, 取出response的data值, 然后在主线程, {1. 任务队列中去掉这个任务的uniqueID, 2._urlClassify中, 记录的所有相同url的operation的回调都调用一边, 然后将这个url从_urlClassify中去掉, 3. _downloadingUrl = _requestOperation = nil, 然后重新递归调用自己.}
    1. 调用HTTPMANAGER 的downloadFromUrl方法.

所以这就是一个不断的取值, 下载的过程, 在下载后, 不断的更新记录的值, 直到最后下完所有的图.

### 一些更改下载优先级的方法

* - (void)bringIdentifyToFront:(NSString *)identify 在USViewController的ViewWillAppear中调用

简单的调整一下_identifyQueue的第一个值为新传入的identify, 如果需要取消之前的下载任务就取消.

* - (void)bringURLToFront:(NSString *)url 优先下载某个图片的时候调用, 例如, 分享弹框的时候出来的图片

专门的宏ImageCacheIdentifyImprove, 添加到_identifyQueue的第一个位置, 然后获取_urlClassify中的url的任务, 添加到_identifyClassify[ImageCacheIdentifyImprove]对应的队列里.

* - (void)bringURLArrayToFront:(NSArray *)urlArray 在USViewController的scrollViewDidEndDecelerating中调用, 计算出滑动到的图片url, 优先下载

和上面的处理方法差不多, 不过是多个url了

* - (void)cancelLoadingURL:(NSString *)url

如果是当前的下载url, 取消当前的任务. 然后在_urlClassify中, 去除url对应的任务, 在_operationClassify中删除, 在_urlClassify删除, 然后startDownload
