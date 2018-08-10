function isAuthenticated(req, res, next) {
  console.log('isAuthenticated');
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
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
  isAdmin
}
