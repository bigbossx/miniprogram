import regeneratorRuntime from "./../util/regenerator-runtime/runtime.js"
const app=getApp()
export const wxApi = async(url, params = {})=>{
  if (wx.getStorageSync("token")||app.globalData.openid){
    Object.assign(param, {
      token: wx.getStorageSync("token")
    })
    let header = param.header || {
      'Content-Type': 'application/json',
      'token': params.token || ''
    }
    let method = params.method || 'GET'
    // hideLoading可以控制是否显示加载状态
    if (!params.hideLoading) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    let res = await new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: method,
        data: data,
        header: header,
        success: (res) => {
          if (res && res.statusCode == 200) {
            resolve(res.data)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          reject(err)
        },
        complete: (e) => {
          wx.hideLoading()
        }
      })
    })
    return res
  }else{
    wx.navigateTo({
      url: './../login/login',
    })
  }
}