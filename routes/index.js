const express = require('express');
const users = require('./users');
const arts = require('./arts');
const router = express.Router();
router.use('/arts', arts);
// router.use('/users', users);

module.exports = router;