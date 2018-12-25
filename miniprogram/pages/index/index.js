//index.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
const app = getApp()

Page({
  data: {
    showSkeleton: true,
    imgUrls: [
      'https://sr.aihuishou.com/sos/image/636782499370538790522990215.jpg?x-oss-process=image/quality,q_80&size=694x240',
      'https://sr.aihuishou.com/sos/image/6368092437329051601479400495.png?x-oss-process=image/quality,q_80&size=694x240'
    ],
    grids: [
      [{
          url: "./../login/login",
          icon: "./../../images/animals.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/digital.png",
          label: "数码极客",
        },
        {
          url: "./../login/login",
          icon: "./../../images/makeups.png",
          label: "穿搭美妆",
        },
        {
          url: "./../login/login",
          icon: "./../../images/mother_baby.png",
          label: "母婴用品",
        },
      ],
      [{
          url: "./../login/login",
          icon: "./../../images/entertainment.png",
          label: "生活娱乐",
        },
        {
          url: "./../login/login",
          icon: "./../../images/learn.png",
          label: "学习办公",
        },
        {
          url: "./../login/login",
          icon: "./../../images/sport.png",
          label: "运动户外",
        },
        {
          url: "./../login/login",
          icon: "./../../images/all.png",
          label: "全部",
        },
      ]
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsData: [],
    requestResult: '',
    pageSize: 2,
    page: 1,
    total: 0,
    totalPage: 0,
    showLoadMore: false
  },

  onLoad: async function() {
    try {
      console.log("index load")
      wx.showLoading({
        title: '加载中',
      })
      let res = await this.getGoodsData()
      await this.setData({
        goodsData: res.data,
        total: res.total,
        totalPage: res.totalPage,
        showSkeleton: false
      })
      wx.hideLoading()
    } catch (e) {
      wx.showToast({
        title: `首页数据加载异常${e}`,
      })
    }
  },
  onShow: function() {
    console.log("index show")
  },
  getGoodsData() {
    return new Promise((resolve, reject) => {
      CloudFuncGet.queryGoods({
        dataBase: "xianyu_goods",
        page: this.data.page,
        pageSize: this.data.pageSize,
        where: {
          status: "published"
        }
      }).then((res) => {
        console.log(res)
        resolve(res)
      }).catch((e) => {
        reject(e)
      })
    })
  },
  async onPullDownRefresh() {
    try {
      wx.showNavigationBarLoading()
      await this.getGoodsData()
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    } catch (e) {
      wx.showToast({
        title: `下拉刷新异常${e}`,
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function() {
    try {
      if(this.data.totalPage>this.data.page){
        await this.setData({
          showLoadMore: true,
          page: this.data.page + 1
        })
        let res = await this.getGoodsData()
        if (res.errMsg === "collection.get:ok") {
          this.setData({
            goodsData: this.data.goodsData.concat(res.data),
            showLoadMore: false
          })
        }
      }
    } catch (e) {
      wx.showToast({
        title: `上拉加载异常${e}`,
      })
    }
  },
  onItemPress(event) {
    console.log(event)
  },
  // onGetUserInfo: function(e) {
  //   if (!this.logged && e.detail.userInfo) {
  //     this.setData({
  //       logged: true,
  //       avatarUrl: e.detail.userInfo.avatarUrl,
  //       userInfo: e.detail.userInfo
  //     })
  //   }
  // },
  // onGetOpenid: function() {
  //   // 调用云函数
  //   wx.cloud.callFunction({
  //     name: 'login',
  //     data: {},
  //     success: res => {
  //       console.log('[云函数] [login] user openid: ', res.result.openid)
  //       app.globalData.openid = res.result.openid
  //       wx.navigateTo({
  //         url: '../userConsole/userConsole',
  //       })
  //     },
  //     fail: err => {
  //       console.error('[云函数] [login] 调用失败', err)
  //       wx.navigateTo({
  //         url: '../deployFunctions/deployFunctions',
  //       })
  //     }
  //   })
  // },

})