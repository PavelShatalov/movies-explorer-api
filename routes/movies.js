const express = require('express');

const auth = require('../middlewares/auth');

const router = express.Router();
const validation = require('../middlewares/validation');

const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/movies', auth, getMovie); // возвращает все карточки
router.post('/movies', auth, validation.createMovie, createMovie); // создаёт карточку с переданными в теле запроса name и link
router.delete('/movies/:movieId', auth, validation.idMovie, deleteMovie); // удаляет карточку по _id

module.exports = router;
