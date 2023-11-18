const { celebrate, Joi } = require('celebrate');
const JoiObjectId = require('joi-objectid')(Joi);

const regexImageLink = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;
// const regexLink = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
const createUser = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(30).required(),
});

const validateUser = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

const getUserSchema = Joi.object().keys({
  userId: JoiObjectId(),
});

const updateUserSchema = Joi.object().keys({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
});

// const createMovieSchema = Joi.object().keys({
//   name: Joi.string().required().min(2).max(30),
//   link: Joi.string().regex(regexLink).required(),
// });

const createMovieSchema = Joi.object().keys({
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().regex(regexImageLink).required(),
  trailerLink: Joi.string().regex(regexImageLink).required(),
  thumbnail: Joi.string().regex(regexImageLink).required(),
  movieId: Joi.number().required(),
  nameRU: Joi.string().required(),
  nameEN: Joi.string().required(),
});

const idMovieSchema = Joi.object().keys({
  movieId: JoiObjectId(),
});

const login = celebrate({ body: createUser });
const signUser = celebrate({ body: validateUser });
const getUser = celebrate({ params: getUserSchema });
const updateUser = celebrate({ body: updateUserSchema });
const createMovie = celebrate({ body: createMovieSchema });
const idMovie = celebrate({ params: idMovieSchema });

module.exports = {
  login,
  getUser,
  updateUser,
  createMovie,
  idMovie,
  signUser,
};
