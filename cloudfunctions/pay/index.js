//云开发实现支付
const cloud = require('wx-server-sdk')
cloud.init({env:"crystal-7gqa7kiiab6c8bfe"})

//1，引入支付的三方依赖
const tenpay = require('tenpay');
//2，配置支付信息
const config = {
  appid: 'wxa691a0c01e88789f', 
  mchid: '1604206413',
  partnerKey: 'GUANGZHOUCRYSTALTECHNOLOGYCOLTD1', 
  notify_url: 'https://mp.qq.weixin.com', 
  spbill_create_ip: '127.0.0.1' //这里填这个就可以
};

exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    orderid,
    money
  } = event;
  //3，初始化支付
  const api = tenpay.init(config);

  let result = await api.getPayParams({
    out_trade_no: orderid,
    body: "琥珀石材样板",
    total_fee: money, //订单金额(分),
    openid: wxContext.OPENID //付款用户的openid
  });
  return result;
}