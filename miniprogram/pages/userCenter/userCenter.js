// miniprogram/pages/userCenter/userCenter.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    userInfo:{},
    isLoginUser:false,
    currentTab:"published",
    backgroundLibary:[
      "https://h1.ioliu.cn/bing/ToyXmasTree_EN-AU7637478450_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/TeslaCoil_EN-AU8096924390_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/OsoyoosExpressway_EN-AU12955968650_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/PragueChristmas_EN-AU8649790921_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/lidongjieya_ZH-CN9263684179_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/ZeroDegrees_EN-AU10117368234_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/Qxi_ZH-CN15613902048_1920x1080.jpg",
      "https://h1.ioliu.cn/bing/AthabascaCave_EN-AU0628983693_1920x1080.jpg"
    ],
    currentbackground:"",
    published:{
      goodsData: [],
      page:1
    },
    pending:{
      goodsData: [],
      page:1
    },
    sold:{
      goodsData: [],
      page:1
    },
    pageSize:10,
    showLoadMore:false,
    rateValue:0,
    rateOriginValue:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    try{
      const { userId } = options
      wx.showLoading({
        title: '加载中',
      })
      let randomIndex = Math.floor(Math.random() * this.data.backgroundLibary.length)
      let owner=await app.getUserInfoData()
      if (owner.openid===userId){
        await this.setData({
          isLoginUser: true,
          currentbackground:this.data.backgroundLibary[randomIndex]
        })
      }
      
      await this.setData({
        userId: userId || ""
      })
      console.log(this.data.userId)
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {
          id: this.data.userId
        },
        success: res => {
          wx.setNavigationBarTitle({
            title: `${res.result.nickName}的主页`,
          })
          this.setData({
            userInfo: res.result,
          })
        }
      })
      wx.cloud.callFunction({
        name: 'averageRate',
        data: {
          userId: this.data.userId
        },
        success: res => {
          console.log(res)
          this.setData({
            rateValue: Math.ceil(res.result),
            rateOriginValue:res.result
          })
        }
      })
      this.fetchGoodsData()
    }catch(e){
      console.log(e)
    }finally{
      wx.hideLoading()
    }
    
  },
  fetchGoodsData(){
    try{
      wx.showLoading({
        title: '',
      })
      wx.cloud.callFunction({
        name: 'getUserGoodsData',
        data: {
          params: {
            status: this.data.currentTab,
            page: 1,
            pageSize: this.data.pageSize
          },
          openId: this.data.userId
        },
        success: res => {
          let setParam=`${this.data.currentTab}.goodsData`
          this.setData({
            [setParam]: res.result.data
          })
          
        }, 
        complete:()=>{
          this.setData({
            showLoadMore: false
          })
          wx.hideLoading()
        }
      })
    }catch(e){

    }
    
  },
  async fetchMoreGoodsData() {
    try {
      wx.cloud.callFunction({
        name: 'getUserGoodsData',
        data: {
          params: {
            status: this.data.currentTab,
            page: this.data[this.data.currentTab].page,
            pageSize: this.data.pageSize
          },
          openId: this.data.userId
        },
        success: res => {
          let setParam = `${this.data.currentTab}.goodsData`
          this.setData({
            [setParam]: this.data[this.data.currentTab].goodsData.concat(res.result.data)
          })

        },
        complete: () => {
          this.setData({
            showLoadMore: false
          })
        }
      })
    } catch (e) {

    }

  },
  async handleChange({ detail }) {
    await this.setData({
      currentTab: detail.key,
    });
    this.fetchGoodsData()
  },
  onItemPress(event) {
    console.log(event.detail)
  },
  handleRepublish(event){
    const {id}=event.detail
    this.handleObtainedOrRepublish(id,"republish")
  },
  handleObtained(event){
    const { id } = event.detail
    this.handleObtainedOrRepublish(id,"obtained")
  },
  async handleObtainedOrRepublish(id,type){
    try{
      wx.showLoading({
        title: '',
      })
      let res= await wx.cloud.callFunction({
                  name: 'shelfOrObtainedGood',
                  data: {
                    id,
                    type
                  }
                })
      console.log(res)
      await this.fetchGoodsData()
    }catch(e){
      console.log(e)
    }finally{
      wx.hideLoading()
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
  onPullDownRefresh: async function () {
    await this.fetchGoodsData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom:async function () {
    let setParam = `${this.data.currentTab}.page`
    await this.setData({
      showLoadMore: true,
      [setParam]: this.data[this.data.currentTab].page + 1
    })
    this.fetchMoreGoodsData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})