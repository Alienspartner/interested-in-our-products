const app = getApp()
Page({

  data: {
    company:"",
    name:"",
    position:"",
    phone:"",
    ems:false,
    hidden:true,
    btnDisabled:false,
    address:"",
    price:100000,
    orderid:"19700101000000000000",
    vcode:"",
    second:60,
    btnValue:"获取验证码"
  },
  timer: function () {
    var that = this
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second+'s',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  checkform:function(){
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    var that = this
    if(that.data.ems==false){
      if(that.data.company==""||that.data.name==""||that.data.position==""||that.data.phone.length!=11||that.data.vcode==""){
        wx.showToast({
          title: "信息有误！",
          icon:"none"
        })
      }else{
        wx.hideLoading({
          success: (res) => {},
        })
        that.checkvcode()
      }
    }else{
      if(that.data.company==""||that.data.name==""||that.data.position==""||that.data.phone.length!=11||that.data.vcode==""||that.data.address==""){
        wx.showToast({
          title: "信息有误！",
          icon:"none"
        }) 
      }else{
        wx.hideLoading({
          success: (res) => {},
        })
        that.checkvcode()
      }
    }
  },
  sendsms:function(){
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    var that = this
    if(that.data.phone.length==11){
      var number = that.data.phone;
      wx.cloud.callFunction({
        name: 'zhenzisms',
        data: {
          $url: 'createCode',
          number: number,
          seconds: 5*60,
          length: 6,
          intervalTime: 60 * 1000//两条短信间隔时间(毫秒)，<=0 时无间隔
        }
      }).then((res) => {
        if(res.result.code != 'success'){
          wx.showToast({
            title: '网络错误！',
            icon:'none'
          })
        }else{
        var captcha = res.result.data;
        var templateParams = [captcha, '5分钟'];
        wx.cloud.callFunction({
          name: 'zhenzisms',
          data: {
            $url: 'send',
            apiUrl: 'https://sms.zhenzikj.com',
            number: number,
            templateId: '163',
            templateParams: templateParams
          }
        }).then((res) => {
          console.log(res.result);
          if(res.result.code == 0){
            that.timer()
            wx.showToast({
              title: '发送成功',
              icon:"none"
            })
          }else{
            wx.showToast({
              title: '发送失败！',
              icon:"none"
            })
          }
        })
        }
      }).catch((e) => {
        console.log(e);
      }); 
    }else{
      wx.showToast({
        title: '手机号错误!',
        icon:'none'
      })
    }
  },
  checkvcode:function(){
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    var that = this
    wx.cloud.callFunction({
      name: 'zhenzisms',
      data: {
        $url: 'validateCode',
        number: that.data.phone,
        code: that.data.vcode
      }
    }).then((res) => {
      if(res.result.code=="success"){
        wx.hideLoading({
          success: (res) => {},
        })
        that.getprice()
      }else{
        wx.showToast({
          title: '验证码错误!',
          icon:'none'
        })
      }
    }).catch((e) => {
      console.log(e);
    });
  },
  orderid:function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    var number='';
    for(let i=0;i<6;i++){
      number+=Math.floor(Math.random()*10).toString();
    }
    return year.toString()+month.toString()+date.toString()+day.toString()+hour.toString()+minu.toString()+sec.toString()+number
  },
  getprice:function(){
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    var that = this
    const db = wx.cloud.database({ env: 'crystal-7gqa7kiiab6c8bfe' })
    db.collection('price').where({
      name:"template"
    }).get({
      success: function (res) {
        that.setData({price:res.data[0].price})
        app.globalData.price=res.data[0].price
        wx.hideLoading({
          success: (res) => {},
        })
        that.paysubmit()
      }
    })
  },
  //提交订单
  paysubmit: function() {
    var that = this
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    that.setData({orderid:that.orderid()})
    app.globalData.orderid=that.data.orderid
    wx.cloud.callFunction({
      name: "pay",
      data: {
        orderid: that.data.orderid,
        money: that.data.price
      },
      success(res) {
        wx.hideLoading({
        })
        console.log("提交成功", res.result)
        that.pay(res.result)
      },
      fail(res) {
        wx.hideLoading({
        })
        console.log("提交失败", res)
      }
    })
  },

  //实现小程序支付
  pay(payData) {
    wx.showLoading({
      title: 'Loading',
      mask:true
    })
    var that = this
    //官方标准的支付方法
    wx.requestPayment({
      timeStamp: payData.timeStamp,
      nonceStr: payData.nonceStr,
      package: payData.package, //统一下单接口返回的 prepay_id 格式如：prepay_id=***
      signType: 'MD5',
      paySign: payData.paySign, //签名
      success(res) {
        wx.hideLoading({
          success: (res) => {},
        })
        this.timeout = setTimeout(that.infosubmit, 1000)
        console.log("支付成功", res)
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon:"none"
        })
        console.log("支付失败", res)
      },
      complete(res) {
        console.log("支付完成", res)
      }
    })
  },

  changeCompany:function(e){
    this.setData({company:e.detail.value})
  },
  changePhone:function(e){
    this.setData({phone:e.detail.value})
  },
  changePosition:function(e){
    this.setData({position:e.detail.value})
  },
  changeName:function(e){
    this.setData({name:e.detail.value})
  },
  changeEMS:function(e){
    if(e.detail.value==false){
      this.setData({hidden:true,ems:false})
    }
    if(e.detail.value==true){
      this.setData({hidden:false,ems:true})
    }
  },
  changeAddress:function(e){
    this.setData({address:e.detail.value})
  },
  changeVcode:function(e){
    this.setData({vcode:e.detail.value})
  },
  infosubmit:function(){
    wx.showLoading({
      title: 'Loading',
      mask: true
    })
    var that = this
    app.globalData.phone=that.data.phone
    wx.cloud.callFunction({
      name:'addClient',
      data:{
        company:that.data.company,
        phone:that.data.phone,
        position:that.data.position,
        name:that.data.name,
        ems:that.data.ems,
        address:that.data.address,
        orderid:app.globalData.orderid
      },
      success:res=>{
        wx.hideLoading({
          success: (res) => {},
        })
        wx.navigateTo({
          url: '../success/success',
        })
      },
      fail:res=>{
        wx.showToast({
          title: '网络错误！',
          icon:'none'
        })
      }
    })
  }
})