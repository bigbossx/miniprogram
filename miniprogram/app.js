//app.js
import regeneratorRuntime from "./util/regenerator-runtime/runtime.js"
App({
  onLaunch: async function() {
    console.log("onLaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {}
  },
  async getUserInfoData() {
    console.log("0 after output")
    const res = await new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          console.log(2)
          resolve(res)
        },
        fail(err) {
          reject(err)
          wx.showToast({
            title: '获取用户setting异常',
          })
        }
      })
    })
    if (res.authSetting['scope.userInfo']) {
      console.log("2 after output")
      const userInfoRes = await new Promise((resolve, reject) => {
        wx.getUserInfo({
          success(res) {
            console.log("3 after output")
            resolve(res)
          }
        })
      })
      if (userInfoRes.userInfo) {
        this.globalData = {
          ...userInfoRes
        }
        const cloudRes = await new Promise((resolve, reject) => {
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              resolve(res)
            },
            fail: err => {
              reject(err)
            }
          })
        })
        this.globalData.openid = cloudRes.result.openid
      }
    }
    return this.globalData
  }
})