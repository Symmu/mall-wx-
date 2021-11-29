import {
  request
} from '../../request/index.js';
var Goods_List_res=require('../../data/Goods_List.js');  //引入
// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GoodsList:[],
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ]
  },
  //接口所需要的参数
  QueryPatams:{
    query:"",
    cat_id:"",
    current:1,
    // pagenum:1,
    // pagesize:10,
    size:10
  },
  //总页数
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryPatams.cat_id = options.cat_id||"";
    this.QueryPatams.query = options.query||"";
    console.log(this.QueryPatams.cat_id );
    this.getGoodsList();
  },
  //获取商品列表数据
  async getGoodsList(){
    // const res = await request({url:"/goods/search",data:this.QueryPatams})
    // //获取总条数
    // const total = res.total;
    // //计算总页数
    // this.totalPages = Math.ceil(total/this.QueryPatams.pagesize)
    // // console.log(this.totalPages);
    // this.setData({
    //   // GoodsList:res.goods
    //   //拼接数组
    //   GoodsList:[...this.data.GoodsList,...res.goods]
    // })

    // let total =1
    // let pagesize =10
    const res = await request({url:"/goods/search"
    // +"/"+this.QueryPatams.current
    // +"/"+this.QueryPatams.size
    // +"/"+this.QueryPatams.cat_id
    ,data:this.QueryPatams})
    // //计算总页数
    this.totalPages = res.pages
    this.setData({
      // GoodsList:res.goods
      //拼接数组 /下拉的时候1+1
      GoodsList:[...this.data.GoodsList,...res.records]
    })
    console.log("1",...this.data.GoodsList,"2",...res.records);

    
    // const total = Goods_List_res.message.total;
    // this.totalPages = Math.ceil(total/this.QueryPatams.pagesize)
    // console.log("现——所有",Goods_List_res.message);
    // this.setData({
    //   // GoodsList:res.goods
    //   //拼接数组
    //   GoodsList:[...this.data.GoodsList,...Goods_List_res.message.goods]
    // })
    // console.log("1",...this.data.GoodsList,"2",...Goods_List_res.message.goods);
  },

  //标题点击事件 从子组件传递过来的
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
  /**
 * 1 用户上滑页面 滚动条触底 开始加载下一页数据
 *   1 找到滚动条触底事件
 *   2 判断还有没有下一页数据
 *      1 获取到总页数 total
 *        总条数 =Math.ceil(总条数 / 页容量pagesize)
 *      2 获取到当前的页码 pagenum
 *      3 判断一下当前的页码是否大于等于总页数
 *      4 表示没有下一页数据
 *   3 假如没有下一页数据弹出一个提示
 *   4 假如还有下一页数据来加载下一页数据
 */
  //上滑事件
  onReachBottom(){
    if (this.QueryPatams.current>=this.totalPages) {
      //没有下一页数据
      console.log("已经拉到底了");
      wx.showLoading({
        title: "已经拉到底了"
      });
      setTimeout(function () {
        wx.hideLoading()
      }, 800)
    }else{
      //有下一页数据
      this.QueryPatams.current++;
      this.getGoodsList();
    }
  },
  /**
   * 下拉刷新页面
   *  1 触发下拉刷新事件需要在页面的json文件中开启一个配置项
   *  2 重置数据数组
   *  3 重置页码设置为1
   *  4 重新发送请求
   *  5 数据请求回来，手动关闭刷新效果
   */
  //下拉刷新事件
  onPullDownRefresh(){
    //1 重置数组
    this.setData({
      GoodsList:[]
    })
    //2 重置页码
    this.QueryPatams.current=1;
    //3 发送请求
    this.getGoodsList();

    //关闭下拉刷新
    wx.stopPullDownRefresh();
  }
})