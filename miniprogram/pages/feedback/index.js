// pages/feedback/index.js
Page({
  data: {
    // 被选中的图片路径 数组
    chooseImgs:[],
    //文本域的内容
    textVal:"",
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      },
    ]
  },
  //外网图片路径数组
  UploadImgs:[],
  //标题点击事件
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 3 赋值
    this.setData({
      tabs
    })
  },
  //点击 +号 选择图片
  handleChooseImg(){
    // 调用内置api 选择图片
    wx.chooseImage({
      // 同时选中图片的数量
      count: 9,
      //图片的格式 原图 压缩
      sizeType: ['original','compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          //图片数组进行拼接
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })      
      },
    });
  },
  //点击图片自定义组件
  handleRemoveImg(e){
    //被点击组件的索引
    const {index} = e.currentTarget.dataset;
    //获取data图片数组
    let {chooseImgs} = this.data;
    //删除元素
    chooseImgs.splice(index,1);
    //赋值
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },
  // 提交事件
  handleFormSubmit(){
    //获取文本域 的内容
    const {textVal,chooseImgs} = this.data;
    //验证合法性
    if (!textVal.trim()) {
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    //准备上传图片 到专门的服务器
    //上传文件的api 不支持多个文件同时上传 只能遍历数组 挨个上传
    
    wx.showLoading({
      title: "正在加载中",
      mask: true,
    });

    //判断有没有要上传的数组
    if (chooseImgs.length !=0) {
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
      //图片要上传到哪里
      url: 'https://clubajax.autohome.com.cn/Upload/UpImageOfBase64New?dir=image&cros=autohome.com.cn',
      // 被上传的文件的路径
      filePath: v,
      // 上传的文件的名称 后台获取文件 file
      name: "file",
      //顺带的文本信息
      formData: {},
      success: (result)=>{
        console.log(result);
        let url = JSON.parse(result.data).url;
        this.UploadImgs.push(url);
        console.log(this.UploadImgs);

        //所有图片都上传完毕了才触发
        if (i===chooseImgs.length-1) {
          
          wx.hideLoading();
          console.log("把文本内容和外网图片数组提交到后台中");

          //重置页面
          this.setData({
            textVal:"",
            chooseImgs:[]
          })
          //返回上一个页面
          wx.navigateBack({
            delta: 1
          });
        }
      },
    });
  })
  }else{
    wx.hideLoading();
    console.log("只是提交了文本");
    wx.navigateBack({
      delta: 1
    }); 
  }
  },
})