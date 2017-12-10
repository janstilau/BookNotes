# AssetModel

这是一个表示照片数据的类, 在新一代的iOS中, 照片已经是需要用PHAsset使用了, 并且现在版本过去已经过去这么多, 需要用到ALAsset的机会越来越少了. 但这种包装的思想应该一直在. 在获取这些Assets的时候, 是在USImagePicker中, 在那个类里面, 根据宏判断, 最后传出来的会根据系统版本情况传入不同的AssetModel, 或者是ALAsset的数据, 或者是PHAsset的数据. 但是只要被AssetModel包装了之后, 就可以直接通过AssetModel去取数据了. 因为在初始化的过程中, 通过不同的函数调用, 将值取出来了存储到了AssetModel这个包装类中了. 而它其中保存一个id asset, 在ALAsset和PHAsset的分类扩展中, 定义了相同的方法名, 可以直接用asset 调用, 这样就实现了对于底层不同类实现的掩盖, 在使用的时候, 不用管底层到底是什么数据结构. 用一套API就可以.

## 额外

### 照片方向

[如何处理iOS中照片的方向](http://feihu.me/blog/2015/how-to-handle-image-orientation-on-iOS/)

简单来说, 照片在照的一瞬间, 其实相机是很机械的记录它所捕获的信息的, 横着照就是横着照的信息, 竖着照就是竖着照的信息, 但是, 对于人来说, 会有一个照片方向的问题, 这个信息就是相机的方向传感器记录下来的, 相机将这个信息存在照片当中, 这样, 当相机来浏览照片的时候, 读取这个信息, 就能正确的显示照片了. 比如, 竖屏的时候, 横向的照片会被压缩到中间, 照片的长条会等于屏幕的宽度, 而照片的短条会被压缩的更短, 这是符合人类在竖屏下不用旋转照片就能查看照片的需求的.在UIImage里面, 这个方向信息是存在imageOrientation里面的.

对于iphone, 正方向其实是home键超右的横屏状态. 但是我们传到服务器的时候, 应该做一个照片修正, 也就是将方向信息设置为UIImageOrientationUp, 当然不能简单的设值就结束了, 而是要将生成一个旋转完的照片, 这个照片的方向是也就是将方向信息设置为UIImageOrientationUp, 但是原来的不同的方向照片旋转之后的结果. 传这样的照片到服务器那里, 无论那里有没有照片方向修正机制, 都没有问题.

```OC
// 这个是一个简单的方法. 因为, drawInRect这个方法里面, 已经考虑到了照片的方向问题.
- (UIImage *)normalizedImage {
    if (self.imageOrientation == UIImageOrientationUp) return self;

    UIGraphicsBeginImageContextWithOptions(self.size, NO, self.scale);
    [self drawInRect:(CGRect){0, 0, self.size}];
    UIImage *normalizedImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return normalizedImage;
}
```

## 代码实现

```OC
其实, 这里大部分的还是取照片的操作, 而那些配置信息, 是直接存在AssetModel里面, 在初始化的时候就取值完成了.
#define USFullScreenImageMinLength       1200.f
#define USAspectRatioHDImageMaxLength    4000.f
- (CGSize)dimensions
    * ALASSET return self.defaultRepresentation.dimensions
    * PHASSET return CGSizeMake(self.pixelWidth, self.pixelHeight);
- (NSDate *)modifiedDate
    * ALASSET return [self valueForProperty:ALAssetPropertyDate];
    * PHASSET return [self creationDate];
- (NSString *)localIdentifier
    * ALASSET return self.defaultRepresentation.url.absoluteString;
    * PHASSET return self.localIdentify;
- (UIImage *)fullScreenImage
    * ALASSET
        先是 [UIImage imageWithCGImage:self.defaultRepresentation.fullScreenImage],
        如果上面的值返回nil return [self thumbnailImageWithMaxPixelSize:USFullScreenImageMinLength]
    * PHASSET return 先计算出size来, 最大边为USFullScreenImageMinLength, 然后调用imageAspectFitWithSize
- (UIImage *)aspectRatioThumbnailImage
    * ALASSET
        先是 [UIImage imageWithCGImage:self.aspectRatioThumbnail]
        如果上面的值返回nil 通过thumbnailImageWithMaxPixelSize方法取值后返回
    * PHASSET 先计算出size, 调用然后调用imageAspectFitWithSize
- (UIImage *)aspectRatioHDImage
    * ALASSET
        return [self thumbnailImageWithMaxPixelSize:USAspectRatioHDImageMaxLength];
    * PHASSET 先计算出size, 调用然后调用imageAspectFitWithSize
- (NSData *)originalImageData
    * ALASSET
        通过[self.defaultRepresentation getBytes:buffer fromOffset:0.0 length:(NSUInteger)representation.size error:&error]将值存到buffer,
        然后 return [NSData dataWithBytesNoCopy:buffer length:buffered freeWhenDone:YES]
    * PHASSET 利用[PHImageManager defultManager]的requestImageDataForAsset方法, 配置options
- (UIImage *)thumbnailImageWithMaxPixelSize:
    * ALASSET
        如果self.dimension中最大值大过了传出参数, 则通过CGImageSourceCreateThumbnailAtIndex这个方法, 创造一个小的图片出来.具体的用法详见代码
        如果没有照片的self.dimension没有打过去, 则返回[self fullScreenImage], 因为这样返回的照片是通过self.defaultRepresentation取得的, 是和尺寸配套的
    * PHASSET 先计算出size, 调用然后调用imageAspectFitWithSize
+ (instancetype)fetchAssetWithIdentifier:(NSString *)identifier
    * ALASSET
        用的是ALAssetLibrary 的 assetForUrl方法, 这个方法是一个异步方法, 用的信号量同步的.
    * PHASSET [PHAsset fetchAssetsWithLocalIdentifiers:@[identifier] options:nil].firstObject

PHAsset
- (UIImage *)imageAspectFitWithSize:(CGSize)size
{
    这个PHAsset的扩展里面取照片的最终函数. 上面的fullScreenImage, thumbnailImageWithMaxPixelSize都是计算出size来, 然后调用这个方法.
}

PHAssetManager
- (PHImageRequestID)requestImageForAsset:(PHAsset *)asset targetSize:(CGSize)targetSize contentMode:(PHImageContentMode)contentMode options:(nullable PHImageRequestOptions *)options resultHandler:(void (^)(NSImage *__nullable result, NSDictionary *__nullable info))resultHandler;
这个函数就是通过配置options取图

    PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
    options.synchronous  = YES;
    options.deliveryMode = PHImageRequestOptionsDeliveryModeHighQualityFormat;
    options.resizeMode   = PHImageRequestOptionsResizeModeExact;
    options.networkAccessAllowed = YES;

- (PHImageRequestID)requestImageDataForAsset:(PHAsset *)asset options:(nullable PHImageRequestOptions *)options resultHandler:(void(^)(NSData *__nullable imageData, NSString *__nullable dataUTI, CGImagePropertyOrientation orientation, NSDictionary *__nullable info))resultHandler;

```

## AssetModelCode

NSString * const AssetModelResolvedNotification = @"asset.model.resolved";这个通知post是在setAsset的方法里, 当赋值完成之后抛出这个通知, 在USPhoto里面, 如果没有拿到sha_1值, 会接受这个通知, 在照片那里的数据都填充完毕之后, 重新获取一下sha1的值.

NSString * const AssetModelProgressChangedNotification = @"asset.model.progress.changed";这个通知是在setAsset里面, 是icloud取值的过程函数, 因为iphone的iCould有一个iphone存储空间优化的选项, 会在存储空间不足的时候, 将全分辨率的照片和视频转化成为优化版本, 而源数据放在iCould中. 所以, 可能会存在需要在iCould上下图的过程.

```OC
@property (nonatomic, strong, readonly) id asset;

@property (nonatomic, strong, readonly) ALAsset *al_asset;
@property (nonatomic, strong, readonly) PHAsset *ph_asset;

@property (nonatomic, copy, readonly) NSString *filename;
@property (nonatomic, copy, readonly) NSString *localIdentifier;

@property (nonatomic, copy) NSString *introduction;

/** 用户选择的裁剪区域 */
@property (nonatomic, assign) CGRect crop_rect;

/** 最后一次编辑时间 */
@property (nonatomic, strong, readonly) NSDate *modified_date;

/** 照片尺寸 */
@property (nonatomic, assign, readonly) CGSize dimensions;

/** 相机信息 (异步获取) */
@property (nonatomic, copy, readonly) NSString *lensModel;

/** GPS信息 (异步获取) */
@property (nonatomic, strong, readonly) NSNumber *latitude;
@property (nonatomic, strong, readonly) NSNumber *longitude;

/** 照片元数据的大小 (异步获取) */
@property (nonatomic, assign, readonly) CGFloat data_length;

/** 照片的类型 (异步获取) */
@property (nonatomic, assign, readonly) YYImageType image_type;

/** 照片元数据的SHA1值 (异步获取) */
@property (nonatomic, copy, readonly) NSString *data_sha1;

/** 需要从iCloud下载的照片的下载进度 */
@property (nonatomic, assign, readonly) double progress;

/** 所有属性是否都已解析完成 */
@property (nonatomic, assign, readonly) BOOL resolved;

/** 原图是否已损坏 */
@property (nonatomic, assign, readonly) BOOL damaged;
+ (instancetype)modelWithAsset:(id)asset;
+ (instancetype)modelWithIdentifier:(NSString *)identifier;
这两个方法就是最主要的构造方法了, 会通过asset或者identifier(AL的会是@"assets-library://"前缀)的值, 构建不同的asset, 然后解析asset的数据到自己的各个参数上.

在setALAsset还是setPHAsset里面, 做了对于信息的读取和赋值的过程. 这里, 有一个异步操作, 所以会有一个_resolved信息表示解析完成了没有. 之所以要异步操作, 1是sha1可能是一个很费时的工作, 2是会有一个detectImageData方法, 这个方法要读取原图做一个图片信息被破坏与否的检测, 在这个过程中专门加一个autoreleasePool. 3是有可能在iCould下图, 而这个过程, 你是没有办法控制的.

_damage是什么信息呢, 就是如果这个图片被第三方工具修改了, 然后没有给照片设置原始的dimensions信息的话, 那么这个照片就无效了.这是一个需要拿到源照片数据才能进行操作的异步, 需要耗费大量资源, 所以要异步处理. 现在的操作, 是将_damage的警告全部放到了USAssetViewController里面了.
```