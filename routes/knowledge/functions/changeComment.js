
function changeComment(comments) {
  var commentes = []
  comments.forEach((onecomment)=> {
    var own = onecomment.get('own')
    commentes.push({
      ownId: own.id,
      ownName: onecomment.get('ownName') || null,
      retext: onecomment.get('retext'),
      comment: onecomment.get('comment') || null,
      other: onecomment.get('other') || null,
      otherName: onecomment.get('otherName') || null,
      objectId: onecomment.id,
      createdAt: onecomment.createdAt
    })
  })
  return commentes
}

module.exports = changeComment