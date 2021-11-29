//引入方法
import {
  request
} from '../../request/index.js';
var SwiperList_res=require('../../data/SwiperList.js');  //引入
var CateList_res=require('../../data/CateList.js');  //引入
var FloorList_res=require('../../data/FloorList.js');  //引入
//Page Object
Page({
  data: {
    //轮播图数组
    SwiperList: [],
    // 导航数组
    CateList:[],
    FloorList:[]
  },
  //options(Object)
  onLoad: function (options) {
    // 1.发送异步请求
    //  wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
    //     this.setData({
    //         SwiperList:result.data.message
    //     })
    //   }

    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  //获取轮播图
  getSwiperList(){
    request({
      url: "/home/swiperdata"
    })
    .then(result => {
      console.log("轮播图",result);
      this.setData({
        SwiperList: result
      })
    })
    //  this.setData({
    //     SwiperList: SwiperList_res.message
    //   })
      // console.log("轮播图",SwiperList_res.message);

      // wx.request({
      //   url: 'http://localhost:8080/home/swiperdata',
      //   success:(res)=>{
      //     console.log(res.data);
      //     this.setData({
      //       SwiperList: res.data
      //     })
      // },
      // })
  },
  //获取分类
  getCateList(){
    request({
      url: "/home/catitems"
    })
    .then(result => {
      console.log("分类",result);
      this.setData({
        CateList: result
      })
    })
    // this.setData({
    //   CateList: CateList_res.message
    // })
    // console.log("分类",CateList_res.message);
  },
  // 获取底部数据
  getFloorList(){
    request({
      url: "/home/floordata"
    })
    .then(result => {
      console.log("底部数据",result);
    //   for (let k = 0; k < result.length; k++) {
    //     result[k].product_list.forEach((v, i) => {
    //         result[k].product_list[i].navigator_url = v.navigator_url.replace('?', '/index?');
    //     });
    // }
      this.setData({
        FloorList: result
      })
      // console.log("底部数据",result);
    })
  //   this.setData({
  //     FloorList: FloorList_res.message
  //   })
    // console.log("底部数据2",FloorList_res.message);
  }

});