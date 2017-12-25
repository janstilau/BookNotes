# USUploadViewController==>USShoppingManager

-(void)startUploadAction 里面有对当前网络环境的处理, 不是wifi环境就弹框提醒, 然后调用[USShoppingManager startUpload]

[USShoppingManager startUpload]; 这个函数之前的部分有很多订单管理的内容, 先略过, 从获取到_uploadingImages(待上传的照片)开始分析.
