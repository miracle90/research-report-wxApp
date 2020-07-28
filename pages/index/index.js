//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '',
    page: 1,
    total: 0,
    reportList: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function () {
    this.queryReport()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  selectReport (e) {
    const { url } = e.currentTarget.dataset
    wx.showLoading({
      title: '加载中',
    })
    wx.downloadFile({
      url,
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
  getPhoneNumber(e) {
    // 授权or拒绝
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  queryReport () {
    const { name } = this.data
    const self = this
    wx.request({
      url: 'http://ahbahv.natappfree.cc/main/report/search',
      data: {
        name: '中兴',
        page: 1,
        size: 10
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const { code, data } = res.data
        if (code === 0) {
          const { records: reportList, total } = data
          reportList.forEach(item => {
            item.reportTime = item.reportTime.slice(2, 10)
          })
          console.log(reportList)
          self.setData({
            reportList,
            total
          })
        }
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
