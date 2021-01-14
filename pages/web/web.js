// pages/web/web.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { title, url } = options
    url = decodeURIComponent(url)
    title = decodeURIComponent(title)
    wx.setNavigationBarTitle({
      title
    })
    this.setData({
      title,
      url
    })
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.title
    }
  },
  /**
   * 用户点击右上角分享到朋友圈
   * 使用 web-view 组件的页面[pages/web/web]不支持分享到朋友圈
   */
  onShareTimeline: function (res) {
    return {
      title: this.data.title
    }
  }
})