// pages/wealth/wealth.js
import { baseUrl } from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categoryList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryWealthCategory()
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
  queryCategory (e) {
    const { category } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../report/report?wealth=${category}`
    })
  },
  queryWealthCategory() {
    // 上传历史记录
    wx.request({
      url: `${baseUrl}/main/new-wealth/getCategoryOfWealth`,
      data: {},
      method: "get",
      success: res => {
        console.log(res.data)
        const { code, data } = res.data
        if (code === 0) {
          this.setData({
            categoryList: data
          })
        }
      }
    })
  },
})