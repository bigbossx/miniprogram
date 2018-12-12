// miniprogram/pages/publishDetail/publishDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    transactionTypeTagsIndex:0,
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
  handleMoneyChange(event){
    console.log(event)
    this.setData({
      money: event.detail.detail.value
    })
  },
  onChangeTransactionType(event) {
    const detail = event.detail;
    console.log(event.detail)
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
  handleClickItem({detail}) {
    const index = detail.index;
    this.setData({
      weight:this.data.weightActions[index].name,
      visibleActions: false
    })
  },
})