// miniprogram/pages/goodsDetail/goodsDetail.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
const CloudFunc = require("./../../cloudDatabase/operateDatas.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSkeleton: true,
    userData: {},
    id: "",
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    pageData: {},
    isCollected: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.setData({
      id: options.id
    })
    let res = await app.getUserInfoData()
    await this.fetchUserData(res.openid)
    await this.fetchData()
    this.setData({
      showSkeleton: false
    })
  },
  fetchData() {
    return new Promise((resolve, reject) => {
      CloudFuncGet.queryGoodDetail({
        dataBase: "xianyu_goods",
        where: {
          _id: this.data.id
        }
      }).then((res) => {
        resolve(res)
        this.setData({
          pageData: res.data,
        })
      }).catch((e) => {
        reject(e)
      })
    })
  },
  async fetchUserData(openid){
    console.log("fetchUserData")
    let userRes = await CloudFuncGet.queryUser(openid)
    if (userRes.data[0].favorites) {
      userRes.data[0].favorites.forEach(async (item, index) => {
        if (item.id == this.data.id) {
          await this.setData({
            isCollected: true
          })
        }else{
          await this.setData({
            isCollected: false
          })
        }
      })
    }
    await this.setData({
      userData: userRes.data[0]
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
  async onPullDownRefresh() {
    try {
      wx.showNavigationBarLoading()
      await this.fetchData()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    } catch (e) {
      wx.showToast({
        title: `下拉刷新异常${e}`,
      })
    }
  },
  async handleAddFavorites() {
    try {
      let data = {
        type: "add",
        dataBase: "xianyu_goods",
        goods: {
          id: this.data.pageData._id,
          ...this.data.pageData
        }
      }
      wx.showLoading({
        title: '加载中',
      })
      let res = await CloudFunc.addUserFavorites(data)
      let editRes = await CloudFunc.editGoodsFavorites(data)
      await this.fetchUserData(this.data.userData._openid)
      await this.fetchData()
      wx.hideLoading()
    } catch (e) {
      wx.showToast({
        title: `错误${e}`,
      })
    }
  },
  async cancelAddFavorites() {
    try{
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        type: "cancel",
        dataBase: "xianyu_goods",
        goods:{
          id: this.data.pageData._id,
          openid: this.data.userData._openid
        }
      }
      let res = await CloudFunc.cancelUserFavorites(data)
      let editRes = await CloudFunc.editGoodsFavorites(data)
      await this.fetchUserData(this.data.userData._openid)
      await this.fetchData()
      wx.hideLoading()
    }catch(e){
      wx.showToast({
        title: `错误${e}`,
      })
    }
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
  previewImage(event) {
    const currentPreviewUrl = event.currentTarget.dataset.currentUrl
    wx.previewImage({
      current: currentPreviewUrl, // 当前显示图片的http链接
      urls: this.data.pageData.images // 需要预览的图片http链接列表
    })
  },
})