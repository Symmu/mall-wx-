import {
  request
} from '../../request/index.js';
// var OrderGoods_res=require('../../data/OrderGoods.js');  //引入
// pages/pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    good:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
// 1获取缓存中的收获地址
    const address =wx.getStorageSync("address");

//获取购物车数据
    //1 获取缓存中的购物车数据 ||[]或者为一个空数组
    let cart =wx.getStorageSync("cart")||[];
    //过滤购物车数组
    cart = cart.filter(o=>o.checked);

    this.setData({address});
    this.setCart(cart);
  },

//设置购物车状态同时重新计算底部工具栏的数据全选总价格购买的数量
  setCart(cart){
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(o => {
      totalPrice += o.num * o.goodsPrice;
      // totalPrice += o.num * o.goods_price;
      totalNum += o.num; 
      })
    // 2赋值
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
    
  },
//点击支付
  handleOrderPay(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认支付金额',
      success (res) {
        if (res.confirm) {
          that.OnPay(1);
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
          that.OnPay(0)
          console.log('用户点击取消')
          wx.redirectTo({
            url: '/pages/order/index?type=2',
        });
        }
      }
    })
    // // //无支付状态
    // wx.navigateTo({
    //   url: '/pages/order/index',
    // });
  },
  async OnPay(order_pay){
    //3创建订单
    const order_price = this.data.totalPrice;
    const {provinceName,cityName,countyName,detailInfo} = this.data.address;
    const consignee_addr = provinceName+cityName+countyName+detailInfo;
    // const consignee_addr = this.data.address;
    console.log(consignee_addr);
    const cart = this.data.cart;
    console.log("cart",cart);
    console.log("this.data.totalNum",this.data.totalNum);
    console.log("this.data.totalPrice",this.data.totalPrice);
    let goods = [];
    let {openid} = wx.getStorageSync("userInfo");
    cart.forEach(o=>goods.push({
      goods_id:o.goodsId,
      goods_name:o.goodsName,
      goods_number:o.num,
      goods_price:o.goodsPrice,
      goods_total_price:o.goodsPrice*o.num,
      goods_small_logo:o.goodsSmallLogo
      // openid:openid,
      // goods_total_price:order_price,
      
      // goods_id:o.goods_id,
      // goods_number:o.goods_number,
      // goods_price:o.goods_price,
    }))
    console.log("goods",(goods));//JSON.stringify(goods)
    // let order_pay=0;
    //3.1请求头参数
    const orderParams = {openid,order_price,consignee_addr,goods,order_pay}
    console.log("orderParams",orderParams);
    //4 准备发送请求 创建订单 获取订单编号
    const order_number = await request({url:"/my/orders/create",data:orderParams,method:"POST"});
    console.log("订单编号",order_number);

    
    // const orderParams = {order_price,consignee_addr,goods}
    // const order_number = await request({url:"/my/orders/create"+"/"+openid+"/"+order_price+"/"+consignee_addr,method:"POST"});
    // const order_number = await request({url:"/my/orders/create",method:"POST",data:orderParams,header});
    // //发起 预支付接口
    // const res = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number},header});
    // console.log("预支付接口数据",res);
    //删除缓存中 已支付了的商品
    let newCart = wx.getStorageSync("cart");
    newCart=newCart.filter(o=>!o.checked)
    wx.setStorageSync("cart", newCart);
  }
})