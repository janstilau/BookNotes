# USImagePickerController

这仅仅是一个NavigationController. 它的rootController是一个USAssetGroupViewController.

## USAssetGroupViewController

```C
// 判断PHAsset的宏在这里
//8.3以下的系统Photos存在一些BUG，继续使用ALAssetsLibrary
//在iPad设备上使用但是"project target"设置的是"iPhone mode"，9.3以下的系统继续使用ALAssetsLibrary
#define PHPhotoLibraryClass ((SYSTEM_VERSION_LESS_THAN(@"8.3") || ([PHAsset targetSizeNeedsSupportiPad] && SYSTEM_VERSION_LESS_THAN(@"9.3")))?nil:NSClassFromString(@"PHPhotoLibrary"))
```

### 代码部分

``` OC
// 这三个就是个记录值的作用, 每次USAssetViewController生成之后, 都会把这个值赋过去.
@property (nonatomic, strong) NSMutableDictionary *draftAssets;
@property (nonatomic, strong) NSMutableDictionary *selectedAssets;
@property (nonatomic, strong) NSMutableArray *selectedQueue;
```

这个viewController就是一个tableView, 真正的数据部分在[self setupGroup]中

PHPhotoLibraryClass 这个宏用到了几次呢, 两次, 就是在setupGroup的时候, 一次是在push USAssetViewController的时候, 具体的策略就是, 用两个变量控制到底是用了PHAsset还是ALAsset, 如果PHAsset的那个有值就用, 然后就return了. 因为前面已经有了AssetModel的包装了, 所以取值的方法都已经经过了包装. 所以PHPhotoLibraryClass的判断能少用就少用.

### setupGroup

首先是读取权限了, 没有权限就showNotAllowed. 有就取值. 没有问过就请求下, 根据结果showNotAllowed还是取值.
不过在之前, 显示判断PHPhotoLibraryClass, 如果是PHAsset可以, 就用PH的那一套, 然后return. 否则用ALAsset那一套.

### USAssetGroupTableCell对应的cell

```OC
@property (nonatomic, strong) ALAssetsGroup *assetsGroup;
@property (nonatomic, strong) PHCollection *phCollection;
@property (nonatomic, assign) PHImageRequestID requestID;
- (void)bind:(id)assetsGroup{
    // 这应该是cell的赋值函数. 简单来说, 就是判断assetsGroup是PH的还是AL的, 是PH的就用PH的代码, 然后取图, 取title赋值, return. 而是AL则用AL的那一套办法.
    // 虽然, PHPhotoLibraryClass用的次数变少了, 但是我们在有些时候, 还是避免不了对于代码的双重写法. 因为OC有着类型内省机制, 我们可以通过类型判断, 少些很多宏定义的代码. 上面提到的, Assetmodel的封装, 也只是对于单一图片的取值的封装, 在这种需要图片之外的信息, 比如, 组数据, 组数据的title, 缩略图的时候, 还是需要两套代码.不过对于业务而然, 这只是一个工具, 在拿到assetArray之后, 操作的就是单一图片的信息了. 所以这种两套代码, 也仅仅会出现在这个工具里, 这是可以接受的.
}
```

## USAssetViewController

[self setupAssets] 这个方法, 就是用刚刚Gourp传过来的group数据进行遍历, 如果是PH用PH的方法, 如果AL的用AL的方法, 在取得值之后, 进行了一次过滤, 这个过滤是过滤identifier在picker的filterImage里面的, 而这个值, 是应该在这个USImagePickerController生成的时候, 赋值过来的.

这里其实用到了oc的给nil发消息无效的特点了, ph的情况下, PHCachingImageManager会被在上一步的group环境里面被赋值, 而al环境下, 这个值是没有的, 但是在AssetVC中, 直接对这个属性发消息, 因为如果是nil, 没有副作用, 所以这里不用专门判断nil.

最开始的navigationVC的filteredImageList在这里被用到了, 之所以有这个需求当时是, 在选择大量的图片后, 需要替换的时候, 用户是记不得选择了哪些图片的, 所以要将已经选择的传入, 将已经选择的图片在第一个section中列出来. 这个过程是在setupAssets中实现的.

之前的代码, 有很多用accessibilily作为检测的时候, 这个习惯很不好, 因为通过这个量, 没有办法判断代码的意图.

里面的代码有很多的业务代码, 没有细细的看, 不过, 这个类库的目的就是将不同系统版本的操作兼容, 在group中用到了一些宏定义, 而后面的操作则是通过指针的判断进行的. 在选择图片的过程中, 有很多的判断, 例如照片损坏与否, 照片尺寸, 照片个数等等, 这些都要在相应操作的时候进行处理. 此外, 还有PHImageCacheManager的缓存的管理.
