// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async(event, context) => {
  try {
    if (event.field) {
      const wxContext = cloud.getWXContext()
      const field = event.field
      if (event.type === "add") {
        console.log(event, [field])
        return await db.collection("users").where({
            _openid: wxContext.OPENID
          })
          .update({
            data: {
              [field]: db.command.unshift(event.goods)
            }
          })
      }
      if (event.type === "delete") {
        let res = await db.collection("users").where({
          _openid: wxContext.OPENID
        }).get()
        res.data.length > 0 && res.data[0][field].filter((item) => item).forEach((item, index) => {
          if (event.field === "address") {
            if (item.timestamp == event.goods._id) {
              res.data[0][field].splice(index, 1)
            }
          } else {
            if (item._id == event.goods._id) {
              res.data[0][field].splice(index, 1)
            }
          }

        })
        return await db.collection("users").where({
            _openid: wxContext.OPENID
          })
          .update({
            data: {
              [field]: res.data[0][field]
            }
          })
      }
      if (event.type === "edit") {
        let res = await db.collection("users").where({
          _openid: wxContext.OPENID
        }).get()
        res.data.length > 0 && res.data[0][field].filter((item) => item).forEach((item, index) => {
          if (event.field === "address") {
            if (item.timestamp == event.goods._id) {
              res.data[0][field][index] = event.goods.data
            }
          }
        })
        return await db.collection("users").where({
            _openid: wxContext.OPENID
          })
          .update({
            data: {
              [field]: res.data[0][field]
            }
          })
      }
    }
  } catch (e) {
    console.error(e)
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}