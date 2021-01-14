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
  onLoad: async function (options) {
    let { id, reportname, url } = options
    
    this.setData({
      title: decodeURIComponent(reportname)
    })
    wx.setNavigationBarTitle({
      title: decodeURIComponent(reportname)
    })
    const data = await this.queryReportDetail(id)
    console.log('queryReportDetail ', data)
    if (data) {
      this.setData({
        imgList: data
      })
    } else {
      wx.downloadFile({
        url: url.indexOf('https') === 0 ? url : url.replace('http://', 'https://'),
        success: function (res) {
          wx.hideLoading()
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath,
            success: function (res) {
              console.log('打开文档成功')
            },
            fail: function (res) {
              console.log('打开文档失败 ', res)
            }
          })
        }
      })
    }
  },

  queryReportDetail(reportId) {
    return new Promise((resolve, reject) => {
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
            resolve(data)
          } else {
            resolve()
          }
        },
        fail: () => {
          wx.hideLoading()
          resolve()
        }
      })
    })
  },

  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList.map(item => item.url) // 需要预览的图片http链接列表
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