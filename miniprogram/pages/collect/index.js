// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:[],
    tabs:[
      {
        id:0,
        value:"商品收藏",
        isActive:true
      },
      {
        id:1,
        value:"品牌收藏",
        isActive:false
      },
      {
        id:2,
        value:"店铺收藏",
        isActive:false
      },
      {
        id:3,
        value:"浏览足迹",
        isActive:false
      },
    ]
  },
  onShow(){
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      collect
    });
  },
//标题点击事件 从子组件传递过来的
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    console.log(e);
    // 2 修改源数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 3 赋值
    this.setData({
      tabs
    })
  },
})