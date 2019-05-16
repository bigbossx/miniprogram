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
    isCollected: false,
    commentValue:"",
    commentType:"comment",
    replyId:"",
    commentFocus:false
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
  async fetchUserData(openid) {
    try {
      console.log("fetchUserData")
      let userRes = await CloudFuncGet.queryUser(openid)
      if (userRes.data[0].favorites) {
        userRes.data[0].favorites.map(async(item, index) => {
          if (item._id == this.data.id) {
            await this.setData({
              isCollected: true
            })
          }
        })
      }
      await this.setData({
        userData: userRes.data[0]
      })
      console.log(this.data.isCollected)
    } catch (e) {

    }
  },
  handleEnterChat() {
    let paramData = JSON.stringify({
      openId:this.data.pageData._openid,
      avatarUrl: this.data.pageData.avatarUrl,
      nickName: this.data.pageData.nickName,
    })
    wx.navigateTo({
      url: `./../chat/chat?paramData=${paramData}`,
    })
  },
  handleCommentChange(event){
    // console.log(event.detail.value)
    this.setData({
      commentValue: event.detail.value
    })
  },
  handleCommentBlur(){
    this.setData({
      commentFocus:false,
      commentType: "comment",
    })
  },
  handleReply(event){
    console.log(event.currentTarget.dataset.replyid)
    this.setData({
      commentType:"reply",
      commentFocus:true,
      replyId: event.currentTarget.dataset.replyid
    })
  },
  handleCommentSend(){
    if(!this.data.commentValue){
      return false
    }
    wx.showLoading({
      title: '',
    })
    let commentData={
      commentType:this.data.commentType,
      userinfo:{
        openId:this.data.userData._openid,
        avatarUrl: this.data.userData.avatarUrl,
        nickName: this.data.userData.nickName
      },
      reply:[],
      timeStamp:new Date().getTime(),
      commentValue:this.data.commentValue
    }
    wx.cloud.callFunction({
      name: 'commentOrReply',
      data: {
        commentData,
        id: this.data.id,
        replyId:this.data.replyId
      },
      success: res => {
        this.setData({
          pageData:res.result.data,
          commentValue:""
        })
      },
      fail:e=>{
        console.log(e)
        wx.showToast({
          title: e,
        })
      },
      complete:()=>{
        this.setData({
          commentType: "comment",
          commentFocus: false
        })
        wx.hideLoading()
      }
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
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        type: "add",
        dataBase: "xianyu_goods",
      }
      let goods = {
        ...this.data.pageData
      }
      await wx.cloud.callFunction({
        name: 'updateDbData',
        data: {
          type: "add",
          field: "favorites",
          goods,
        }
      })
      let editRes = await CloudFunc.editGoodsFavorites(data, goods)
      await this.setData({
        isCollected: true
      })
      await this.fetchData()
      wx.hideLoading()
    } catch (e) {
      console.log(e)
      wx.showToast({
        title: `错误${e}`,
      })
    }
  },
  async cancelAddFavorites() {
    try {
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        type: "cancel",
        dataBase: "xianyu_goods",
      }
      let goods = {
        ...this.data.pageData
      }
      await wx.cloud.callFunction({
        name: 'updateDbData',
        data: {
          type: "delete",
          field: "favorites",
          goods,
        }
      })
      await this.setData({
        isCollected: false
      })
      let editRes = await CloudFunc.editGoodsFavorites(data, goods)
      await this.fetchData()
      wx.hideLoading()
    } catch (e) {
      console.log(e)
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