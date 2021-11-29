//同时发送异步请求代码次数
let ajaxTime=0;
export const request=(params)=>{
    ajaxTime++;
    //显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true,
    });

    // 定义公共的url
    // url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"
    // const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    // 本地地址http://localhost:8080
    // 内网穿透地址 http://6672pc.natappfree.cc
    // const baseUrl="http://6672pc.natappfree.cc"
    const baseUrl="http://localhost:8080"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            url:baseUrl+params.url,
           success:(result)=>{
            resolve(result.data);
            // resolve(result.data.message);
        },
        fail:(err)=>{
            reject(err);
        },
        //成功与否都执行
        complete:()=>{ 
            ajaxTime--;
            if (ajaxTime===0) {
                //关闭等待
                wx.hideLoading();
            }
        }
    });
    })
}