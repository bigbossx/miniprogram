// miniprogram/pages/message/message.js
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
  onLoad: function (options) {
    console.log(app.globalData)
    let filterConvList=app.globalData.conversations.map(item=>{
      return {
        id:item.id,
        lastMessage:item.lastMessage,
        lastMessageAt:new Date(item.lastMessageAt),
        unreadMessagesCount:item.unreadMessagesCount,
        members:item.members
      }
    })
    let composeUserInfoList=filterConvList.map(item=>{
      wx.cloud.callFunction({
        name:"getUserInfo",
        data:{
          id:item.members[1]
        }
      }).then(res=>{
        // Object.assign(...item,{userInfo:res.result})
        // item.userInfo=res.result
        // item["userInfo"]=res.result
        Object.defineProperty(item, "userInfo", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: res.result
        });
      })
      return item
    })
    console.log(composeUserInfoList)
    composeUserInfoList.map(item=>{
      console.log(item.propertyIsEnumerable("userInfo"))
      console.log(item.propertyIsEnumerable("members"))
    })
    this.setData({
      allMessageList:composeUserInfoList
    })
    this.onShow()
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