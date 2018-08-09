function isAuthenticated(req, res, next) {
  console.log('isAuthenticated');
  if (req.isAuthenticated()) {
    next()
  } else {
    res.render('login',{
      loginFailed:true
    })
  }
}


function isAdmin(req,res,next){
  console.log('isAdmin')
  console.log(req.user.id)
  if(req.user.id === 20){
    next()
  }else {
    res.redirect('/users')
  }
}
module.exports = {
  isAuthenticated,
  isAdmin
}
