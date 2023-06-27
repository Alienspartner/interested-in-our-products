const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:1000
  },
  certificate:function(){
    var that = this
    wx.requestSubscribeMessage({//申请订阅支付成功通知
      tmplIds: ['kTDRjVKJiXXnklzXG8vChWqwclI3_1VQh7dmWqUx78M'],
      success(res) {
        if (res['kTDRjVKJiXXnklzXG8vChWqwclI3_1VQh7dmWqUx78M'] == 'accept') {
          wx.cloud.callFunction({
            name:'certificate',
            data:{
              openid:app.globalData.openid,
              orderid:app.globalData.orderid,
              price:that.data.price.toString()+"元",
              phone:app.globalData.phone,
              description:"下次交易可抵扣"+that.data.price.toString()+"元"
            }
          })
        } else {
          wx.showToast({
            title: '获取失败',
            icon: 'none'
          })
        }
      },
      fail(res) {
        wx.showToast({
          title: '订阅请求失败',
          icon: 'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({price:app.globalData.price/100})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})