const app = getApp()
Page({
  data: {
    sn:''
  },
  search: function () {
    var that = this
    if(that.data.sn==''){
      wx.showToast({
        title: '请输入序列号',
        icon:'none'
      })
    }else{
      wx.showLoading({
        title: 'Loading',
        mask:true
      })
      const db = wx.cloud.database({ env: 'crystal-7gqa7kiiab6c8bfe' })
      db.collection('sn').where({
        sn:that.data.sn
      }).get({
        success: function (res) {
          if(res.data[0]==undefined){
            wx.showToast({
              title: '序列号不存在',
              icon:'none'
            })
          }else{
            app.globalData.name=res.data[0].name
            app.globalData.price=res.data[0].price
            app.globalData.type=res.data[0].type
            app.globalData.birthday=res.data[0].birthday
            app.globalData.origin=res.data[0].origin
            wx.hideLoading()
            wx.navigateTo({
              url: '../info/info',
            })
          }
        }
      })
    }
  },
  changeSN:function(e){
    this.setData({sn:e.detail.value})
  }
})