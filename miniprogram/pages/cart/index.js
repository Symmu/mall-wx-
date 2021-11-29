import {
  request
} from '../../request/index.js';
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    /**
     * 页面加载完毕
     * 0 onLoad onShow
     * 1获取本地存储中的地址数据
     * 2把数据设置给data中的一个变量
     */
// 1获取缓存中的收获地址
    const address =wx.getStorageSync("address");

//获取购物车数据
    //1 获取缓存中的购物车数据 ||[]或者为一个空数组
    const cart =wx.getStorageSync("cart")||[];
    this.setData({address});
    console.log(cart);
    this.setCart(cart);
  },

  //1 点击收货地址
  handleChooseAddress(){
    //2 调用内置api  wx.chooseAddress 存在权限问题
    //scope.address 一直为true、可以真机调试
    wx.chooseAddress({
      success: (address)=>{
        console.log(address);
        //3 存入缓存中
        wx.setStorage({
          key: 'address',
          data: address
        });
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    {// //获取权限状态
    // wx.getSetting({
    //   success: (result)=>{
    //     // 2获取权限状态 主要发现一些属性名 不能直接.的时候 使用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress===true||scopeAddress===undefined) {
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1);
    //         }
    //       });
    //     }else{
    //       // 3 用户拒绝授予权限 先获取用户权限
    //       wx.openSetting({
    //         success: (result2)=>{
    //           // 4调用收获地址
    //           wx.chooseAddress({
    //             success: (result3)=>{
    //               console.log(result3);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    }
  },

//商品单选
  handleItemChange(e){
  /**
     * 商品的选中
     * 1绑定change事件
     * 2获取到被修改的商品对象
     * 3商品对象的选中状态取反
     * 4重新填充回data中和缓存中
     * 5重新计算全选。总价格总数量。
     */

    //1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart}= this.data;
    //3 找到被修改的商品对象
    let index = cart.findIndex(o=>o.goodsId===goods_id);
    // let index = cart.findIndex(o=>o.goods_id===goods_id);
    //4 选中状态取反
    cart[index].checked = !cart[index].checked;
    //5重新计算全选
    this.setCart(cart);
    console.log(goods_id);
  },
//设置购物车状态同时重新计算底部工具栏的数据全选总价格购买的数量
  setCart(cart){
    //计算全选
    //every 遍历数组 必须所有都为true 才返回true，否则就是false
    //空数组使用every 返回值也是为true 做一个判断
    //const allChecked = cart.length?cart.every(o=>o.checked):false;

    let allChecked = true; //将allChecked放入下一个循环，减少循环的使用
    /**
     * 总价格和总数量
     * 1都需要商品被选中我们才拿它来计算
     * 2获取购物车数组
     * 3遍历
     * 4判断商品是否被选中
     * 5总价格 += 商品的单价 * 商品的数量  总数量 += 商品的数量
     * 6把计算后的价格和数量设置回data中即可
     */
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(o => {
      if (o.checked) {
        totalPrice += o.num * o.goodsPrice;
        // totalPrice += o.num * o.goods_price;
        totalNum += o.num; 
      }else{
        allChecked = false;
      }
    });
    //判断数组是否为空 数组为空则赋值false
    allChecked = cart.length!=0 ? allChecked : false;
    // 2赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    //6 设置回缓存中
    wx.setStorage({key: 'cart',data: cart,});
  },
//商品全选
  handleItemAllChecked(){
/**
   * 全选和反选
   * 1 全选复选框绑定事件change
   * 2 获取data中的全选变量allChecked
   * 3 直接取反allChecked= !allChecked
   * 4 遍历购物车数组让里面商品选中状态跟随 allChecked改变而改变
   * 5 把购物车数组和allChecked 重新设置回data把购物车重新设置回缓存中
   */
  //1 获取data中的数据
  let {cart,allChecked} = this.data;
  //2 修改值
  allChecked = !allChecked;  
  //3 修改cart数组中 商品选中状态
  cart.forEach(o=>o.checked=allChecked);
  //4 把修改的值 填充回data或者缓存中
  this.setCart(cart);
  },
  
  //商品数量编辑
  handleItemNumEdit(e){

    /**
   * 商品数量的编辑
   * 1按钮绑定同一个点击事件区分的关键自定义属性
   *   1 "+"  "+1"
   *   2 "-"  "-1"
   * 2传递被点击的商品id goods_id
   * 3获取data中的购物车数组 来获取需要被修改的商品对象
   * 4当购物车的数量=1同时用户点击
   *    弹窗提示询问用户是否要删除
   *    1确定 直接执行删除
   *    2取消 什么都不做
   * 4直接修改商品对象的数量num
   * 5把cart数组重新设置回缓存中和 data中 this.setCart
   */

    //1 获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset;
    //2 获取购物车数组
    let {cart} = this.data;
    //3 找到需要修改的商品的索引
    const index = cart.findIndex(o=>o.goodsId===id);
    // const index = cart.findIndex(o=>o.goods_id===id);
    //4 进行修改数量
      //1判断是否到-1 的数量然后删除
    if (cart[index].num===1&&operation===-1) {
      wx.showModal({
        // title: '提示',
        content: '确定要删除吗',
        showCancel: true,
        cancelText: '我再想想',
        cancelColor: '#666',
        confirmText: '删除',
        confirmColor: '#eb4450',
        success: (result) => {
          if(result.confirm){
            cart.splice(index,1);
            this.setCart(cart);
          }else if(result.cancel){
            console.log('%c'+"用户点击取消",'font-family: sans-serif;color:#ff7b54;font-size:50px;width:300px;height:80px;background-color: #30475e;background-size:100%; border-radius: 10px;padding: 2px 50px;');
          }
        },
      });
    }else{
      cart[index].num += operation;
      //5 设置回缓存和data中
      this.setCart(cart);
    }
  },

  /**
   * 点击结算
   * 1判断有没有收货地址信息
   * 2判断用户有没有选购商品
   * 3经过以上的验证跳转到支付页面!
   */
  //结算功能
  handlePay(e){
    //解构数据
    const {address,totalNum} = this.data;
    //1 判断用户有没有选购商品
    if (totalNum===0) {
      wx.showToast({
        title: '您还没有选中商品',
        icon: 'none',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    }
    //2 判断收货地址
    if (!address.userName) {
      wx.showToast({
        title: '您还没有选中收获地址',
        icon: 'none',
        success: (result)=>{},
        fail: ()=>{},
        complete: ()=>{}
      });
      return;
    }
    //3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
  }
})