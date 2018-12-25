// miniprogram/pages/login/login.js
const CloudFunc = require("./../../cloudDatabase/operateDatas.js")
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onGetUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    app.globalData.userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        const data = {
          ...app.globalData.userInfo
        }
        CloudFuncGet.queryUser(res.result.openid).then((res) => {
          if (res.data.length > 0) {
            wx.showToast({
              title: '欢迎回归',
            })
            wx.navigateBack({})
          } else {
            CloudFunc.addUsers(data).then((res) => {
              wx.showToast({
                title: '用户信息已经储存',
              })
              wx.navigateBack({})
            }).catch((err) => {})
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '获取openid失败',
        })
      }
    })
  },
})