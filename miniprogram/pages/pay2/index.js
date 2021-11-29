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
    address: {},
    cart: [],
    good: [],
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (options) {
    var data = JSON.parse(decodeURIComponent(options.data)) //将数据格式转换回原来的格式
    var a = []
    a.push(data)
    this.setData({
      good: a
    })
    console.log("a", a);
  },
  onShow() {
    // 1获取缓存中的收获地址
    const address = wx.getStorageSync("address");
    this.setData({
      address
    });
  },
  //点击支付
  handleOrderPay() {
    const address = wx.getStorageSync("address");
    const userInfo = wx.getStorageSync("userInfo");
    var that = this
    //判断登录
    if (!userInfo.nickName) {
      wx.showToast({
        title: '您还没有登录，请先登录在进行购买！',
        icon: 'none',
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    //2 判断收货地址
    if (!address.userName) {
      wx.showToast({
        title: '您还没有选中收获地址',
        icon: 'none',
        success: (result) => {},
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认支付金额',
      success(res) {
        if (res.confirm) {
          that.OnPay(1);
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function () {
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
  },
  async OnPay(order_pay) {
    console.log(this.data.good);
    //3创建订单
    const order_price = this.data.good[0].goodsPrice;
    const {
      provinceName,
      cityName,
      countyName,
      detailInfo
    } = this.data.address;
    const consignee_addr = provinceName + cityName + countyName + detailInfo;
    // const consignee_addr = this.data.address;
    console.log(consignee_addr);
    let a = this.data.good;
    let goods = []
    let {
      openid
    } = wx.getStorageSync("userInfo");
    a.forEach(o => goods.push({
      goods_id: o.goodsId,
      goods_name: o.goodsName,
      goods_number: 1,
      goods_price: o.goodsPrice,
      goods_total_price: o.goodsPrice,
      goods_small_logo: o.goodsSmallLogo
    }));
    // good.forEach(o=>good.push({
    //   goods_id:o.goodsId,
    //   goods_name:o.goodsName,
    //   goods_number:o.goodsNumber,
    //   goods_price:o.goodsPrice,
    //   goods_total_price:o.goodsPrice,
    //   goods_small_logo:o.goodsSmallLogo
    // }));
    console.log("goods", goods);
    // let order_pay=0;
    //3.1请求头参数
    const orderParams = {
      openid,
      order_price,
      consignee_addr,
      goods,
      order_pay
    }
    console.log("orderParams", orderParams);
    //4 准备发送请求 创建订单 获取订单编号
    const order_number = await request({
      url: "/my/orders/create",
      data: orderParams,
      method: "POST"
    });
    console.log("订单编号", order_number);
  },
  //1 点击收货地址
  handleChooseAddress() {
    //2 调用内置api  wx.chooseAddress 存在权限问题
    //scope.address 一直为true、可以真机调试
    wx.chooseAddress({
      success: (address) => {
        console.log(address);
        //3 存入缓存中
        wx.setStorage({
          key: 'address',
          data: address
        });
      },
      fail: () => {},
      complete: () => {}
    });
  },
})