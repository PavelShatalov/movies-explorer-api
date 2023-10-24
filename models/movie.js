const mongoose = require('mongoose');

const regexImageLink = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: { // Ссылка на постер к фильму
    type: String,
    required: true,
    validate: {
      validator: (v) => regexImageLink.test(v),
      message: 'Некорректный формат ссылки на картинку',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexImageLink.test(v),
      message: 'Некорректный формат ссылки на картинку',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => regexImageLink.test(v),
      message: 'Некорректный формат ссылки на картинку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Ссылка на модель пользователя
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
