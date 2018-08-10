const express = require('express')
const router = express.Router();
const User = require('../models/User')
const helper = require('./helper')
const Art = require('../models/Art')
router.use(helper.isAuthenticated)

router.get('/', (req,res)=>{
  return User
  .query({where: {deleted_at: null}})
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
  .query({where:{deleted_at: null}})
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
  const deleted_at = null
  return new User({ id: id })
    .save({deleted_at})  
    .then(result=>{
      console.log('deleted')
      res.redirect('/users')
    })
})
   
 

  module.exports = router;