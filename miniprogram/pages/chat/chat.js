// miniprogram/pages/chat/chat.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const app=getApp()
const realtime = getApp().realtime;
const { TextMessage, Event } = require('./../../libs/realtime.weapp.min.js')
let pageConversation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    conversaterInfo:{},
    messageList:[],
    currentMessage:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log("chat params", JSON.parse(options.paramData))
    const { openId, avatarUrl,nickName }=JSON.parse(options.paramData)
    this.setData({
      conversaterInfo: JSON.parse(options.paramData)
    })
    wx.setNavigationBarTitle({
      title: nickName,
    })
    app.getUserInfoData().then((res) => {
      console.log("userInfo",res)
      that.setData({
        userInfo:{
          openId:res.openid,
          nickName:res.userInfo.nickName,
          avatarUrl:res.userInfo.avatarUrl
        }
      })
      realtime.createIMClient(res.openid).then(function (user) {
        user.on(Event.MESSAGE, function (message, conversation) {
          that.setData({
            messageList: that.data.messageList.concat(message)
          })
          conversation.read().catch(console.error.bind(console));
          that.pageScrollToBottom()
          console.log("message receive",message.text)
          wx.showToast({
            title: message.text,
          })
        });
        // 创建与对方之间的对话
        return user.createConversation({
          members: [openId],
          name: `${res.openid} & ${openId}`,
          unique: true
        });
      }).then(function (conversation) {
        // 发送消息
        // return 
        conversation.read().then(res=>console.log(res)).catch(console.error.bind(console));
        pageConversation=conversation
        
        var messageIterator = conversation.createMessagesIterator({ limit: 20 });
        messageIterator.next().then(function (result) {
          console.log(result)
          that.setData({
            messageList:result.value
          })
          that.pageScrollToBottom()
        }).catch(console.error.bind(console));
      })
    })
  },
  async handleSendMessage(){
    if (this.data.currentMessage){
      let sendResult = await pageConversation.send(new TextMessage(`${this.data.currentMessage}`))
      console.log(sendResult)
      this.setData({
        messageList:this.data.messageList.concat(sendResult),
        currentMessage:""
      })
      this.pageScrollToBottom()
    }
  },
  onInputMessageChange(event){
    this.setData({
      currentMessage: event.detail.value
    })
  },
  pageScrollToBottom () {
    wx.createSelectorQuery().select('.chat-container').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      console.log(rect)
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
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