//app.js
import { baseUrl } from './utils/config.js'

App({
  onLaunch: function () {
    const self = this
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.showLoading({
      title: '加载中',
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const { code } = res
        wx.request({
          url: `${baseUrl}/main/user/code2Session`,
          data: {
            code
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            wx.hideLoading()
            const { code, openId, sessionKey } = res.data
            if (code === 0) {
              self.globalData.userInfo = { ...self.globalData.userInfo, openId, sessionKey }
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})