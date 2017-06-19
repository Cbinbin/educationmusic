
class arrx {

  inTo(array, val) {  
    var exist = false
    for(var i = 0; i < array.length; i++) {
      if(array[i] == val) return exist = true
    }
    return exist
  }

  inToModleId(array, val) {  
    var exist = false
    for(var i = 0; i < array.length; i++) {
      if(array[i].modleId == val && array[i].timestamp > new Date().getTime()) return exist = true
      else if(array[i].modleId == val && array[i].timestamp < new Date().getTime()) {
        array.splice(i, 1)
        return exist
      }
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

  pruneOne(val, array) {
    var array2 = array
    for(var i = 0; i < array.length; i++) {
      if(array[i] == val) {
        array2.splice(i, 1)
        i = array.length
      }
    }
    return array2
  }

  pruneOnePot(val, array) {
    var array2 = array
    for(var i = 0; i < array.length; i++) {
      if(array[i].id == val.id) {
        array2.splice(i, 1)
        i = array.length
      }
    }
    return array2
  }

  insertOne(val, array) {
    var array2 = array
      , exist = false
    for(var i = 0; i < array.length; i++) {
      if(array[i] == val) {
        exist = true
      }
    }
    if(!exist) array2.splice(0, 0, val)
    return array2
  }

}

module.exports = arrx