
class arrx {

  inTo(array, val) {  
    var exist = false
    for(var i = 0; i < array.length; i++) {
      if(array[i] == val) return exist = true
    }
    return exist
  }

  shuffle(array) {
    var arraynew = array
    for(var i = arraynew.length-1; i >= 0; i--) {
      var randomNum = Math.floor(Math.random() * (i + 1))
        , tempAtNum = arraynew[randomNum]
      arraynew[randomNum] = arraynew[i]
      arraynew[i] = tempAtNum
    }
    return arraynew
  }

  randot(array) {
    var ran = Math.random()
      , randomNum = Math.floor(ran * array.length)
    return array[randomNum]
  }

  clearNull(array) {
    for(var i = 0, len = array.length; i < len; i++) {
      if(array[i] === null || array[i] === undefined) { // || array[i] == '' => 会去掉数字0
        array.splice(i, 1)
        len--
        i--
      }
    }
    return array
  }

  numSum(array) {
    var sum = 0
    for(var i = 0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
  }

}

module.exports = arrx