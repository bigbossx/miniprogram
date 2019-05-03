// miniprogram/pages/category/category.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [{
        mainTitle: "生活娱乐",
        sub: ["生活百货", "食品生鲜", "家具家纺", "生活家电", "卡卷服务"]
      },
      {
        mainTitle: "母婴用品",
        sub: ["宝宝用品", "孕产用品", "童车玩具", "童车玩具"]
      },
      {
        mainTitle: "学习办公",
        sub: ["办公设备", "办公耗材", "书籍文具"]
      },
      {
        mainTitle: "运动户外",
        sub: ["健身用品", "户外用品", "运动穿戴", "骑行车品"]
      },
      {
        mainTitle: "二次元",
        sub: ["动漫周边", "游戏周边", "conplay", "Lolita"]
      },
      {
        mainTitle: "数码极客",
        sub: ["手机/平板", "手机配件", "电脑/配件", "影音用品", "游戏电玩", "其他配件"]
      },
      {
        mainTitle: "文化艺术",
        sub: ["文玩收藏", "工艺礼品", "玩具乐器"]
      },
      {
        mainTitle: "动植物",
        sub: ["宠物用品", "宠物", "园艺植物", "园艺用品"]
      },
      {
        mainTitle: "穿搭美妆",
        sub: ["女士鞋服", "男士鞋服", "时尚包包", "时尚配饰", "美容美妆"]
      },
      {
        mainTitle: "DIY",
        sub: ["手工DIY"]
      },
      {
        mainTitle: "其他",
        sub: ["其他"]
      },
    ],
    seletedIndex: 0,
    seletedSub: ["生活百货", "食品生鲜", "家具家纺", "生活家电", "卡卷服务"]
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
  changeTab(event) {
    const _index = event.currentTarget.dataset.index
    this.setData({
      seletedIndex: _index,
      seletedSub: this.data.menu[_index].sub
    })
  },
  handleClickMenu(event){
    const value=event.currentTarget.dataset.value
    app.globalData.categorySelectedValue = value
    app.globalData.categorySelectedType=this.data.menu[this.data.seletedIndex].mainTitle
    wx.switchTab({
      url: '/pages/publish/publish',
    })
  }
})