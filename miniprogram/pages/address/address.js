// miniprogram/pages/address/address.js
const CloudFunc = require("./../../cloudDatabase/addDatas.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '天河区'],
    receiver: "",
    telephone: "",
    addressDetail: "",
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
  handleReceiverChange(event) {
    this.setData({
      receiver: event.detail.detail.value
    })
  },
  handleTelephoneChange(event) {
    this.setData({
      telephone: event.detail.detail.value
    })
  },
  handleAddressDetailChange(event) {
    this.setData({
      addressDetail: event.detail.detail.value
    })
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  saveAddress() {
    const data = {
      receiver: this.data.receiver,
      telephone: this.data.telephone,
      addressDetail: this.data.addressDetail,
      region: this.data.region
    }
    CloudFunc.addUsers(data).then((res) => {
      wx.showToast({
        title: '保存地址成功',
      })
    }).catch((err)=>{
      wx.showToast({
        icon: 'none',
        title: '保存地址失败'
      })
    })
  }
})