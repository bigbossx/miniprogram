function addGoods(data) {
  const db = wx.cloud.database()
  return new Promise((resolve,reject)=>{
    db.collection('xianyu_goods').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
       resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

module.exports = {
  addGoods
}