// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    return await db.collection("users").where({
      _openid:wxContext.OPENID
    })
      .update({
        data: {
          city: "广州"
        },
      })
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