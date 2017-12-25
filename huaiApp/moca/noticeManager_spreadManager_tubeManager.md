# SocketHandlerProgress

## noticeManager

* http是一个client-server的模式, 这个模式的问题在于, 服务器端不能够主动的发送消息给客户端, 但是通知客户端是一个很基本的操作, 例如, 事件更新了, 或者聊天软件, 不可能用轮训的方法去查看最新的消息. socket作为一个可以双方通信的模式, 是很常用的. 不过moca的socket还只是服务器像客户端发消息的模式, 没有实现客户端的写入这一条线的通信.

* 两种模式, 广播事件 和 用户事件. 广播事件就是和app相关的内容了, 比如app要更新, app有了新的特性, 有了新的服务, 有了新的优惠政策. 这些是所有的用户都要接受到的. 用户事件就是用户所接收到的事件, moca的app又分为了群体事件, 例如, 小组里的人发了个小组贴, 这时候要通知小组里面所有人, 还有个人事件, 例如有人专门回复了你的信息.

### 处理广播事件

-(void)handleSpreadSubject:(NSString *)subject payload:(NSDictionary *)payload

这里, 通过判断subject的字符串, 分辨payload里面到底是哪方面的信息. 现在有系统更新, 配置更新, 和后台命令三种. 通过payload的信息, 执行不同的操作. 例如命令这一项里面, 就是清理url, 图片缓存, 或者设置log等级等. 而系统更新这一项, 是更新启动图, 广告图, 还有就是版本更新. 而config更新里面, 则是更新一些配置信息, 这些配置信息是在各个业务层面需要用到的.

处理的方式也是两种, 一种是将payload的信息存放到偏好设置里面, 这种一般的处理逻辑是, 业务层面的代码, 在初始化的过程中, 一般会去取一下偏好设置里面的值, 然后用这个值来进行操作, 没有就用默认值. 所以这种更新的方式, 更多的配置的改变, 例如启动图, 是要下一次进去app才会生效的. 而清除缓存, 系统更新这种信息, 是会立马执行的.

-(void)handleTubeUserEventFromId:(NSString *)fromId message:(NSDictionary *)message

这种就是单个用户会接受到的通知信息了. 一般来说是通过message里面的type值, 进行分派处理, 然后具体怎么操作, 应该写在业务代码里面.

-(void)handleTubeGroupEventFromId:(NSString *)fromId message:(NSDictionary *)message

这个就是群组用户都会接受到的通知信息, 通过message里面的内容, 进行处理, 具体怎么操作, 写在业务代码里面.

## SpreadManager

这个类是管理广播事件的, 它和用户时间的socket不是一个socket. 代码有很多管理socket的代码, 但是核心的逻辑很简单.在程序appDelegate的foreground和background里面, 会调用connect和disconnect的方法, 也就是在程序不是系统当前程序的时候, 是会关闭socket的. 然后建立socket的是在initSpreadChanel的方法里面, 运用了performSelector方法, 让它一直在子线程运行. 这个方法, 会将用户的uid, 设备信息, 以及在noticeManager里面规定的想要接受的主题等信息, 作为初始化socket的参数和服务器建立连接.  这个类也会监听网络状态的变化, 在网络不行的时候, 会断掉socket, 然后用timer不断的尝试建立连接. 因为, initSpreadChanel里面, 实际是会卡掉当前线程的, 所以timer添加进去的队列, 实际上是一个线性执行的关系. 在socket接受到信息之后, 就会调用handleSubject, 而这里面, 会调用noticeManager的信息. 这个socket里面没有上传事件ID到服务器的操作. 不知道服务器怎么知道给用户推了信息了.

## TubeManager