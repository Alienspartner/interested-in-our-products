// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'crystal-7gqa7kiiab6c8bfe' })
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('clients').add({
      data:
      {
        company:event.company,
        phone:event.phone,
        position:event.position,
        name:event.name,
        ems:event.ems,
        address:event.address,
        orderid:event.orderid
      }
    })
  } catch (e) {
    console.error(e)
  }
}