function queryGoods(data) {
  const db = wx.cloud.database()
  return new Promise((resolve, reject) => {
    // 分页查询goods
    db.collection(data.dataBase).where({
        ...data.where
    })
      .skip((data.page - 1) * data.pageSize)
      .limit(data.pageSize)
      // .orderBy('date', 'desc')
      .get({
        success: res => {
          resolve(res)
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          reject(err)
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  })
}
module.exports = {
  queryGoods
}