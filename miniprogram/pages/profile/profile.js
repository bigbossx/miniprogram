// miniprogram/pages/profile/profile.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openId:"",
    totalUnreadMessage:0,
    luxunSaying:[
      "抓周树人关我鲁迅什么事",
      "湖人总冠军",
      "我一句话都没说过",
      "我没说过这话，不过确实在理",
      "我一般不惹事，一旦惹了，那都不叫事，叫新闻",
      "陈独秀同学说得在理",
      "陈独秀同学，你又挡到我了",
      "原名李大钊，浙江周树人"
    ],
    currentSaying:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.getUserInfoData().then((res) => {
      console.log(res)
      this.setData({
        userInfo:res.userInfo,
        openId:res.openid
      })
    })

    let randomIndex=Math.floor(Math.random()*this.data.luxunSaying.length)

    this.setData({
      totalUnreadMessage:app.globalData.totalUnreadMessage||0,
      currentSaying: this.data.luxunSaying[randomIndex]
    })
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
    console.log("show")
    this.setData({
      userInfo: app.globalData.userInfo||{},
      totalUnreadMessage: app.globalData.totalUnreadMessage || 0,
    })
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
  handleToUserCenter(){
    wx.navigateTo({
      url: `./../userCenter/userCenter?userId=${this.data.openId}`,
    })
  },
  handleLogin(){
    wx.navigateTo({
      url: './../login/login',
    })
  }
})