// miniprogram/pages/address/address.js
const CloudFunc = require("./../../cloudDatabase/operateDatas.js")
const CloudFuncGet = require("./../../cloudDatabase/getDatas.js")
import regeneratorRuntime from "./../../util/regenerator-runtime/runtime.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    region: ['广东省', '广州市', '天河区'],
    receiver: "",
    telephone: "",
    addressDetail: "",
    pageSize: 10,
    page: 1,
    addressDatas: [],
    addAddressModalShow: false,
    modalTitle: "",
    selectedAddressIndex: "",
    operateId: "",
    deteleCofirmShow: false,
    actions: [{
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let res = await app.getUserInfoData()
    await this.setData({
      openid: res.openid
    })
    await this.fetchData(res.openid)
    wx.hideLoading()
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
  async onPullDownRefresh() {
    try {
      wx.showNavigationBarLoading()
      await this.fetchData(this.data.openid)
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    } catch (e) {
      wx.showToast({
        title: `下拉刷新异常${e}`,
      })
    }
  },
  fetchData(openid) {
    console.log(openid)
    wx.showLoading({
      title: '加载中',
    })
    CloudFuncGet.queryUser(openid).then((res) => {
      this.setData({
        addressDatas: res.data[0].address.filter((item) => item)
      })
      wx.hideLoading()
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: `加载失败${err}`,
      })
    })

  },
  handleShowAddModal() {
    this.setData({
      modalTitle: "新增地址",
      addAddressModalShow: true
    })
  },
  handleModalClose() {
    this.setData({
      addAddressModalShow: false
    })
  },
  handleReceiverChange(event) {
    this.setData({
      receiver: event.detail.detail.value
    })
  },
  handleTelephoneChange(event) {
    this.setData({
      telephone: event.detail.detail.value
    })
  },
  handleAddressDetailChange(event) {
    this.setData({
      addressDetail: event.detail.detail.value
    })
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  async handleSelectAddress(event) {
    let currentSelectedIndex = event.currentTarget.dataset.index
    let currentSelectedItem = event.currentTarget.dataset.item
    await this.setData({
      selectedAddressIndex: currentSelectedIndex
    })
    app.globalData.address = currentSelectedItem
    wx.navigateBack({
      ...currentSelectedItem
    })
  },
  //修改地址
  handleEditAddress(event) {
    this.setData({
      operateId: event.currentTarget.dataset.id
    })
    let editItem = event.currentTarget.dataset.item
    this.setData({
      modalTitle: "修改地址",
      region: editItem.region,
      receiver: editItem.receiver,
      telephone: editItem.telephone,
      addressDetail: editItem.addressDetail,
      addAddressModalShow: true
    })
  },
  //confirm确认删除
  async deleteAddressConfirm(event) {
    let id = event.currentTarget.dataset.id
    await this.setData({
      operateId: event.currentTarget.dataset.id,
      deteleCofirmShow: true
    })
  },
  async handleClickConfirm({
    detail
  }) {
    if (detail.index === 0) {
      this.setData({
        deteleCofirmShow: false
      });
    } else {
      const action = [...this.data.actions];
      action[1].loading = true;
      this.setData({
        actions: action
      });
      this.handleDeleteAddress().then((res) => {
        this.fetchData(this.data.openid)
        action[1].loading = false;
        this.setData({
          deteleCofirmShow: false,
          actions: action
        });
        wx.showToast({
          title: '删除地址成功',
        })
      }).catch((err) => {
        wx.showToast({
          icon: 'none',
          title: `删除地址失败${err}`
        })
      })
    }
  },
  //删除地址
  async handleDeleteAddress() {
    let where = {
      openId: this.data.openId
    }
    let goods = {
      _id: this.data.operateId
    }
    return await wx.cloud.callFunction({
      name: 'updateDbData',
      data: {
        type: "delete",
        field: "address",
        goods,
      }
    })
  },
  async saveAddress() {
    try {
      let data = {
        receiver: this.data.receiver,
        telephone: this.data.telephone,
        addressDetail: this.data.addressDetail,
        region: this.data.region,
        timestamp: new Date().getTime(),
        isDefault: false
      }
      if (this.data.modalTitle === "修改地址") {
        await wx.cloud.callFunction({
          name: 'updateDbData',
          data: {
            type: "edit",
            field: "address",
            goods: {
              _id: this.data.operateId,
              data
            },
          }
        })
        wx.showToast({
          title: '修改地址成功',
        })
        this.fetchData(this.data.openid)
        this.setData({
          addAddressModalShow: false
        })
      } else {
        await wx.cloud.callFunction({
          name: 'updateDbData',
          data: {
            type: "add",
            field: "address",
            goods: data,
          }
        })
        wx.showToast({
          title: '保存地址成功',
        })
        this.fetchData(this.data.openid)
        this.setData({
          addAddressModalShow: false
        })
      }
    } catch (e) {
      wx.showToast({
        icon: 'none',
        title: `保存地址失败${e}`
      })
    }
  }
})