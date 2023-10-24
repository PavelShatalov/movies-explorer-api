// const http = require('http');
const Movie = require('../models/movie'); // импортируем модель
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/index');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
}; // возвращает все Movies

// module.exports.createMovies = (req, res, next) => {
//   const { name, link } = req.body;
//   const owner = req.user._id;
//   Movie.create({ name, link, owner })
//     .then((movie) => res.send(movie)) //
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы невалидные данные при создании карточки.'));
//         return;
//       }
//       next(err);
//     });
// };// создаёт карточку с переданными в теле запроса name и link

module.exports.createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });

    res.send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы невалидные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

// module.exports.deleteMovie = (req, res, next) => {
//   const { cardId } = req.params;
//   const owner = req.user._id;
//   Movie.findById(cardId)
//     .then((movie) => {
//       if (!movie) {
//         throw new NotFoundError('Карточка с указанным _id не найдена.');
//       }

//       // Проверяем, является ли текущий пользователь владельцем карточки
//       if (movie.owner.toString() !== owner) {
//         throw new ForbiddenError('У вас нет прав на удаление этой карточки');
//       }
//       // Если пользователь является владельцем, удаляем карточку
//       return movie.deleteOne().then(() => res.send({ message: 'Пост удалён' }));
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Некорректный ID карточки.'));
//         return;
//       }
//       next(err);
//     });
// };// удаляет Movie по _id

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const owner = req.user._id;

    const movie = await Movie.findById(cardId);

    if (!movie) {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }

    // Проверяем, является ли текущий пользователь владельцем карточки
    if (movie.owner.toString() !== owner) {
      throw new ForbiddenError('У вас нет прав на удаление этой карточки');
    }

    // Если пользователь является владельцем, удаляем карточку
    await movie.deleteOne();

    res.send({ message: 'Карточка удалена' });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Некорректный ID карточки.'));
    } else {
      next(err);
    }
  }
};
