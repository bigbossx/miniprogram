// component/goodsItem/goodsItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
    ifObtainedBtnCanShow:{
      type:Boolean,
      value:false
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
    handleContinuePublish(event){
      const id = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `./../../pages/publishDetail/publishDetail?id=${encodeURIComponent(id)}`
      })
    },
    handleToUserCenter(event){
      const id = event.currentTarget.dataset.userid;
      wx.navigateTo({
        url: `./../../pages/userCenter/userCenter?userId=${id}`
      })
    },
    handleRepublish(event){
      const id = event.currentTarget.dataset.id;
      this.triggerEvent("republishPress", { id })
    },
    handleClickObtainer(event){
      const id = event.currentTarget.dataset.id;
      this.triggerEvent("obtainedPress", { id })
    }
  }
})
