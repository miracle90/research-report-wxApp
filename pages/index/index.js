//index.js
import { baseUrl } from '../../utils/config.js'

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
    hotList: ['消费', '半导体', '军工', '券商', '医药', '贵州茅台', '君正集团', '光启技术'],
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
  onLoad () {
    // 获取关键字
    this.queryKeys()
  },
  onShow () {
    // console.log('index show', app.globalData.userInfo)
    let userInfo = wx.getStorageSync('u')
    if (userInfo) {
      console.log('index 1')
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      console.log('index 2')
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      console.log('index 3')
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.setStorageSync('u', res.userInfo)
          // app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReachBottom () {
    // 上滑加载
    if (this.data.noMore) return
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.queryReport()
    })
  },
  /**
   * 用户点击右上角发送给朋友
   */
  onShareAppMessage: function (res) {
    console.log(res)
  },
  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function (res) {
    console.log(res)
  },
  queryKeys() {
    wx.request({
      url: `${baseUrl}/main/keyword/get`,
      data: {},
      method: "get",
      success: res => {
        const { code, data } = res.data
        if (code === 0) {
          this.setData({
            hotList: data
          })
        }
      }
    })
  },
  go() {
    wx.showToast({
      title: '功能开发中，敬请期待~',
      icon: 'none',
      duration: 2000
    })
  },
  goFeatured () {
    wx.navigateTo({
      url: '../report/report'
    })
  },
  goCalc () {
    wx.navigateTo({
      url: '../calculator/calculator'
    })
  },
  goWealth () {
    wx.navigateTo({
      url: '../wealth/wealth'
    })
  },
  selectReport (e) {
    const { url, reportid, reportname, companyname, category } = e.currentTarget.dataset
    // 上传历史记录
    this.uploadHistory({
      reportId: reportid,
      reportName: reportname,
      companyName: companyname,
      category,
      url: url.indexOf('https') === 0 ? url : url.replace('http://', 'https://')
    })
    wx.navigateTo({
      url: `../web/web?url=${url.indexOf('https') === 0 ? url : url.replace('http://', 'https://')}`
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
  uploadHistory (data) {
    // 上传历史记录
    let userInfo = wx.getStorageSync('u') || {}
    wx.request({
      url: `${baseUrl}/main/report/insertReportHistory`,
      data: {
        ...data,
        userId:  userInfo.userId
      },
      method: "post",
      success: function (res) {
        // 
      }
    })
  },
  getPhoneNumber(e) {
    let userInfo = wx.getStorageSync('u') || {}
    // 授权or拒绝
    const self = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: `${baseUrl}/main/user/decodePhoneNumber`,
        data: {
          openId: userInfo.openId,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        method: "get",
        success: function (res) {
          const { code, result } = res.data
          if (code === 0) {
            const { phoneNumber } = JSON.parse(result)
            self.search()
            userInfo.phoneNumber = phoneNumber
            wx.setStorageSync('u', userInfo)
            self.setData({
              userInfo: userInfo,
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
  queryHot (e) {
    const { label } = e.target.dataset
    this.setData({
      name: label,
      noMore: false,
      page: 1,
      reportList: []
    }, () => {
      this.queryReport()
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
        url: `${baseUrl}/main/report/search`,
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
    })
  },
  getUserInfo: function(e) {
    wx.setStorageSync('u', { ...this.data.userInfo, ...e.detail.userInfo })
    // app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: { ...this.data.userInfo, ...e.detail.userInfo },
      hasUserInfo: true
    })
  }
})
