function isAuthenticated(req, res, next) {
  console.log('isAuthenticated');
  if (req.isAuthenticated()) {
    next()
  } else {
    return res.redirect('/login')
  }
}

function getDate(){
    now = new Date();
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}

function isAdmin(req,res,next){
  if(req.user.id === 25){
    next()
  }else {
    res.redirect('/users')
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  getDate
}
