require("dotenv").config();

const request = require("request");

const keys = require("./keys.js");

const Spotify = require("node-spotify-api");

const spotify = new Spotify(keys.spotify);

const moment = require("moment");

const fs = require("fs");

var command = process.argv[2];

switch (command){

    case "concert-this":
        concertThis(process.argv.slice(3).join(' '));
        break;

    case "spotify-this-song":
        spotifyThis(process.argv.slice(3).join(' '));
        break;

    case "movie-this":
        movieThis(process.argv.slice(3).join('+'));
        break;

    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(error, data){            
            var datas = data.split(",");
            switch(datas[0]){
                case "concert-this":
                    concertThis(datas[1]);
                    break;
                case "spotify-this-song":
                    spotifyThis(datas[1]);
                    break;
                case "movie-this":
                    movieThis(datas[1]);
                    break;
                default:
                    console.log("bad arguments");                    
            }
        });
        break;

    default:
        console.log("bad arguments");
        
}

function concertThis(band){
    var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";
    request(URL, function(error, response, body){
        if (!error && response.statusCode === 200) {
    
            console.log("venue: " + JSON.parse(body)[0].venue.name);
            console.log("location: " + JSON.parse(body)[0].venue.city);
            console.log("date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"));
    
        }
    });
}

function spotifyThis(song){
    if(song === ''){
        song = "The Sign";
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }        
        console.log("artists: " + data.tracks.items[0].artists[0].name);
        console.log("name: " + data.tracks.items[0].name);
        console.log("preview: " + data.tracks.items[0].preview_url);
        console.log("album: " + data.tracks.items[0].album.name);

    });
}

function movieThis(movie){
    if(movie === ''){
        movie = "Mr.+Nobody";
    }
    var movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;
    request(movieURL, function(error, response, body){
        if (!error && response.statusCode === 200) {

            console.log("title: " + JSON.parse(body).Title);
            console.log("year: " + JSON.parse(body).Year);
            console.log("rated: " + JSON.parse(body).Rated);
            console.log("rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("country: " + JSON.parse(body).Country);
            console.log("language: " + JSON.parse(body).Language);
            console.log("plot: " + JSON.parse(body).Plot);
            console.log("actors: " + JSON.parse(body).Actors);
        }
    });
}
