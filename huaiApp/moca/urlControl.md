# UrlControl

```OC
#define CUSTOM_API_DOMAIN      [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_CustomApiDomain]
#define SERVER_API_DOMAIN      [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_ApiDomain]
#define SERVER_SPREAD_DOMAIN   [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_SpreadDomain]
#define SERVER_TUBE_DOMAIN     [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_TubeDomain]
#define SERVER_LOG_DOMAIN      [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_LogDomain]
#define SERVER_UPLOAD_DOMAIN   [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_UploadDomain]
#define SERVER_IMAGE_DOMAIN    [[NSUserDefaults standardUserDefaults] objectForKey:UserDefaultKey_DownloadDomain]
```

```OC
//-------外网------
#define INIT_DOMAIN      CUSTOM_API_DOMAIN?:@"https://api.happyin.com.cn"
#define API_DOMAIN       SERVER_API_DOMAIN?:INIT_DOMAIN
#define IMAGE_DOMAIN     SERVER_IMAGE_DOMAIN?:@"hipub-10023356.file.myqcloud.com"
#define UPLOAG_DOMAIN    SERVER_UPLOAD_DOMAIN?:INIT_DOMAIN
#define TUBE_DOMAIN      SERVER_TUBE_DOMAIN?:@"push.happyin.com.cn:7237"
#define SPREAD_DOMAIN    SERVER_SPREAD_DOMAIN?:@"push.happyin.com.cn:7239"

//-------后端人员开发环境------
//#define API_DEV_PORT     9969   //和开发人员调试的时候直接修改这个端口号
//#define INIT_DOMAIN      CUSTOM_API_DOMAIN?:[NSString stringWithFormat:@"dev.happyin.com.cn:%d",API_DEV_PORT]
//#define API_DOMAIN       CUSTOM_API_DOMAIN?:INIT_DOMAIN
//#define IMAGE_DOMAIN     SERVER_IMAGE_DOMAIN?:@"hipubdev-10006628.file.myqcloud.com"
//#define UPLOAG_DOMAIN    CUSTOM_API_DOMAIN?:INIT_DOMAIN
//#define TUBE_DOMAIN      SERVER_TUBE_DOMAIN?:@"push.happyin.com.cn:7237"
//#define SPREAD_DOMAIN    SERVER_SPREAD_DOMAIN?:@"push.happyin.com.cn:7239"
```

```OC
#define APIVersion          @"100"
#define HappyInHostSuffix   @"happyin.com.cn"
#define MC_URL_HOST(HOST)         ([(HOST) hasPrefix:@"http"]?(HOST):[@"http://" stringByAppendingString:(HOST)])
#define BASE_URL_INIT             [NSString stringWithFormat:@"%@/", MC_URL_HOST(CUSTOM_API_DOMAIN?:INIT_DOMAIN)]
#define BASE_URL_API              [NSString stringWithFormat:@"%@/", MC_URL_HOST(API_DOMAIN)]
#define BASE_URL_IMAGE            [NSString stringWithFormat:@"%@/", MC_URL_HOST(IMAGE_DOMAIN)]
#define BASE_URL_UPLOAD           [NSString stringWithFormat:@"%@/", MC_URL_HOST(UPLOAG_DOMAIN)]
```

``` OC
NSString *InitUrl (NSString *relativeUrl) { return [NSString stringWithFormat:@"%@%@", BASE_URL_INIT, relativeUrl]; }
NSString *GeneralUrl (NSString *relativeUrl) { return [NSString stringWithFormat:@"%@%@", BASE_URL_API, relativeUrl]; }
NSString *ImageUrl (NSString *relativeUrl) { return [NSString stringWithFormat:@"%@%@", BASE_URL_IMAGE, relativeUrl]; }
NSString *UploadUrl (NSString *relativeUrl) { return [NSString stringWithFormat:@"%@%@", BASE_URL_UPLOAD, relativeUrl]; }
```

```OC
//-------------App--------------------------
#define url_system_domain                   InitUrl(@"Catalog/System/GetDomainInfo")                    //获取域名信息
#define url_submit_active                   GeneralUrl(@"Catalog/Advert/active")                        //激活

//注册登录
#define url_verify_captcha                  GeneralUrl(@"Catalog/User/verifyCaptcha")
```

## 域名更新策略

在每一次applicationWillEnterForeground, 都会调用loadAppConfig这个方法.

这个方法会向url_system_domain发一个请求, 在返回的结果里, 含有以下数据, 在代码里还有对于其他的数据的配置, 在这个请求的回调里, 会将这些接口的数据, 存到偏好设置里面, 也就是以下的UploadDomain,DownloadDomain,LogDomain,SpreadDomain,TubeDomain中. 为什么要这样. 上面的宏定义是Domain信息, URL信息这样的排列顺序, 而domain信息是存在前面这些名字的偏好设置里面的. 如果刚开始, domain里面没有信息, 就会读取我们在//-------外网------下配置的信息, 然后拿到domain信息之后, 才可以传入到下面的生成URL的四个方法里. 这四个方法, Init方法, 会在loadAppConfig中被用到, 也就是说, 所有的接口都能断, 但是这个initDomain接口是不能变的. 就算在里面返回了initDomain的信息信息, 但是在删除项目或者第一次从appStore下载之后, 首先运行的也是在上面宏定义的initDomain的信息. 

而在loadAppConfig后, GeneralUrl是项目中大部分接口用到的接口. ImageUrl是大部分的图片资源的接口生成, 在HLTool fullImagePath中被用到. 而UploadUrl只有在moca用到了, 应该是之前的moca还是用的自己服务器管理图片资源. 后面变成了腾讯云服务之后, 上传图片的地址就是需要从后端和腾讯云交互之后直接获取的.

CUSTOM_API_DOMAIN这个字段只有在MCConfigViewController里面被赋值, 如果这个值有值的话, 就直接读取值了. 所以这是一个和后端调试的一个埋点.

```OC
{
    c = 200;
    h = "";
    m = "";
    n = "";
    p =     {
        download_domain = "happyin-10041765.file.myqcloud.com";
        flags = 1;
        init_domain = "https://api.happyin.com.cn";
        log_level = 4;
        spread_service =         (
            "push.happyin.com.cn:1234"
        );
        upload_domain = "https://api.happyin.com.cn";
    };
    ts = 1512800066000;
}
```