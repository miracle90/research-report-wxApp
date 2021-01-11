//index.js
import { baseUrl } from '../../utils/config.js'

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    imgList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id, reportname } = options
    this.queryReportDetail(id)
    this.setData({
      title: decodeURIComponent(reportname)
    })
    wx.setNavigationBarTitle({
      title: decodeURIComponent(reportname)
    })
  },

  queryReportDetail(reportId) {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${baseUrl}/main/report/doReportToImage`,
      data: {
        reportId
      },
      method: "get",
      success: res => {
        wx.hideLoading()
        const { code, data } = res.data
        if (code === 0) {
          console.log(data)
          this.setData({
            imgList: data
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角发送给朋友
   */
  onShareAppMessage: function (res) {
    return {
      title: this.data.title
    }
  },
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function (res) {
    return {
      title: this.data.title
    }
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

  }
})