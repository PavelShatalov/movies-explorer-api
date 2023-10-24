// const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// const validator = require('validator');

// const regexImageLink =
// /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     default: 'Жак-Ив Кусто',
//     minlength: 2,
//     maxlength: 30,
//   },
//   about: {
//     type: String,
//     default: 'Исследователь',
//     minlength: 2,
//     maxlength: 30,
//   },
//   avatar: {
//     type: String,
//     default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
//     validate: {
//       validator: (v) => regexImageLink.test(v),
//       message: 'Некорректный формат ссылки на картинку аватара',
//     },
//   },
//   email: {
//     type: String,
//     unique: true, // уникальное значение
//     required: true,
//     validate: {
//       validator: (v) => validator.isEmail(v), // валидация почты
//       message: 'Неправильный формат почты',
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     select: false, // не будет возвращаться пользователю
//   },
// });

// userSchema.set('toJSON', {
//   transform(doc, ret) {
//     const newRet = { ...ret }; // Создаем новый объект на основе ret
//     delete newRet.password;
//     return newRet;
//   },
// });

// module.exports = mongoose.model('user', userSchema);
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина имени - 2 символа'],
    maxlength: [30, 'Максимальная длина имени - 30 символов'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Поле "email" обязательно для заполнения'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "password" обязательно для заполнения'],
    select: false,
  },
});

userSchema.set('toJSON', {
  transform(doc, ret) {
    const newRet = { ...ret };
    delete newRet.password;
    return newRet;
  },
});

module.exports = mongoose.model('user', userSchema);
