//app.js
import regeneratorRuntime from "./util/regenerator-runtime/runtime.js"
const { Realtime, Event } = require('./libs/realtime.weapp.min.js')
const realtime = new Realtime({
  appId: '7qIbqFtvrVWo9yrKRkbdanqn-gzGzoHsz',
  appKey: 'k9s6Hw3BgHrh3YaFhUWqAJzy',
});
App({
  onLaunch: async function() {
    try{
      let _this=this
      console.log("onLaunch")
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          traceUser: true,
        })
      }
      _this.globalData={}
      // 调用云函数,获取openid，注册leancolud realtime监听消息
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login in app.js onlaunch] user openid: ', res)
          wx.showLoading({
            title: '初始化聊天中...',
          })
          realtime.createIMClient(res.result.openid).then(function (user) {
            console.log("__________realtime user ___________", user)
            user.on(Event.MESSAGE, function (message, conversation) {
              console.log('Message received: ' + message.text);
              wx.showToast({
                title: message.text,
              })
            });
            user.on(Event.UNREAD_MESSAGES_COUNT_UPDATE, function (conversations) {
              let totalUnreadMessgae=0
              for (let conv of conversations) {
                console.log(conv.id, conv.name, conv.unreadMessagesCount);
                totalUnreadMessgae+=conv.unreadMessagesCount
                var messageIterator = conv.createMessagesIterator({ limit: 10 });
              }
              if(totalUnreadMessgae){
                wx.setTabBarBadge({
                  index: 2,
                  text: String(totalUnreadMessgae),
                })
              }else{
                wx.removeTabBarBadge(2)
              }
              _this.globalData.totalUnreadMessage=totalUnreadMessgae
              _this.globalData.conversations=conversations
              wx.hideLoading()
            });
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }catch(e){
      console.log(e)
    }
  },
  realtime: realtime,
  async getUserInfoData() {
    wx.showLoading({
      title: '加载中',
    })
    console.log("0 after output")
    const res = await new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
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
      const userInfoRes = await new Promise((resolve, reject) => {
        wx.getUserInfo({
          success(res) {
            console.log("3 after output")
            resolve(res)
          }
        })
      })
      if (userInfoRes.userInfo) {
        console.log(this.globalData)
        this.globalData = {
          ...this.globalData,
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
    wx.hideLoading()
    return this.globalData
  }
})
