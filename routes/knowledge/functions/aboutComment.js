const AV = require('leanengine')

function aboutComment(userId) {
  var returnComments = new Promise((resolve, reject)=> {
    var querykledge = new AV.Query('Knowledge')
      , userPot = AV.Object.createWithoutData('Usermusic', userId)
    querykledge.equalTo('user', userPot)
    querykledge.find().then((ownledges)=> {
      if(ownledges.length != 0) {
        var queryall = null
        if(ownledges.length > 1) {
          for(var i = 0; i < ownledges.length; i++) {
            if(i == 0) {
              var querycomment1 = new AV.Query('Comment')
                , kledgePot1 = AV.Object.createWithoutData('Knowledge', ownledges[i].id)
              querycomment1.equalTo('knowledge', kledgePot1)
              querycomment1.doesNotExist('other')
              var querycomment2 = new AV.Query('Comment')
                , kledgePot2 = AV.Object.createWithoutData('Knowledge', ownledges[i+1].id)
              querycomment2.equalTo('knowledge', kledgePot2)
              querycomment2.doesNotExist('other')
              queryall = AV.Query.or(querycomment1, querycomment2)
            } else if(i == ownledges.length-1) {
              var querycommentother = new AV.Query('Comment')
                , querycommentmy = new AV.Query('Comment')
              querycommentother.equalTo('other', userPot)
              querycommentmy.equalTo('own', userPot)
              querycommentmy.exists('other')
              queryall = AV.Query.or(querycommentother, queryall)
              queryall = AV.Query.or(querycommentmy, queryall)
            } else {
              var querycommentch = new AV.Query('Comment')
                , kledgePotch = AV.Object.createWithoutData('Knowledge', ownledges[i+1].id)
              querycommentch.equalTo('knowledge', kledgePotch)
              querycommentch.doesNotExist('other')
              queryall = AV.Query.or(querycommentch, queryall)
            }
          }
        } else {
          var querycomment = new AV.Query('Comment')
            , kledgePot = AV.Object.createWithoutData('Knowledge', ownledges[0].id)
          querycomment.equalTo('knowledge', kledgePot)
          querycomment.doesNotExist('other')
          var querycommentother = new AV.Query('Comment')
            , querycommentmy = new AV.Query('Comment')
          querycommentother.equalTo('other', userPot)
          querycommentmy.equalTo('own', userPot)
          querycommentmy.exists('other')
          queryall = AV.Query.or(querycommentother, querycomment)
          queryall = AV.Query.or(querycommentmy, queryall)
        }
        queryall.descending('createdAt')
        queryall.include('knowledge')
        queryall.include('own')
        queryall.include('comment')
        queryall.find().then((allcomment)=> {
          resolve(allcomment)
        })
      } else resolve(ownledges)
    })
  })
  return returnComments
}

module.exports = aboutComment