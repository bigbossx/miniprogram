// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    let { userId } = event
    let averageRate=0
    let result=await db.collection("xianyu_order").where({
      ownerId: userId
    }).get()
    console.log(result)
    if (result.data.length){
      result.data.map(item => {
        averageRate += item.rate
      })
    }
    return averageRate ? (averageRate / result.data.length) : averageRate
    
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