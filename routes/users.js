const express = require('express')
const router = express.Router();
const User = require('../models/User')
const helper = require('./helper')

router.use(helper.isAuthenticated)

router.get('/', (req,res)=>{
  return User
  .fetchAll()
  .then(users=>{
    let usersArr = users.map(element=>{
      return element.attributes;
    })
    if(!users){
      return res.json({"message":"there is no users"})
    }else {
      res.render('users/home',{
        users: usersArr
      })
    }
  })
  .catch(err=>{
    console.log(err);
    return res.json({"message": "there was an error"})
  })
})
  
   
 

  module.exports = router;