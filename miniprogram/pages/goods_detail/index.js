import {
  request
} from '../../request/index.js';
var Goods_detail_List_res=require('../../data/Goods_detail_List.js');  //引入
// pages/goos_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodsObj:{},//获取到对象的值
    isCollect:false//商品是否被收藏
  },
  //声明一个全局的数组
  GoodsInfo:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;

    const {goods_id} =options;
    this.getgoodsDetailList(goods_id);
  },

  //获取商品详情数据
 async getgoodsDetailList(goods_id){
    const res = await request({url:"/goods/detail",data:{goods_id}});
    // const res = await request({url:"/goods/detail"+"/"+goods_id,data:{goods_id}});
    this.GoodsInfo=res[0];
    // this.GoodsInfo=res;
    console.log("商品详情",res[0]);
    //1 获取缓存中商品收藏的数组
    let collect = wx.getStorageSync("collect")||[];
    //2 判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goodsId === this.GoodsInfo.goodsId);
    this.setData({
      GoodsObj:{
        goods_name:res[0].goodsName,
        goods_price:res[0].goodsPrice,
        goods_introduce:res[0].goodsIntroduce,
        goods_small_logo:res[0].goodsSmallLogo,
        // pics:res[0].pics
        // goods_name:res.goods_name,
        // goods_price:res.goods_price,
        // /**
        //  * iphone部分手机不识别webp图片格式
        //  * 临时自己改确保后台存在1.webp =>1.jpg
        //  */
        // goods_introduce:res.goods_introduce,
        // // goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg'),
        // pics:res.pics
      },
      isCollect
    })

  },

  //轮播图点击事件
  handlePreviewImage(e){
    //1 构造预览图片的路径的数组
    const urls = this.GoodsInfo.pics.map(o=>o.pics_mid);
    //2 接受点击到的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
  },

 /** 点击加入购物车
  * 1先绑定点击事件
  * 2获取缓存中的购物车数据数组格式
  * 3先判断当前的商品是否已经存在于购物车
  * 4已经存在修改商品数据 执行购物车数量++重新把购物车数组填充回缓存中
  * 5第一次点击 不存在于购物车的数组中 直接给购物车数组添加一个新元素 
  * 新元素带上购买数量属性num 重新把购物车数组填充回缓存中
  * 6弹出提示
 */
  handleCartAdd(){
    //1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[];
    //2 判断 商品对象是否存在于购物车中
    let index = cart.findIndex(o=>o.goodsId===this.GoodsInfo.goodsId);
    // let index = cart.findIndex(o=>o.goods_id===this.GoodsInfo.goods_id);
    if (index===-1) {
      //3 不存在 为第一次添加
      this.GoodsInfo.num=1;
      //添加购物车选中状态的属性
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      //4 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    //5 把购物车重新添加到缓存中
    wx.setStorage({
      key: 'cart',
      data: cart,
    });
    //6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止多次点击
      mask: true,
    });
  },
  //收藏点击事件
  handleCollect(){
    let isCollect = false;
    //获取缓存商品数组
    let collect = wx.getStorageSync("collect")||[];
    console.log(collect);
    //判断是否被收藏过
    let index = collect.findIndex(o=>o.goodsId === this.GoodsInfo.goodsId);
    // 当index==-1 时候 表示收藏过
    if (index!==-1) {
      //已经收藏过了 在数组中删除
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //存入缓存中
    wx.setStorageSync("collect",collect);
    //修改data
    this.setData({
      isCollect
    })
  },
  handlePay(){
    var data = JSON.stringify(this.GoodsInfo)
    wx.navigateTo({
      url: '/pages/pay2/index?data='+encodeURIComponent(data),
    })
  }
})