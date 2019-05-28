const fs = require('fs');
const exec = require('child_process').exec;
const csv = require('csv-parser');
const uuidv1 = require('uuid/v1');

const PROJECT_PATH =
    '/usr/local/organization/home/YOUR_USER/Desktop/sailsjs-remote-commands-rpc/';

module.exports = {

  // GET
  // http://localhost:1337/api/getMovieList

  // POST query string
  // http://localhost:1337/api/getMovieDescription?movieName=ironman

  // POST  body
  // http://localhost:1337/api/getMovieDescription?
  // { "movieName": "ironman"}

  /**
   * Returns the description of a film after executing few commands:
   *
   * reads the filmHashTable.csv file to retrieve the hash code of the movie.
   * reads the movie description from a file with the same code.
   * writes an unique id file containing a copy of the file just readed.
   * runs 2 local commands:
   * *cd to the folter where is the file
   * *& print on screen the content of the file (cat command)
   * return the description to the user
   * remove file
   **/
  getMovieDescription: async function(req, res) {
    let movieParam = req.param('movieName');
    console.log('\n Searching:' + movieParam);

    let userMessage = {};
    let resultDescription = await parseRequest(movieParam, userMessage);
    console.log('\n #### Film Description Found: ' + resultDescription);

    if (!resultDescription) {
      return res.badRequest(
          {message: userMessage.message, serverError: userMessage.serverError});
    }

    return res.ok({data: {film: resultDescription}});
  },

  /**
   * Returns the list of available movies.
   */
  list: function(req, res) {
    let response = {movie_list: MovieService.getMovies()};
    return res.ok(response);
  }

};

async function parseRequest(movieParam, userMessage) {
  let filmDescription, movieHashCode, movieFileName, newFileName;

  // NO INPUT
  if (!movieParam) {
    userMessage.message = `Wrong parameter`;
    return;
  }

  newFileName = ''.concat(uuidv1());
  try {
    movieHashCode = await getFilmHashCode(movieParam);
    movieFileName = MovieService.getFileName(movieHashCode);
    filmDescription = await readFIle(movieFileName);

    await writeFIle(newFileName, filmDescription);
    await runCommand(newFileName);

    removeFIle(newFileName);

    console.log('`n ##Movie Description found: ' + filmDescription);
    if (!filmDescription) {
      userMessage.message = `No film description found - try to repeat please`;
      return;
    }

    return filmDescription;

  } catch (error) {
    console.log('ERROR :' + error);
    userMessage.serverError = true;
    userMessage.message = `Error during movie search execution, try again `;
    return;
  }
}

/**
 * Returns the command you want to run (ls and cat)
 */
function getCommand(newFileName) {
  return `ls ${PROJECT_PATH}temp && \
  cat ${PROJECT_PATH}temp/${newFileName}.txt`
}

/**
 * Executes a specific command
 **/
function runCommand(newFileName) {
  console.log('\n## Run Command');
  return new Promise(function(resolve, reject) {
    console.log(getCommand(newFileName));

    var ch = exec(getCommand(newFileName), function(error) {
      if (error) reject('Subroutine Command Error ');
      setTimeout(function() {
        resolve(true);
      }, 2000);
    });
  });
}

/**
 * Creates a temp copy (txt file) containing the movie's description.
 **/
function writeFIle(newFileName, content) {
  console.log('\n## Write File:' + content);
  return new Promise(function(resolve, reject) {
    fs.writeFile(
        `${PROJECT_PATH}temp/${newFileName}.txt`, content, function(err) {
          if (err) reject(`Error writing file "${newFileName}.txt"`);
          resolve(true);
        });
  });
}

/**
 * Reads a txt file containing the movie's description.
 **/
function readFIle(fileName) {
  console.log('\n## Read File:' + fileName);
  return fs.readFileSync(
      `${PROJECT_PATH}staticResouces/${fileName}.txt`, 'utf8');
}

/**
 * Internal function to clean the server.
 * Removes a list of files, in this case the list will contain only the one file
 * created before.
 */
function removeFIle(newFileName) {
  let arrayToRemove = [];
  arrayToRemove.push(newFileName.concat('.txt'));
  console.log('\n## Remove File:' + newFileName);

  arrayToRemove.forEach(
      element => {fs.unlink(`${PROJECT_PATH}temp/${element}`, (err) => {
        if (err) {
          console.error('Error deleting temp_file! ' + element);
        }
        console.log(`File deleted! : ${element}`);
      })});
}

/**
 * Reads the CSV file 'filmHashTable.csv' and retrieves the hash of a specific
 * movie.
 **/
function getFilmHashCode(filmCode) {
  let csvResults = [];

  console.log('\n## Read CSV File');
  return new Promise(function(resolve, reject) {
    fs.createReadStream(`${PROJECT_PATH}/staticResouces/filmHashTable.csv`)
        .on('error',
            function(err) {
              reject('error reading CSV');
            })
        .pipe(csv())
        .on('data',
            (row) => {
              if (row.film_code === filmCode) csvResults.push(row);
            })
        .on('end', () => {
          let result = csvResults.length > 0 ? csvResults[0]['hash'] : null;
          console.log('Founded movie hash: ' + result);
          resolve(result);
          console.log('CSV file successfully processed');
        });
  });
}
