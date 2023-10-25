const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();
const validation = require('../middlewares/validation');
const {
  updateUser, getUserAct,
} = require('../controllers/users');

// router.get('/', getUsers); // возвращает всех пользователей
router.get('/users/me', auth, getUserAct); // возвращает информацию о текущем пользователе
// router.get('/:userId', validation.getUser, getUserId); // возвращает пользователя по _id
router.patch('/users/me', auth, validation.updateUser, updateUser); // обновляет профиль
// router.patch('/me/avatar', validation.updateAvatar, updateAvatar); // обновляет аватар
// router.delete('/logout', logout); // удаляет пользователя

module.exports = router;
