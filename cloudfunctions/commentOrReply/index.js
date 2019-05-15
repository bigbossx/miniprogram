// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log(event)
    let {id,commentData,replyId}=event
    if (commentData.commentType==="comment"){
      await db.collection("xianyu_goods").doc(id).update({
        data:{
          comment: db.command.unshift(commentData)
        }
      }) 
      return db.collection("xianyu_goods").doc(id).get()
    }else{
      let res=await db.collection("xianyu_goods").doc(id).get()
      if(res){
        let updateComment=res.data.comment.map(item=>{
          if (item.userInfo.openId === replyId){
            item.reply.push(commentData)
          }
          return item
        })
        await db.collection("xianyu_goods").doc(id).update({
          data: {
            comment: updateComment
          }
        }) 
      }
      return db.collection("xianyu_goods").doc(id).get()
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