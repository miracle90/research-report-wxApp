//my.js
import { baseUrl } from '../../utils/config.js'

//获取应用实例
const app = getApp()

Page({
  data: {
    records: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onShow: function () {
    let userInfo = wx.getStorageSync('u')
    if (userInfo) {
      this.login(userInfo)
      this.setData({
        userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.login(res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          wx.setStorageSync('u', res.userInfo)
          // app.globalData.userInfo = res.userInfo
          this.login(res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onLoad () {},
  login (obj) {
    const self = this
    const { phoneNumber: mobile, openId: openid, nickName: nickname, avatarUrl: headimgurl } = obj
    wx.request({
      url: `${baseUrl}/main/user/login`,
      data: {
        mobile,
        openid,
        nickname,
        headimgurl
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        const { code, data: { id } } = res.data
        if (code === 0) {
          let userInfo = wx.getStorageSync('u') || {}
          userInfo = { ...userInfo, userId: id }
          wx.setStorageSync('u', userInfo)
          self.setData({
            userInfo,
            hasUserInfo: true
          })
          // 请求历史记录
          self.getHistoryList(id)
        }
      }
    })
  },
  getHistoryList (userId) {
    const self = this
    const records = []
    // const { records } = this.data

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: `${baseUrl}/main/report/reportHistoryList`,
      data: {
        userId
      },
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading()
        const { code, data } = res.data
        if (code === 0) {
          data.forEach(item => {
            const date = item.createDate.slice(0, 10)
            const index = records.findIndex(record => record.date === date)
            if (index > -1) {
              records[index].articles.push(item.reportName)
            } else {
              records.push({
                date,
                articles: [item.reportName]
              })
            }
          })
          self.setData({
            records
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    // 点击获取头像昵称
    let userInfo = wx.getStorageSync('u') || {}
    userInfo = { ...userInfo, ...e.detail.userInfo }
    wx.setStorageSync('u', userInfo)
    this.setData({
      userInfo,
      hasUserInfo: true
    })
  }
})
