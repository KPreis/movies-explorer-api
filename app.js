const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const rateLimiter = require('./middlewares/rateLimiter');
require('dotenv').config();

const { PORT = 3000, NODE_ENV, DB_ENV } = process.env;

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_ENV : 'mongodb://127.0.0.1:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(rateLimiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);

app.get('/signout', logout);

app.use('/users', require('./routes/users'));

app.use('/movies', require('./routes/movies'));

app.use('/', require('./routes/pageNotFound'));

app.use(errorLogger);

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
