import { baseUrl } from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    noMore: false,
    name: '',
    page: 1,
    size: 10,
    total: 0,
    reportList: [],
    hotList: ['消费', '半导体', '军工', '券商', '医药', '贵州茅台', '君正集团', '光启技术'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
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
  query () {
    const { page, size, name } = this.data
    wx.request({
      url: `${baseUrl}/main/report/selectionReportList`,
      data: {
        page,
        size,
        name
      },
      method: "post",
      success: function (res) {
        // 
      }
    })
  }
})