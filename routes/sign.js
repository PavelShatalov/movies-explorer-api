const express = require('express');

const router = express.Router();
const validation = require('../middlewares/validation');

const {
  login, createUser, logout,
} = require('../controllers/users');

router.post('/signin', validation.signUser, login);
router.post('/signup', validation.login, createUser);
router.post('/signout', logout);

module.exports = router;
