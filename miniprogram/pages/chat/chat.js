// miniprogram/pages/chat/chat.js
const app=getApp()
const realtime = getApp().realtime;
const { TextMessage, Event } = require('./../../libs/realtime.weapp.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.paramData)
    const { conversaterId }=JSON.parse(options.paramData)
    app.getUserInfoData().then((res) => {
      realtime.createIMClient(res.openid).then(function (user) {
        user.on(Event.MESSAGE, function (message, conversation) {
          console.log('Message received: ' + message.text);
          wx.showToast({
            title: message.text,
          })
        });
        // 创建与对方之间的对话
        return user.createConversation({
          members: [conversaterId],
          name: `${res.openid} & ${conversaterId}`,
          unique: true
        });
      }).then(function (conversation) {
        // 发送消息
        return conversation.send(new TextMessage(`i am ${res.openid}`));
      }).then(function (message) {
        console.log(`${res.openid} & ${conversaterId}`, '发送成功！');
      }).catch(console.error);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})