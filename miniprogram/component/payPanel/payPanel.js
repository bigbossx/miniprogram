// component/payPanel/payPanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    password: {
      type: Array,
      value: []
    },
    isShow:{
      type:Boolean,
      value:false
    },
    money:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModal(event){
      this.triggerEvent("hidePanel")
    },
    inputChange(event){
      let inputValue = event.detail.value
      this.triggerEvent("handleChange", { inputValue })
    },
    handleFocus(){
      this.setData({
        isShow:true
      })
    }
  }
})
