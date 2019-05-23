// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    let { id, rate } = event
    await db.collection("xianyu_order").doc(id).update({
      data: {
        rate: rate,
        status:"completed"
      }
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