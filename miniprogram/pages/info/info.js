const app = getApp()
Page({
   data:{
     price:'unknown',
     name:'unknown',
     type:'unknown',
     birthday:'unknown',
     origin:'unknown',
     data:''
  },
  onShow(){
    this.setData({price:app.globalData.price,name:app.globalData.name,type:app.globalData.type,birthday:app.globalData.birthday,origin:app.globalData.origin})
  },
  copy:function(){
    var that = this
    that.setData({data:app.globalData.name+' '+app.globalData.type+' '+app.globalData.origin+' '+app.globalData.birthday+' '+app.globalData.price})
    wx.setClipboardData({
      data: that.data.data,
    })
    wx.showToast({
      title: '复制成功',
      icon:'none'
    })
  }
})