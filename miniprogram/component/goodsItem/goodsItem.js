// component/goodsItem/goodsItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemPress(event) {
      console.log(event)
      const id = event.currentTarget.dataset.id;
      console.log(id)
      this.triggerEvent("onGoodsItemPress", { id })

      wx.navigateTo({
        url: `./../../pages/goodsDetail/goodsDetail?id=${encodeURIComponent(id)}`
      })
    },
  }
})
