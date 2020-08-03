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
  onLoad: function () {
    console.log('onLoad')
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      this.login(app.globalData.userInfo)
    } else if (this.data.canIUse) {
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
  onShow () {
    console.log('onShow')
  },
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
          app.globalData.userInfo.userId = id
          self.setData({
            userInfo: { ...app.globalData.userInfo, userId: id },
            hasUserInfo: true
          })
          self.getHistoryList(id)
        }
      }
    })
  },
  getHistoryList (userId) {
    const self = this
    const { records } = this.data
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
        const { code, data } = res.data
        if (code === 0) {
          data.forEach(item => {
            const date = item.createDate.slice(0, 10)
            const index = records.findIndex(record => record.date === date)
            console.log(index)
            if (index > -1) {
              records[index].articles.push(item.reportName)
            } else {
              records.push({
                date,
                articles: [item.reportName]
              })
            }
          })
          console.log(records)
          self.setData({
            records
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
