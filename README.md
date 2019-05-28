# remote-commands-rpc-sailsjs

 ### This project is an example that shows how to execute Bash file system commands  through http requests in a server with NodeJS and SailsJS.

- It exposes an endpoint to retrieve the list of available films:
	> **GET:** http://localhost:1337/api/getMovieList  >=> ironman, lord_of_the_rings, matrix


- It exposes an endpoint to retrieve the description of a film:
	> **POST query string:**  http://localhost:1337/api/getMovieDescription?movieName=ironman

	> **POST payload:**  http://localhost:1337/api/getMovieDescription?movieName // { "movieName": "ironman"}

The description is retrieved after executing few commands:  

	- read the staticResouces/filmHashTable.csv file to retrieve the hash code of the movie.

	- read the movie description from a file with the same code (filmX.txt).

	- write an 'unique' id file containing a copy of the file just readed. (it's just an example of how to write a file)

	- run 2 bash file system commands: (it's just an example of how to execute commands :D)

	- -cd to the folder where is the file

	- -print on screen the content of the file (cat command, and wait 2 seconds, to simulate longer operations)

	- return the movie description to the user

	- remove file



	A proper message and error code is returned if no film description was found or an error occurred during one of the server operations.

## Setup

`npm intall`

`node app.js`
 
## License

MIT