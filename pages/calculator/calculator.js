// pages/calculator.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDialog: false,
    marketValue: '',
    marketPrice: '',
    // 最新一期年报净利润
    a: '',
    // 未来三年净利润复合增速
    b: '',
    // 净利润永续增速
    c: '',
    // 总股本
    d: '',
    // 常量，无风险收益率
    E: '123',
    // 常量，信用利差
    F: '66',
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

  },
  introduction () {
    this.setData({
      showDialog: true
    })
  },
  close () {
    this.setData({
      showDialog: false
    })
  },
  calc () {
    const { a, b, c, d, E, F } = this.data
    // 校验
    if (!a || !b || !c || !d) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
    // e + f = 0.07
    // g =［a * (1 + b) ³*（8.5 + 2 * c）］/（1+e+f）³
    // h = g / d
    let marketValue = (a * (1 + b / 100) * (1 + b / 100) * (1 + b / 100) * (8.5 + 2 * c)) / ((1 + 0.07) * (1 + 0.07) * (1 + 0.07))
    console.log(marketValue)
    marketValue = Math.floor(marketValue)
    console.log(marketValue)
    let marketPrice = (+(marketValue / d)).toFixed(2)
    console.log(marketPrice)
    this.setData({
      marketValue: marketValue + '亿元',
      marketPrice: marketPrice + '元'
    })
  },
  bindA: function (e) {
    this.setData({
      a: e.detail.value
    })
  },
  bindB: function (e) {
    this.setData({
      b: e.detail.value
    })
  },
  bindC: function (e) {
    this.setData({
      c: e.detail.value
    })
  },
  bindD: function (e) {
    this.setData({
      d: e.detail.value
    })
  },
})