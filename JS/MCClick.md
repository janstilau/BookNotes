# MCClick

上周末看了下以前的代码, 发现了点问题.

MCClick的思路是所有的代码全部放到子线程里面去, 主线程的+ (void)event:(NSString *)eventId payload:(id)payload 还是[NetManager getCacheToUrl]的回调里面都是用的performSelector: onThread 达到的这个效果, 这样所有的数据都在子线程中访问修改, 也就不用同步了.

```OC
[NetManager getCacheToUrl:url params:nil complete:^(BOOL successed, HttpResponse *response) {
        _isUploading = NO;
        if (successed || response.error.code == NSPropertyListReadCorruptError) {
            [self performSelector:@selector(uploadFinished) onThread:_eventThread withObject:nil waitUntilDone:false];
        }
}];
```

上面代码里面, 这个_isUploading = NO;应该是在主线程赋值的, 这个时候如果发生切换, 到子线程的detectionEventsQueue, 会把_stashArray的数据改变, 然后在之后执行uploadFinished的话, _stashArray已经在发生了变化, 这和原来的目的已经不同了. 这种情况出现的机会不大, 因为子线程是timer为3秒的定时器驱动的, 优先级设置的比较低.

```OC
- (void)detectionEventsQueue
{
    if (_isUploading) {
        //正在上传中
        return;
    }
    if(!_eventArray.count && !_stashArray.count){
        //没有数据可以上传
        return;
    }
    //有网状态下才上传
    if(NetManager.networkStatus != AFNetworkReachabilityStatusNotReachable){
        [_stashArray addObjectsFromArray:_eventArray];
        [_eventArray removeAllObjects];
        [self startUpload];
    }
}

- (void)uploadFinished
{
    [_stashArray removeAllObjects];
    [self synchronize];
}
```

这样写因为在网络回调之后把flag赋值是其他地方习惯的写法了 , 想了想最简单的解决就是把_isUploading = NO;包成一个方法, 然后统一用performSelectorOnThread方法在子线程调用.

```OC
- (void)netWorkFinished
{
    _isUploading = NO;
}
- (void)uploadFinished
{
    [_stashArray removeAllObjects];
    [self synchronize];
    [self netWorkFinished];
}
[NetManager getCacheToUrl:url params:nil complete:^(BOOL successed, HttpResponse *response) {
        if (successed || response.error.code == NSPropertyListReadCorruptError) {
            [self performSelector:@selector(uploadFinished) onThread:_eventThread withObject:nil waitUntilDone:false];
        } else {
            [self performSelector:@selector(netWorkFinished) onThread:_eventThread withObject:nil waitUntilDone:false];
        }
}];
```