import {
  request
} from '../../request/index.js';
var Cates_res=require('../../data/Cates.js');  //引入
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左边的列表数据
    LeftMenuList:[],
    //右边商品数据
    RightContent:[],
    //被点击时候的左侧菜单
    currentIndex:0,
    //右侧内容滚动条距离顶部的距离
    scrollTop:0,
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 1 先判断本地存储是否有旧数据
     * 2 没有旧数据 则直接发送新请求
     * 3 有旧数据但是没有过期 使用本地存储的旧数据
     */
    //1 获取本地存储的数据
    const Cates = wx.getStorageSync("key");
    //2 判断
    if(!Cates){//不存在 则发送请求获取数据
      this.getCates();
    }else{
      //有旧数据 定义过期时间
      if(Date.now() - Cates.time > 1000*10){
        //时间过期 重新发送请求
        this.getCates();
      }else{
        //使用旧数据
        this.Cates = Cates.data;
        //构造左侧的菜单数据
        let LeftMenuList = this.Cates.map(o=>o.catName);
        //构造右侧的商品数据
        let RightContent = this.Cates[0].children;
        this.setData({
          LeftMenuList,
          RightContent
        })
      }
    }
  },
  //获取分类数据
  async getCates(){
    request({
      url:"/categories"
    }).then(res=>{
      this.Cates = res;
      console.log("分类数据",this.Cates);
      // 把接口的数据存入到本地存储中
      wx-wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
      //构造左侧的菜单数据
      let LeftMenuList = this.Cates.map(o=>o.catName);
// let LeftMenuList = this.Cates.map(o=>o.cat_name);
      //构造右侧的商品数据
      let RightContent = this.Cates[0].children;
      this.setData({
        LeftMenuList,
        RightContent
      })
    })
    // console.log("分类数据2",Cates_res.message);

    // // 1 使用async await来发送请求(异步)
    // const res = await request({url:"/categories"})
    // // this.Cates = res.data.message;
    // this.Cates = res;//到request里面修改
    // // 把接口的数据存入到本地存储中
    // wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
    // //构造左侧的菜单数据
    // let LeftMenuList = this.Cates.map(o=>o.cat_name);
    // //构造右侧的商品数据
    // let RightContent = this.Cates[0].children;
    // this.setData({
    //   LeftMenuList,
    //   RightContent
    // })

    // // this.Cates = res.data.message;
    // this.Cates = Cates_res.message;//到request里面修改
    // console.log(this.Cates);
    // // 把接口的数据存入到本地存储中
    // wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
    // //构造左侧的菜单数据
    // let LeftMenuList = this.Cates.map(o=>o.cat_name);
    // //构造右侧的商品数据
    // let RightContent = this.Cates[0].children;
    // this.setData({
    //   LeftMenuList,
    //   RightContent
    // })
    // console.log("左侧的菜单数据",LeftMenuList);
    // console.log("右侧的商品数据",RightContent);
  },
  //左侧菜单点击事件
  handleItemTap(e){
    /**
     * 1 获取被点击的标题索引index
     * 2 给data中的currentIndex赋值
     * 3 根据不同的索引值来渲染右侧商品的值
    */
   const {index} = e.currentTarget.dataset;
   let RightContent = this.Cates[index].children;
   console.log(index);
   console.log(RightContent);
   
   this.setData({
     currentIndex:index,
     RightContent,
     //重新设置右侧内容的scrol1-view标签的距离顶部的距离
     scrollTop:0
   })
  }
})