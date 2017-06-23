const AV = require('leanengine')

function integralChange(num, uId, remark, codeNum) {
  var cintegral = new AV.Object('Cintegral')
  if(Number(num) > 0) cintegral.set('kind', 'income')
  else if(Number(num) < 0) cintegral.set('kind', 'pay')
  else return
  cintegral.set('userId', uId)
  cintegral.set('remark', remark)
  cintegral.set('vary', Number(num))
  cintegral.set('zode', Number(codeNum))
  cintegral.save()
}

module.exports = integralChange