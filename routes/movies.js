const express = require('express');

const router = express.Router();
const validation = require('../middlewares/validation');

const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovie); // возвращает все карточки
router.post('/', validation.createMovie, createMovie); // создаёт карточку с переданными в теле запроса name и link
router.delete('/:_id', validation.idMovie, deleteMovie); // удаляет карточку по _id

module.exports = router;
