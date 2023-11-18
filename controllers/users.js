// const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // импортируем модель
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors/index');

const {
  NODE_ENV, JWT_SECRET,
} = process.env;

module.exports.getUserAct = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      }
      return res.json(user);
    })
    .catch((err) => {
      next(err);
    });
};// возвращает информацию о текущем пользователе
module.exports.createUser = (req, res, next) => {
  // console.log('ddd', req.body);
  const {
    email, password, name, about, avatar,
  } = req.body;

  // Хешируем пароль перед сохранением в базу данных
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        email, password: hashedPassword, name, about, avatar,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === 'ValidationError') { next(new BadRequestError('Переданы невалидный данные.')); return; }
          if (err.code === 11000) { next(new ConflictError('Пользователь с таким email уже существует.')); return; }
          next(err);
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Найдем пользователя по email
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      // Проверим пароль пользователя
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          // Если пароль правильный, создадим JWT
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret', // Замените на ваш секретный ключ для подписи токена
            { expiresIn: '7d' }, // Токен будет действителен в течение недели
          );
          // Отправим JWT клиенту в httpOnly куку
          res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // Время жизни куки в миллисекундах (неделя)
            httpOnly: true,
            sameSite: 'none', // Настройте в зависимости от требований вашего приложения
            secure: true, // Установите true, если используете HTTPS
          });

          return res.send({ message: 'Авторизация успешна' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  // Удаляем httpOnly куку с токеном
  res.cookie('jwt', '', {
    maxAge: 0,
    httpOnly: true,
    sameSite: 'none', // Настройте в зависимости от требований вашего приложения
    secure: true, // Установите true, если используете HTTPS
  });
  res.send({ message: 'Вы успешно вышли из системы' });
}; // выход из системы

// module.exports.updateUser = (req, res, next) => {
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name: req.body.name, about: req.body.about },
//     { new: true, runValidators: true },
//   )
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Пользователь по указанному _id не найден.');
//       }
//       return res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы невалидные данные пользователя.'));
//         return;
//       }
//       next(err);
//     });
// }; // обновляет профиль

module.exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }

    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы невалидные данные пользователя.'));
    } else if (err.code === 11000) {
      // Если возникает ошибка уникальности (дубликат email), вернуть статус 409
      next(new ConflictError('Пользователь с таким email уже существует.'));
    } else {
      next(err);
    }
  }
};
