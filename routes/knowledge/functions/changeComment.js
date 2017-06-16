
function changeComment(comments) {
  var commentes = []
  comments.forEach((onecomment)=> {
    var own = onecomment.get('own')
    commentes.push({
      ownId: own.id,
      ownName: onecomment.get('ownName') || null,
      retext: onecomment.get('retext'),
      commentId: onecomment.get('commentId') || null,
      otherId: onecomment.get('otherId') || null,
      otherName: onecomment.get('otherName') || null,
      objectId: onecomment.id,
      createdAt: onecomment.createdAt
    })
  })
  return commentes
}

module.exports = changeComment