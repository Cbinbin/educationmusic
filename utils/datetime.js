
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

  output3monthweek(year, month) {
    var starttime = '00:00:00'
      , year = Number(year)
      , month = Number(month)
      , weekArr = []
    for(var i = month-1; i < month+2; i++) {
      var valmon = 0
        , valyear = 2017
      if(i > 12) {
        valmon = i-12
        valyear = year+1
      } else if(i == 0) {
        valmon = i+12
        valyear = year-1
      } else {
        valmon = i
        valyear = year
      }
      for(var j = 1; j < 5; j++) {
        var timeper = []
        if(j < 4) {
          timeper[0] = `${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`
          timeper[1] = `${valyear}-${valmon}-${7*j + 1} ${starttime}`
        } else {
          if(valmon == 12) {
            timeper[0] = `${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`
            timeper[1] = `${valyear+1}-${(valmon+1) - 12}-${1} ${starttime}`
          } else {
            timeper[0] = `${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`
            timeper[1] = `${valyear}-${valmon+1}-${1} ${starttime}`
          }
        }
        weekArr.push(timeper)
      }
    }
    return weekArr
  }

  output3monthweekstamp(year, month) {
    var starttime = '00:00:00'
      , year = Number(year)
      , month = Number(month)
      , weekArr = []
    for(var i = month; i < month+3; i++) {
      var valmon = 0
        , valyear = 2017
      if(i > 12) {
        valmon = i-12
        valyear = year+1
      } else if(i == 0) {
        valmon = i+12
        valyear = year-1
      } else {
        valmon = i
        valyear = year
      }
      for(var j = 1; j < 5; j++) {
        var timeper = []
        if(j < 4) {
          timeper[0] = new Date(`${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`).getTime()
          timeper[1] = new Date(`${valyear}-${valmon}-${7*j + 1} ${starttime}`).getTime()
        } else {
          if(valmon == 12) {
            timeper[0] = new Date(`${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`).getTime()
            timeper[1] = new Date(`${valyear+1}-${(valmon+1) - 12}-${1} ${starttime}`).getTime()
          } else {
            timeper[0] = new Date(`${valyear}-${valmon}-${7*(j-1) + 1} ${starttime}`).getTime()
            timeper[1] = new Date(`${valyear}-${valmon+1}-${1} ${starttime}`).getTime()
          }
        }
        weekArr.push(timeper)
      }
    }
    return weekArr
  }

  key3month(year, month) {
    var keyArr = []
      , year = Number(year)
      , month = Number(month)
    for(var i = month; i < month+3; i++) {
      var valmon = 0
        , valyear = 2017
      if(i > 12) {
        valmon = i-12
        valyear = year+1
      } else if(i == 0) {
        valmon = i+12
        valyear = year-1
      } else {
        valmon = i
        valyear = year
      }
      for(var j = 1; j < 5; j++) {
        if(j > 1) keyArr.push('')
        else keyArr.push(`${valmon}月`)
      }
    }
    return keyArr
  }

}

module.exports = datetime