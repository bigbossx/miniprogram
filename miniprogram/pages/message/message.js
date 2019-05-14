// miniprogram/pages/message/message.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
let app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMessageList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: async function (options) {
    try {
      let filterConvList = app.globalData.conversations.map(item => {
        return {
          id: item.id,
          lastMessage: item.lastMessage.text,
          lastMessageAt: new Date(item.lastMessageAt).toLocaleTimeString(),
          unreadMessagesCount: item.unreadMessagesCount,
          members: item.members
        }
      })
      console.log(app.globalData)
      let composeUserInfoList = filterConvList.map(async item => {
        let userInfoResult = await wx.cloud.callFunction({
          name: "getUserInfo",
          data: {
            id: item.members.find(item=>item!==app.globalData.openid)
          }
        })
        item.userInfo = userInfoResult.result
        return item
      })
      let finallyData = await Promise.all(composeUserInfoList)
      
      this.setData({
        allMessageList: finallyData
      })
    } catch (e) {

    }

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
  showData(e){
    console.log("aaa",this.data.allMessageList[0].userInfo)
    let paramData=JSON.stringify(e.currentTarget.dataset.params)
    console.log(e.currentTarget.dataset.params)
    wx.navigateTo({
      url: `./../chat/chat?paramData=${paramData}`,
    })
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