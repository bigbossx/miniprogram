// miniprogram/pages/userCenter/userCenter.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    userInfo:{},
    currentTab:"published",
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
    showLoadMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    try{
      wx.showLoading({
        title: '加载中',
      })
      const { userId } = options
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
      this.fetchGoodsData()
    }catch(e){
      console.log(e)
    }finally{
      wx.hideLoading()
    }
    
  },
  fetchGoodsData(){
    try{
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
          let setParam=`${this.data.currentTab}.goodsData`
          this.setData({
            [setParam]: this.data[this.data.currentTab].goodsData.concat(res.result.data)
          })
          
        }, 
        complete:()=>{
          this.setData({
            showLoadMore: false
          })
        }
      })
    }catch(e){

    }
    
  },
  async handleChange({ detail }) {
    await this.setData({
      currentTab: detail.key,
    });
    this.fetchGoodsData()
  },
  onItemPress(event) {
    console.log(event)
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
  onReachBottom:async function () {
    let setParam = `${this.data.currentTab}.page`
    await this.setData({
      showLoadMore: true,
      [setParam]: this.data.currentTab.page + 1
    })
    this.fetchGoodsData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})