//Core module
const path = require('path');
const rootDir = require('../utils/pathUtil');
const Movies = require('../models/host_home');
const hostRouter = require('../routes/Hostroute');
let lastmovie = null;

exports.hostfirstpage = (req, res, next) => {

  Movies.fetchAll((logged) => {
    console.log("📦 All movies:", logged);
    res.render('index', { movies: logged });
  });

  // if (lastmovie) {
  //   console.log("Last entered movie:", lastmovie);
  //   res.render('index', { movies: [lastmovie] });
  // } else {
  //   res.render('index', { movies: [lastmovie] });
  // }
};

exports.addhome = (req, res, next) => {
  Movies.fetchAll((logged) => {
    // console.log("The entered data is:", logged);
    // res.sendFile(path.join(rootDir, 'views', 'add_movie.html'));
    res.render('add_movie', {
      editing: false,
      movie: {}
    });
  });
};

exports.postAddhome = (req, res, next) => {
  const { title, director, imdb, rating, year } = req.body;
  const movie = new Movies(title, director, imdb, rating, year);
  movie.save();
  lastmovie = movie;
  console.log("New movie saved:", movie);
  res.redirect('/host');

}

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  const action = req.query.action;
  console.log('Id that is pressed at home page of host is:', homeId);

  if (action === 'delete') {
    Movies.removeId(homeId, updatedList => {
      if (!updatedList) {
        console.log("The new updated list has not been received yet");
        // return res.redirect('/host');
        return res.send('404 error');

      }
      console.log('After deletion, we get:', updatedList);
      console.log("The homeId pressed is:", homeId);


      res.render('index', { movies: updatedList });
    })
  }
  else if (action === 'update') {
    console.log("The method is:", action);
    console.log("The id that is pressed is:", homeId);

    Movies.findById(homeId, (movieToEdit) => {
      if (!movieToEdit) {
        console.log("Movie not found for editing.");
        return res.redirect('/host');
      }

      // Show the edit form with current movie data
      res.render('add_movie', { editing: true, movie: movieToEdit });
    });
  }
  else {
    Movies.findById(homeId, home => {
      console.log("Movie details found", home);


      if (!home) {
        console.log("Movie not found");
        return res.redirect('/host');

      }

      res.render('movieDetail', { home: home });
    })

  }
}




exports.postUpdateMovie = (req, res, next) => {
  const homeId = req.body.id;
  const updatedData = {
    title: req.body.title,
    director: req.body.director,
    imdb: req.body.imdb,
    rating: req.body.rating,
    year: req.body.year
  };

  Movies.updateId(homeId, updatedData, (result) => {
    if (!result) {
      return res.status(404).send("Update failed: movie not found");
    }
    res.redirect('/host');
  });
};
