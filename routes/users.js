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
    
     let arts = user.related('arts').toJSON()
      res.render('users/user',{
        posts: arts,
        id: user.attributes.id
      })
  })
  .catch(err=>{
    res.json({"message": err.message})
  })
})

router.delete('/:id', helper.isAdmin, (req,res)=>{
  let id = req.params.id;
  return new User({ id: id })
    .destroy()
    .then(result => {
      console.log('delete')
      res.redirect('/users')
    })
    .catch(err => {
      res.send('there has been an error')
    })
})
   
 

  module.exports = router;