function queryUser(openid) {
  const db = wx.cloud.database()
  console.log(openid)
  return new Promise((resolve, reject) => {
    db.collection("users").where({
        _openid: openid
      })
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

function queryFilterGoods(data) {
  console.log(data)
  const db = wx.cloud.database()
  const _ = db.command
  let findQuery = data.where.params === "全部" ? _.and([{
    status: data.where.status
  }]) : _.and([{
      categoryType: data.where.params
    },
    {
      status: data.where.status
    }
  ])
  return new Promise((resolve, reject) => {
    // 分页查询goods
    db.collection(data.dataBase).where(findQuery).count().then((totalRes) => {
      db.collection(data.dataBase).where(findQuery)
        .orderBy("createTime","desc")
        .skip((data.page - 1) * data.pageSize)
        .limit(data.pageSize)
        // .orderBy('date', 'desc')
        .get({
          success: res => {
            let totalPage = Math.ceil(totalRes.total / data.pageSize)
            resolve({ ...res,
              total: totalRes.total,
              totalPage: totalPage
            })
            console.log('[数据库] [查询记录] 成功: ', res)
          },
          fail: err => {
            reject(err)
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
    })
  })
}

function queryGoods(data) {
  const db = wx.cloud.database()
  return new Promise((resolve, reject) => {
    // 分页查询goods
    db.collection(data.dataBase).where({
      ...data.where
    }).count().then((totalRes) => {
      db.collection(data.dataBase).where({
          ...data.where
        })
        .orderBy("createTime", "desc")
        .skip((data.page - 1) * data.pageSize)
        .limit(data.pageSize)
        // .orderBy('date', 'desc')
        .get({
          success: res => {
            let totalPage = Math.ceil(totalRes.total / data.pageSize)
            resolve({ ...res,
              total: totalRes.total,
              totalPage: totalPage
            })
            console.log('[数据库] [查询记录] 成功: ', res)
          },
          fail: err => {
            reject(err)
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
    })
  })
}

function queryGoodDetail(data) {
  const db = wx.cloud.database()
  return new Promise((resolve, reject) => {
    // 分页查询goods
    db.collection(data.dataBase).doc(data.where._id).get({
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
  queryGoods,
  queryFilterGoods,
  queryGoodDetail,
  queryUser
}