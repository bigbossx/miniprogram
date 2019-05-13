// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const {id}=event
  const wxContext = cloud.getWXContext()
  let res= await db.collection('users').where({
    _openid: id,
  }).get()
  console.log(res)
  return {
    avatarUrl:res.data[0].avatarUrl,
    nickName:res.data[0].nickName,
    openId:res.data[0]._openid
  }
}