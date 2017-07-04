
function salonFormat(salon) {
  var user = salon.get('user') || null
    , teacher = user != null ? user.get('teacher') : null
  return {
    user: user != null ? user.id : null,
    title: salon.get('title') || null,
    address: salon.get('address') || null,
    date: salon.get('date') || null,
    time: salon.get('time') || null,
    startTime: salon.get('startTime') || null,
    content: salon.get('content') || null,
    isFree: salon.get('isFree') || null,
    isOpen: salon.get('isOpen') || null,
    modle: salon.get('modle') || null,
    phone: salon.get('phone') || null,
    teacherName: teacher != null ? teacher.get('realName') : null,
    objectId: salon.id,
    createdAt: salon.createdAt,
    updatedAt: salon.updatedAt
  }
}

module.exports = salonFormat