import {
  request
} from '../../request/index.js';
// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    
  },
  
  onShow(options){
    // const {token} = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index'
    //   });
    //   return ;
    // }

    // 1获取当前的小程序的页面栈-数组长度最大是10页面
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    const {type} =  currentPage.options;
    console.log(currentPage.options);
    //激活选中页面标题 当type=1 index=0
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type){
    let {openid} = wx.getStorageSync("userInfo");
    console.log("openid",openid);
    const res =await request({url:"/my/orders",data:{openid,type}});
    console.log("res",res);
    this.setData({
      orders:res,
      orders:res.map(v=>({...v,create_time_cn:(v.create_time.toString())}))
      // orders:res.map(v=>({...v,create_time_cn:(v.create_time.toString())}))
      // orders:res.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      // xml {{item.create_time_cn}}
    })
  },
  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
  // 2 修改源数组
    let {tabs} = this.data;
    // tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 3 赋值
    this.setData({
      tabs
    })
  },
  //标题点击事件 从子组件传递过来的
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index);
    //重新发送请求 type=1 index=0 获取页面数据
    this.getOrders(index+1);
  },
  //待付款支付
  handlePay(e){
    var that = this;
    console.log(e.currentTarget.dataset.index);
    const {data} = e.currentTarget.dataset
    const {order_pay,order_price} = e.currentTarget.dataset.data;
    console.log(order_pay,order_price,data);
    if (order_pay==1) {
      wx.showLoading({
        title: "已支付"
      });setTimeout(function () {
        wx.hideLoading()
      }, 500)
    }else{
      wx.showModal({
        title: '提示',
        content: '确认支付￥：'+order_price,
        success (res) {
          if (res.confirm) {
            that.OnPay(data);
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              success:function(){
              //支付成功状态...
                wx.redirectTo({
                    url: '/pages/order/index?type=1',
                });
              }
            })
          } else if (res.cancel) {
            // that.OnPay(0)
            console.log('用户点击取消')
          //   wx.redirectTo({
          //     url: '/pages/order/index?type=2',
          // });
          }
        }
      })
    }
  },
  async OnPay(data){
    const res = await request({url:"/my/pay",data:data,method:"POST"});
    console.log("res",res);
  }
})