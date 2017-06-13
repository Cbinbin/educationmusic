function yzm6() {
  var yzm = ''
  for(var i = 0; i < 6; i++) {
    yzm = yzm + Math.floor(Math.random()*10)
  }
  return yzm
}

module.exports = yzm6