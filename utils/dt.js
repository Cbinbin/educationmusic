
var dt = {

  betweenTime: function(time1, time2) {
    var hourb 
      , minb
    if(time1 && time2) {
      time1[0] = Number(time1[0])
      time1[1] = Number(time1[1])
      time2[0] = Number(time2[0])
      time2[1] = Number(time2[1])
      if(time2[1] < time1[1]) {
        time2[0] = time2[0] - 1
        time2[1] = time2[1] + 60
      }
      hourb = time1[0]+parseInt((time2[0]-time1[0])/2)
      minb = time1[1]+parseInt((time2[1]-time1[1])/2)+(time2[0]-time1[0])%2*30
      if(minb >= 60) {
        minb = minb - 60
        hourb = hourb + 1
      }
      return [hourb, minb]
    } else return null
  },

  delSecond: function(time) {
    time = time.split(':')
    time = `${time[0]}:${time[1]}`
    return time
  },


  timePeriod: function(all, t1, t2) {
    if((all.hour > t1[0] && all.hour < t2[0]) || 
      (all.hour == t1[0] && all.minute >= t1[1] && all.hour < t2[0]) || 
      (all.hour > t1[0] && all.hour == t2[0] && all.minute < t2[1]) || 
      (all.hour == t1[0] && all.hour == t2[0] && all.minute >= t1[1] && all.minute < t2[1])) return true
    else false
  },

  splitDate: function(date) {
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
  },

  dateAddZero: function(obj) {
    obj.month = obj.month < 10 ? `0${obj.month}` : obj.month
    obj.day = obj.day < 10 ? `0${obj.day}` : obj.day
    obj.hour = obj.hour < 10 ? `0${obj.hour}` : obj.hour
    obj.minute = obj.minute < 10 ? `0${obj.minute}` : obj.minute
    obj.second = obj.second < 10 ? `0${obj.second}` : obj.second
    return obj
  }

}

module.exports = dt