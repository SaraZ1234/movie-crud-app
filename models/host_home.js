const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/pathUtil');
const { log } = require('console');
const homeDataPath = path.join(rootDir, 'data', 'movies.json');
const deleteDataPath = path.join(rootDir, 'data', 'delete.json');

module.exports = class Movie {
  constructor(title, director, imdb, rating, year) {
    this.title = title;
    this.director = director;
    this.imdb = imdb;
    this.rating = rating;
    this.year = year;
  }

  save() {
    Movie.fetchAll((movies) => {
      this.id = Math.random().toString();
      movies.push(this);
      fs.writeFile(homeDataPath, JSON.stringify(movies), (err) => {
        if (err) console.log("❌ Error writing:", err);
        else console.log("✅ Write success!");
      });
    });
  }

  static fetchAll(callback) {
    fs.readFile(homeDataPath, (err, data) => {
      if (err || !data.length) {
        return callback([]);
      }

      try {
        const parsed = JSON.parse(data);
        callback(parsed);
      } catch (e) {
        callback([]);
      }
    });
  }

  static findById(homeId, callback) {
    this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id == homeId);
      callback(homeFound);
    })
  }

  static removeId(homeId, callback) {
    this.fetchAll(homes => {
      const homeFound = homes.find(home => home.id === homeId.toString());

      if (!homeFound) {
        return callback(null);
      }

      let newArray = homes.filter(obj => obj.id !== homeId.toString());
      fs.writeFile(homeDataPath, JSON.stringify(newArray), (err) => {
        if (err) {
          console.log("❌Failed to Save Updated List:", err);
          return callback(null);
        }
        else {
          console.log("Updated array written successfully");
          callback(newArray)
        }
      });

    })
  }

  static updateId(homeId, UpdatedData, callback) {
    this.fetchAll(movies => {
      const updatedIdIndex = movies.findIndex(movie => movie.id == homeId.toString());

      if (updatedIdIndex == -1) {
        console.log("Movie not Found");
        return callback(null);
      }
      const updatedMovie = {
        ...movies[updatedIdIndex],
        ...UpdatedData,
        id: homeId.toString()
      };
      movies[updatedIdIndex] = updatedMovie;
      fs.writeFile(homeDataPath, JSON.stringify(movies), (err) => {
        if (err) {
          console.log("Failed to write updated data inside file");
          return callback(null);

        }
        else {
          console.log("Movie Updated Successfully");
          callback(updatedMovie)

        }
      })
    })
  }

 };
