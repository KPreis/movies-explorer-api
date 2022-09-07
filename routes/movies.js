const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regExp } = require('../consts/consts');

const {
  createMovie,
  deleteMovieById,
  getMovies,
} = require('../controllers/movies');

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regExp),
    trailerLink: Joi.string().required().regex(regExp),
    thumbnail: Joi.string().required().regex(regExp),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.get('/', getMovies);

router.delete('/:movieId', deleteMovieById);

module.exports = router;
