//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    reportList: [
      {
        i: 0,
        title: '中兴通讯（000063）公司信息更新报告：中兴通讯全球市场份额增长',
        broker: '开源证券',
        author: '赵良毕',
        num: 6,
        type: '推荐',
        date: '06-18'
      },
      {
        i: 1,
        title: '中兴通讯（000063）公司信息更新报告：中兴通讯全球市场份额增长',
        broker: '开源证券',
        author: '赵良毕',
        num: 6,
        type: '推荐',
        date: '06-18'
      },
      {
        i: 2,
        title: '中兴通讯（000063）公司信息更新报告：中兴通讯全球市场份额增长',
        broker: '开源证券',
        author: '赵良毕',
        num: 6,
        type: '推荐',
        date: '06-18'
      },
      {
        i: 3,
        title: '中兴通讯（000063）公司信息更新报告：中兴通讯全球市场份额增长',
        broker: '开源证券',
        author: '赵良毕',
        num: 6,
        type: '推荐',
        date: '06-18'
      }
    ],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
