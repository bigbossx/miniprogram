// miniprogram/pages/goodsList/goodsList.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    totalPage: 0,
    page: 1,
    pageSize: 10,
    goodsData: [],
    showLoadMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    try {
      wx.showLoading({
        title: '加载中...',
      })
      let params = options.category
      await wx.setNavigationBarTitle({
        title: params
      })
      let data = {
        where: {
          status: "published",
          params
        },
        dataBase: "xianyu_goods",
        page: this.data.page,
        pageSize: this.data.pageSize,
      }
      let res = await CloudFuncGet.queryFilterGoods(data)
      await this.setData({
        goodsData: res.data
      })
      wx.hideLoading()
    } catch (e) {
      console.log(e)
    }

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

  }
})