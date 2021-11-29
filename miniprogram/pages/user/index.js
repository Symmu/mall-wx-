import {
  request
} from '../../request/index.js';
// pages/user/index.js
Page({
  data: {
    userInfo:{},
    //被收藏的数量
    collectNums:0,
    PayCount:0,
    NoPayCount:0
  },
  //接口所需要的参数
  userInfo:{
    avatarUrl:"",
    city:"",
    country:"",
    nickName:"",
    province:"",
    // appid:"",
    openid:"",
  },
  onReady(){
    // if (this.userInfo.openid!==null) {
      this.getOpenid();
      console.log("this.userInfo.openid",this.userInfo.openid);
    // }
  },
  onShow(){
    this.getuserInfo();
    this.getOrderscount(this.userInfo.openid);
    console.log("执行！！！！！");
  },
  //获取登录过后的用户数据
  getuserInfo(){
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];
    this.setData({userInfo,collectNums:collect.length});
  },
  //云函数调用
  getOpenid(){
    wx.cloud.callFunction({
      name:'getOpenId',
      data:{
        message:'getOpenId',
      }
    }).then(res=>{
      console.log(res.result)//res就将appid和openid返回了
      // this.userInfo.appid = res.result.appid||"";
      this.userInfo.openid = res.result.openid||"";
      // console.log("userInfo1",this.userInfo);
      this.getOrderscount(this.userInfo.openid);
    })
  },
  
  //登录事件 getuserinfoProfile
  async getUserProfile(e){
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("getUserProfile的res",res.userInfo);
        this.userInfo.avatarUrl = res.userInfo.avatarUrl||"";
        this.userInfo.city = res.userInfo.city||"";
        this.userInfo.country = res.userInfo.country||"";
        this.userInfo.nickName = res.userInfo.nickName||"";
        this.userInfo.province = res.userInfo.province||"";

        wx.setStorageSync("userInfo", this.userInfo);

        request({url:"/user/addUser",data: this.userInfo,method:"POST"})
        .then(result => {console.log("存储信息",result);})
        this.getuserInfo();
        // this.onShow();
        console.log("用户信息",this.userInfo);
      }
    })
    // const result = await request({url:"/user/addUser",data:this.userInfo,method:"POST"});
    // console.log(result);
  },
  // 获取所有订单数量
  async getOrderscount(openid){
    let type =2;
    const PayCount =await request({url:"/my/orders",data:{openid}});
    console.log("PayCount",PayCount.length);
    const NoPayCount =await request({url:"/my/orders",data:{openid,type}});
    console.log("NoPayCount",NoPayCount.length);
    this.setData({
      PayCount:PayCount.length,
      NoPayCount:NoPayCount.length
    })
  }

  //登录事件
  // handleGetuserinfo(e){
  //   console.log("e",e);
  //   const {userInfo} = e.detail;
  //   this.userInfo.avatarUrl = userInfo.avatarUrl||"";
  //   this.userInfo.city = userInfo.city||"";
  //   this.userInfo.country = userInfo.country||"";
  //   this.userInfo.nickName = userInfo.nickName||"";
  //   this.userInfo.province = userInfo.province||"";
  //   wx.setStorageSync("userInfo", this.userInfo);
  //   console.log("用户信息",this.userInfo);
  
  //     request({
  //       url:"/user/addUser",
  //       data: {
  //         avatarUrl: this.userInfo.avatarUrl,
  //         city: this.userInfo.city,
  //         country: this.userInfo.country,
  //         nickName: this.userInfo.nickName,
  //         openid: this.userInfo.openid,
  //         province: this.userInfo.province,
  //       },
  //     }).then(result => {
  //       console.log("存储信息",result);
  //     })
  //     this.getuserInfo();
  // },
})