import {
  request
} from '../../request/index.js';
// pages/search/index.js
Page({
  data: {
    goods:[],
  //取消 按钮是否显示
  isFocus:false,
  //输入框的值
  inpValue:""
  },
  TimeId:1,
  //输入框改变 触发值的事件
  handleInput(e){
    // 获取输入的值
    const {value} = e.detail;
    // 检查是否合法
    if (!value.trim()) {
      //值不合法
      this.setData({
        goods:[],
        isFocus:false
      });
      return; 
    }
    //显示按钮
    this.setData({
      isFocus:true
    });
    // 防抖
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      //发送请求获取数据
      this.qsearch(value);
    }, 1000);
  },
  //发送请求获取搜索建议 数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    console.log(res);
    this.setData({
      goods:res
    });
  },
  //取消按钮
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
    clearTimeout(this.TimeId);
  }
})