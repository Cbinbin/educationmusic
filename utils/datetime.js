
class datetime {
  splitDate(date) {
    var objectDate = { year: null, month: null, day: null, week: null, hour: null, minute: null, second: null}
      , date = new Date(date)
    objectDate.year = date.getFullYear()
    objectDate.month = date.getMonth() + 1
    objectDate.day = date.getDate()
    objectDate.week = date.getDay()
    objectDate.hour = date.getHours()
    objectDate.minute = date.getMinutes()
    objectDate.second = date.getSeconds()
    return objectDate
  }

  addZero(obj) {
    obj.month = obj.month < 10 ? `0${obj.month}` : obj.month
    obj.day = obj.day < 10 ? `0${obj.day}` : obj.day
    obj.hour = obj.hour < 10 ? `0${obj.hour}` : obj.hour
    obj.minute = obj.minute < 10 ? `0${obj.minute}` : obj.minute
    obj.second = obj.second < 10 ? `0${obj.second}` : obj.second
    return obj
  }

}

module.exports = datetime