//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loading: false,
    noMore: false,
    name: '',
    page: 1,
    size: 10,
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
    // this.queryReport()
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
  onReachBottom () {
    if (this.data.noMore) return
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.queryReport()
    })
  },
  selectReport (e) {
    const { url, reportid, reportname, companyname, category } = e.currentTarget.dataset
    this.uploadHistory({ reportId: reportid, reportName: reportname, companyName: companyname, category })
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
  uploadHistory (data) {
    wx.request({
      url: 'http://47.105.151.169:8083/main/report/insertReportHistory',
      data: {
        ...data,
        userId:  app.globalData.userInfo.userId
      },
      method: "post",
      success: function (res) {
        // 
      }
    })
  },
  getPhoneNumber(e) {
    // 授权or拒绝
    const self = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: 'http://47.105.151.169:8083/main/user/decodePhoneNumber',
        data: {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: "get",
        success: function (res) {
          const { code, result } = res.data
          if (code === 0) {
            const { phoneNumber } = JSON.parse(result)
            self.search()
            app.globalData.userInfo.phoneNumber = phoneNumber
            self.setData({
              userInfo:  app.globalData.userInfo,
              hasUserInfo: true
            })
          }
        }
      })
    }
  },
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  search () {
    this.setData({
      noMore: false,
      page: 1,
      reportList: []
    }, () => {
      this.queryReport()
    })
  },
  queryReport () {
    const { name, page, size, reportList } = this.data
    const self = this
    this.setData({
      loading: true
    }, () => {
      wx.request({
        url: 'http://47.105.151.169:8083/main/report/search',
        data: {
          name,
          page,
          size
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          const { code, data } = res.data
          if (code === 0) {
            const { records, total } = data
            records.forEach(item => {
              item.reportTime = item.reportTime.slice(2, 10)
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
