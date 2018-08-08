function isAuthenticated(req, res, next) {
  console.log('wassup');
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

module.exports = {
  isAuthenticated
}