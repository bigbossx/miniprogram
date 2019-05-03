// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    if (event.type === "add") {
      return await db.collection("users").where({
          _openid: wxContext.OPENID
        })
        .update({
          address: db.command.unshift()
        })
    }
    if(event.type==="delete"){
      return await db.collection("users").where({
        _openid: wxContext.OPENID
      }).get().then(res=>{
        console.log(res)
      })
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