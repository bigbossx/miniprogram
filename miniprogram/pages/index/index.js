//index.js
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
const app = getApp()

Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg'
    ],
    grids: [
      [{
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
      ],
      [{
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
        {
          url: "./../login/login",
          icon: "./../../images/home.png",
          label: "动植物",
        },
      ]
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    goodsData: [],
    logged: false,
    takeSession: false,
    requestResult: '',
    pageSize: 10,
    page: 1,
  },

  onLoad: function() {
    console.log("index load")
    this.getGoodsData()
  },
  onShow:function(){
    console.log("index show")
    console.log(app.globalData.openid)
  },
  getGoodsData() {
    CloudFuncGet.queryGoods({
      dataBase:"xianyu_goods",
      page: this.data.page,
      pageSize: this.data.pageSize,
      where: {
        status: "published"
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        goodsData: res.data,
      })
    }).catch((e) => {

    })
  },
  onItemPress(event) {
    console.log(event)
  },
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function() {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        // 上传图片
        const timeStamp = new Date().getTime()
        const cloudPath = 'vision-image' + timeStamp + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)
            console.log('[上传文件] 成功：', filePath)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})