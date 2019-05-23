// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    let { openId, params } = event
    return await db.collection("xianyu_order").where({
      _openId: openId,
      status: params.status
    }).orderBy("create_time", "desc")
      .skip((params.page - 1) * params.pageSize)
      .limit(params.pageSize).get()

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