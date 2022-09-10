const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const BadRequestError = require('../errors/bad-request-error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(error);
    });
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(`Фильм с указанным _id ${req.params.movieId} не найдена`);
      }
      if (String(movie.owner._id) !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить фильм из чужой коллекции');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            if (error.name === 'CastError') {
              return next(new BadRequestError('Введены некорректные данные'));
            }
            return next(error);
          });
      }
    })
    .catch(next);
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};
