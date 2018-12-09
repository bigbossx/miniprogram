// miniprogram/pages/publish/publish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNew: false,
    name: "",
    description: "",
    category: "",
    selectedImages: [],
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
    this.setData({
      category: app.globalData.categorySelectedValue || ""
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
  nameHandle(event) {
    this.setData({
      name: event.detail.detail.value
    })
  },
  descriptionHandle(event) {
    this.setData({
      description: event.detail.detail.value
    })
  },
  onChangeSwitch(event) {
    const detail = event.detail;
    this.setData({
      'isNew': detail.value
    })
  },
  chooseImage() {
    // 选择图片
    let count = this.data.selectedImages.length
    wx.chooseImage({
      count: 6 - count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const filePath = res.tempFilePaths
        this.uploadImageHandle(filePath)
      },
      fail: e => {
        console.error(e)
      },
      complete: function() {}
    })
  },
  uploadImageHandle(files) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    // 上传图片
    const filesBlob = files.map((item, index) => {
      const timeStamp = new Date().getTime()
      const cloudPath = 'vision-test-image' + timeStamp + item.match(/\.[^.]+?$/)[0]
      return this.uploadPromise(cloudPath, item).then((res) => {
        console.log('[上传文件] 成功：')
        this.setData({
          selectedImages: this.data.selectedImages.concat(item)
        })
      }).catch(e => {
        console.error('[上传文件] 失败：', e)
        wx.showToast({
          icon: "none",
          title: '上传失败',
          mask: true
        })
      })
    })
    Promise.all(filesBlob).then((res) => {
      wx.hideLoading()
    })
  },
  uploadPromise(cloudPath, item) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath: item,
        success: res => {
          resolve(res)
        },
        fail: e => {
          reject(e)
        },
        complete: () => {}
      })
    })
  },
  previewImage(event) {
    const currentPreviewUrl = event.currentTarget.dataset.currenturl
    wx.previewImage({
      current: currentPreviewUrl, // 当前显示图片的http链接
      urls: this.data.selectedImages // 需要预览的图片http链接列表
    })
  },
  deleteHandle(event) {
    const deleteIndex = event.currentTarget.dataset.index
    this.data.selectedImages.splice(deleteIndex, 1)
    this.setData({
      selectedImages: this.data.selectedImages
    })
  },
  handleNextSubmit() {
    if (!this.data.name) {
      wx.showToast({
        icon: "none",
        title: '请输入物品名称',
      })
      return false
    }
    if (!this.data.description) {
      wx.showToast({
        icon: "none",
        title: '请输入物品描述',
      })
      return false
    }
    if (!this.data.category) {
      wx.showToast({
        icon: "none",
        title: '请选择分类',
      })
      return false
    }
    if (!this.data.selectedImages.length > 0) {
      wx.showToast({
        icon: "none",
        title: '请添加图片',
      })
      return false
    }
    console.log( `${this.data.name}-${this.data.description}-${this.data.category}-${this.data.isNew}` )
  }
})