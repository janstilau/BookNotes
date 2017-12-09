# imageUrl的生成策略

[腾讯云万象图片处理业务](https://cloud.tencent.com/document/product/275/3311)

* 图片上传

上传流程主要包括四个步骤：

终端访问开发者服务器，获取签名（注意：签名的创建不能在终端上进行，否则可能会导致用户信息泄露等安全隐患）；
终端上传图片，腾讯云·万象优图验证签名、存储图片，生成文件ID，URL等信息通过回调url传给开发者服务器；
业务服务存储相应的图片信息，并将处理结果返还给腾讯云·万象优图；
腾讯云·万象优图根据开发者服务器返回的处理信息返还给终端结果。

* 图片下载

图片下载使用图片上传成功后返回的的下载url直接访问，即直接访问download_url。

如果设置了Token防盗链，则使用下载url加签名的方式直接访问，即：download_url?sign=[签名]

```C
//这段代码是在US的时候加到的, 之后的image的策略都是传的US_FILTER_TYPE_ORIGINAL, 也就是原图, 而之前的业务是可以加特效, 穿过特定的参数之后, 可以在服务器端生成特定的图片, 然后放到腾讯云端, 服务器和腾讯云交互的具体细节客户端可以不用关心.
typedef NS_ENUM (NSInteger, USFilterType) {
    US_FILTER_TYPE_ORIGINAL        =  -1,
    US_FILTER_TYPE_1977            =  0,
    US_FILTER_TYPE_LOMOFI          =  1,
    US_FILTER_TYPE_HEFE            =  2,
    US_FILTER_TYPE_INKWELL         =  3
};
```

@implementation NSString (ImageURL)
-(NSString *)fullImageURL  这个方法内部, 直接调用ImageUrl(self), 也就是生成和ImageDomain拼接而成的完整的图片Url路径, 一般来说, 服务器返回的图片url都是最后的url文件名, 这样可以减少返回的数据, 节省流量.
-(NSString *)fullThumbImageURL:(NSInteger)size flag:(USFilterType)flag  这个方法, 首先自然是fullImageURL生成图片的url, 然后在后面拼接_%@x_%@.%@, 第一个是size信息, 第二个是flag信息, 也就是特效信息, 也就是说, 客户端通过参数的拼接来控制图片的最终尺寸和特效信息, 具体的图片生成, 要服务器端进行处理. 最后一个是图片的扩展名.
-(NSString *)fullFaceImageURL:(CGSize)size flag:(USFilterType)flag 这个方法和上面的一样, 都是设置size和特效flag, 不过这个size是两个值了, _%dx%d_%@.%@, 用这种方式拼接.

除了us之外, 一般来说, 生成特效图片都没有用到, 最多的就是设置图片尺寸信息.