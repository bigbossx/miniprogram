const db = wx.cloud.database()

function addGoods(data) {
  return new Promise((resolve, reject) => {
    db.collection('xianyu_goods').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function updateGoods(where, data) {
  return new Promise((resolve, reject) => {
    db.collection('xianyu_goods').doc(where.id).update({
      data: {
        status: "published",
        ...data
      },
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function addUserFavorites(data) {
  console.log(data)
  return new Promise((resolve, reject) => {
    //加入收藏
    delete data.goods._id
    delete data.goods._openid

    db.collection('users').doc({
      _openid: data.goods.openid
    }).update({
      data: {
        favorites: db.command.unshift(data.goods)
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function cancelUserFavorites(data) {
  console.log(data.goods.openid)
  return new Promise((resolve, reject) => {
    //取消收藏
    db.collection('users').doc("XBYjunffS3SWCidP").get().then((res)=>{console.log(res)})
    db.collection('users').doc({
      _openid: data.goods.openid
    }).get().then((res) => {
      console.log(res)
      // res.data[0].favorites.forEach((item, index) => {
      //   if (item.id == data.goods.id) {
      //     res.data[0].favorites.splice(index, 1)
      //   }
      // })
      // console.log(res.data[0].favorites)
      // db.collection('users').doc({
      //   _openid: data.goods.openid
      // }).update({
      //   data: {
      //     favorites: res.data[0].favorites
      //   },
      //   success: res => {
      //     console.log(res)
      //     resolve(res)
      //   },
      //   fail: err => {
      //     reject(err)
      //   }
      // })
    })
  })
}

function editGoodsFavorites(data) {
  let updateField = {}
  if (data.type == "add") {
    updateField = {
      collection: db.command.inc(1)
    }
  } else {
    updateField = {
      collection: db.command.inc(-1)
    }
  }
  return new Promise((resolve, reject) => {
    console.log(data)
    db.collection(data.dataBase).doc(data.goods.id).update({
      data: updateField,
      success(res) {
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function addUsers(data) {
  return new Promise((resolve, reject) => {
    db.collection('users').add({
      data: data,
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function addAddress(where, data) {
  return new Promise((resolve, reject) => {
    db.collection('users').doc({
      _openid: where.openId
    }).update({
      data: {
        address: db.command.unshift(data)
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        resolve(res)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}

function deleteAddress(where, data) {
  return new Promise((resolve, reject) => {
    console.log("where.openId",where.openId)
    db.collection('users').doc({
      _openid: where.openId
    }).get().then((res) => {
      console.log(res)
      res.data.address.forEach((item, index) => {
        if (item) {
          if (item.timestamp == data.id) {
            res.data.address.splice(index, 1)
          }
        }
      })
      db.collection('users').doc({
        _openid: where.openId
      }).update({
        data: {
          address: res.data.address
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  })
}

function editAddress(where, data) {
  return new Promise((resolve, reject) => {
    db.collection('users').doc({
      _openid: where.openId
    }).get().then((res) => {
      let newAddressArray = res.data.address.map((item, index) => {
        if (item) {
          if (item.timestamp == where.id) {
            item = {
              ...item,
              ...data
            }
          }
          return item
        }
      })
      db.collection('users').doc({
        _openid: where.openId
      }).update({
        data: {
          address: newAddressArray
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  })
}
module.exports = {
  addGoods,
  updateGoods,
  addUsers,
  addAddress,
  deleteAddress,
  editAddress,
  addUserFavorites,
  cancelUserFavorites,
  editGoodsFavorites
}