const cloud = require('wx-server-sdk')
cloud.init({env: "crystal-7gqa7kiiab6c8bfe"})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openid,
      page: '../index/index',
      lang: 'zh_CN',
      data: {
        character_string1: {
          value: event.orderid
        },
        thing2: {
          value: '琥珀石材样板'
        },
        amount4: {
          value: event.price
        },
        phone_number9: {
          value: event.phone
        },
        thing11:{
          value:event.description
        }
      },
      templateId: 'kTDRjVKJiXXnklzXG8vChWqwclI3_1VQh7dmWqUx78M'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}