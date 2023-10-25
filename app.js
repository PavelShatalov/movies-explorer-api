require('dotenv').config();
const express = require('express');
const helmet = require('helmet'); // Подключаем модуль helmet
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const { login, createUser, logout } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
// const validation = require('./middlewares/validation');
const centralError = require('./middlewares/centralError');
const {
  NotFoundError,
} = require('./errors/index');

const { dataMovies = 'mongodb://127.0.0.1:27017/filmsdb', PORT = 3000 } = process.env;
// const allowedOrigins = [
//   'https://pavel.student.nomoredomainsrocks.ru',
//   'https://api.pavel.student.nomoredomainsrocks.ru',
//   'localhost:3000', 'localhost:3001',
// ];
// const allowedCors = [
//   'https://praktikum.tk',
//   'http://praktikum.tk',
//   'https://pavel.student.nomoredomainsrocks.ru',
//   'https://api.pavel.student.nomoredomainsrocks.ru',
//   'http://pavel.student.nomoredomainsrocks.ru',
//   'http://api.pavel.student.nomoredomainsrocks.ru',
//   'localhost:3000', 'localhost:3001',
// ];

// const corsOptions = {
//   origin: allowedCors, // allowedOrigins,
//   credentials: true, // Разрешить передачу учетных данных (куки)
// };
mongoose.connect(dataMovies, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Успешное подключение к MongoDB');
  }).catch((error) => { console.error('Ошибка подключения к MongoDB:', error); });

const app = express();
app.use(cookieParser());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://praktikum.tk',
    'http://praktikum.tk',
    'http://api.pavel-diplom.nomoredomainsrocks.ru',
    'https://api.pavel-diplom.nomoredomainsrocks.ru',
    'http://pavel-diplom.nomoredomainsrocks.ru',
    'https://pavel-diplom.nomoredomainsrocks.ru',
  ],
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(express.json());
app.use(helmet()); // Используем helmet
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// app.post('/signin', validation.signUser, login);
// app.post('/signup', validation.login, createUser);
// app.post('/signout', logout);
// app.use('/users', auth, require('./routes/users'));
// app.use('/movies', auth, require('./routes/movies'));

app.use(require('./routes/sign'));
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use('*', auth, (req, res, next) => {
  next(new NotFoundError(`Запрашиваемый ресурс по адресу ${req.path} не найден`));
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(centralError);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
