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

function updateGoods(where,data) {
  return new Promise((resolve, reject) => {
    db.collection('xianyu_goods').doc(where.id).update({
      data: {
        status:"published",
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
    db.collection('users').doc({
      _openid: where.openId
    }).get().then((res) => {
      res.data.address.forEach((item, index) => {
        if (item) {
          if (item.timestamp == data.id) {
            console.log("asdad")
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
  editAddress
}