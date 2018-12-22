// miniprogram/pages/publishDetail/publishDetail.js
const CloudFunc = require("./../../cloudDatabase/operateDatas.js")
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    visibleActions: false,
    weightActions: [{
        name: '1kg以下',
      },
      {
        name: '2kg-3kg'
      },
      {
        name: '3kg以上'
      }
    ],
    money: "",
    weight: "1kg以下",
    transactionTypeTagsIndex: 0,
    transactionTypeTags: [{
        name: '一口价',
        tagIndex: 0,
        color: 'theme'
      },
      {
        name: '拍卖',
        tagIndex: 1,
        color: 'theme'
      }
    ],
    shippingMethodsTags: [{
        name: '快递',
        checked: true,
        color: 'theme'
      },
      {
        name: '同城自取',
        checked: false,
        color: 'theme'
      }
    ],
    address: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      id: options.id || ""
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
    console.log(app.globalData)
    this.setData({
      address: app.globalData.address || ""
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
  handleMoneyChange(event) {
    console.log(event)
    this.setData({
      money: event.detail.detail.value
    })
  },
  onChangeTransactionType(event) {
    const detail = event.detail;
    this.setData({
      transactionTypeTagsIndex: event.detail.name,
    })
  },
  onChangeShippingMethods(event) {
    const detail = event.detail;
    console.log(event.detail)
    this.setData({
      ['shippingMethodsTags[' + event.detail.name + '].checked']: detail.checked
    })
  },
  handleSelectWeight() {
    this.setData({
      visibleActions: true
    });
  },
  handleCancelWeightActions() {
    this.setData({
      visibleActions: false
    });
  },
  handleClickItem({
    detail
  }) {
    const index = detail.index;
    this.setData({
      weight: this.data.weightActions[index].name,
      visibleActions: false
    })
  },
  async handlePublish() {
    //上架商品
    let where = {
      id: this.data.id
    }
    let data = {
      weight: this.data.weight,
      address: this.data.address,
      money: this.data.money,
      transactionType: this.data.transactionTypeTags[this.data.transactionTypeTagsIndex].name,
      shippingMethods: this.data.shippingMethodsTags.filter(item => item.checked)
    }
    await CloudFunc.updateGoods(where, data).then((res)=>{
      console.log(res)
      wx.showToast({
        title: '发布成功',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch((err)=>{
      wx.showToast({
        title: `error${err}`,
      })
    })  
  }
})