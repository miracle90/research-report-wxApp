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
  onLoad: function () {
    this.queryArticle()
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
      this.queryArticle()
    })
  },

  /**
   * 用户点击右上角发送给朋友
   */
  onShareAppMessage: function (res) {
    return {
      title: '机构风向标'
    }
  },
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function (res) {
    return {
      title: '机构风向标'
    }
  },
 
  selectReport(e) {
    const { title, url } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../web/web?title=${title}&url=${url}`
      // url: `../web/web?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    })
  },
  queryArticle () {
    this.setData({
      loading: true
    }, () => {
      this.queryOrgArticle()
    })
  },
  queryOrgArticle() {
    const { page, size, reportList } = this.data
    const self = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: `${baseUrl}/main/article/getList`,
      data: {
        current: page,
        size
      },
      method: "get",
      success: function (res) {
        wx.hideLoading()
        const { code, data } = res.data
        if (code === 0) {
          const { records, total } = data
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