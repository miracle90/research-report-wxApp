import { baseUrl } from '../../utils/config.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: '',
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
    const { wealth } = options
    this.setData({
      category: wealth || ''
    }, () => {
      this.queryReport()
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
    // 上滑加载
    if (this.data.noMore) return
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.queryReport()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function (res) {
    console.log(res)
  },
  selectReport(e) {
    const { url, reportid, reportname, companyname, category } = e.currentTarget.dataset
    this.uploadHistory({
      reportId: reportid,
      reportName: reportname,
      companyName: companyname,
      category,
      url: url.indexOf('https') === 0 ? url : url.replace('http://', 'https://')
    })
    wx.navigateTo({
      url: `../detail/detail?id=${reportid}&reportname=${reportname}`
    })
    return
    wx.showLoading({
      title: '加载中',
    })
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
  },
  uploadHistory(data) {
    // 上传历史记录
    let userInfo = wx.getStorageSync('u') || {}
    wx.request({
      url: `${baseUrl}/main/report/insertReportHistory`,
      data: {
        ...data,
        userId: userInfo.userId
      },
      method: "post",
      success: function (res) {
        // 
      }
    })
  },
  queryReport () {
    const { category } = this.data
    this.setData({
      loading: true
    }, () => {
      // 如果是新财富研报
      if (category) {
        wx.setNavigationBarTitle({
          title: '新财富视角'
        })
        this.queryWealthReport(category)
      } else {
        this.queryFeaturedReport()
      }
    })
  },
  queryWealthReport(category) {
    const { page, size, reportList } = this.data
    const self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${baseUrl}/main/new-wealth/getReportOfWealth`,
      data: {
        page,
        size,
        category
      },
      method: "post",
      success: function (res) {
        wx.hideLoading()
        const { code, data } = res.data
        if (code === 0) {
          const { records, total } = data
          records.forEach(item => {
            item.reportTime = item.reportTime.slice(0, 10)
          })
          if (!records || !records.length) {
            self.setData({
              noMore: true,
              loading: false
            })
          } else {
            self.setData({
              reportList: [...reportList, ...records],
              total,
              loading: false
            })
          }
        }
      }
    })
  },
  queryFeaturedReport () {
    const { page, size, name, reportList } = this.data
    const self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${baseUrl}/main/report/selectionReportList`,
      data: {
        page,
        size,
        name
      },
      method: "post",
      success: function (res) {
        wx.hideLoading()
        const { code, data } = res.data
        if (code === 0) {
          const { records, total } = data
          records.forEach(item => {
            item.reportTime = item.reportTime.slice(0, 10)
          })
          if (!records || !records.length) {
            self.setData({
              noMore: true,
              loading: false
            })
          } else {
            self.setData({
              reportList: [...reportList, ...records],
              total,
              loading: false
            })
          }
        }
      }
    })
  }
})