/**
 * Maps the hash codes and file names containing the movie's description.
 */
var contentsList = {
  123: 'film1',
  456: 'film2',
  789: 'film3',
};

/*
 * List of available movies.
 */
var movieList = ['ironman', 'lord_of_the_rings', 'matrix'];

module.exports = {

  /**
   * Get movie file name by id.
   */
  getFileName: function(movieHash) {
    return contentsList[movieHash] ? contentsList[movieHash] : null;
  },

  /**
   * Returns a list of all availables movies.
   */
  getMovies: function() {
    return movieList;
  }

};
