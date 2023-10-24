const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/index');

const {
  NODE_ENV, JWT_SECRET,
} = process.env;

const auth = (req, res, next) => {
  // Получите токен из куки с именем "jwt"
  // console.log('ddd', req.body);
  const token = req.cookies.jwt;
  // Проверьте наличие токена
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  let payload;
  try {
    // Верифицируйте токен с использованием секретного ключа
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret'); // Замените на ваш секретный ключ
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  // Добавьте пейлоуд токена к объекту запроса
  req.user = payload;
  next();
};
module.exports = auth;
