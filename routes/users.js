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

router.get('/:id', (req,res)=>{
  let id = req.params.id;
  return new User({id:id})
  .fetch({
    withRelated: ['arts']
  })
  .then(user=>{
    console.log('THIS IS USR',user)
     let arts = user.related('arts').toJSON()

      res.render('users/user',{
        posts: arts
      })

    if(user){
     
      // let _user = user.attributes.parse()
      // console.log(_user)
      // res.json(_user)
      // let arts = user.related('arts')
      // console.log(arts[0])
      // res.json(arts[0])
      // res.render('users/user',{
      //   posts: account
      // })
    }
  })
  .catch(err=>{
    res.json({"message": err.message})
  })
})
   
 

  module.exports = router;