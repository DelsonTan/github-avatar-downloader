var request = require("request");
var fs = require("fs");
var env = require("dotenv").config();
var mkdirp = require("mkdirp");
var args = process.argv.slice(2);

console.log("Welcome to the GitHub Avatar Downloader!");

function getRepoContributors(repoOwner, repoName, cb) {
  // logs an error onto the terminal and terminates program if
  // an incorrect number of arguments were given (not 2)
  if (args.length !== 2) {
    console.log("Error: Incorrect number of arguments, any extra arguments are ignored.");
  }
  // logs an error onto the terminal and terminates program if
  // either argument was not present
  if (args[0] === undefined || args[1] === undefined) {
    console.log("Error: <owner> and/or <repo> arguments not specified, please try again.");
    return;
  }
  // if avatars directory does not exist, creates it and notifies
  // the user
  if (!fs.existsSync("./avatars")) {
    console.log("Avatars directory does not exist in current directory, " +
      "creating new Avatars directory.");
    fs.mkdirSync("./avatars");
  }
  // if .env file does not exist, logs an error and terminates function
  if (!fs.existsSync(".env")) {
    console.log("The .env file is missing, initiation required. Please " +
      "use the template provided by \".env.example\".");
    return;
  }
  // logs error message if GITHUB_TOKEN in .env is empty
  if(!process.env.GITHUB_TOKEN) {
    console.log("GitHub token value is not assigned in .env file, please " +
      "input a valid token value  ");
    return;
  }

  var options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      "User-Agent": "request",
      Authorization: "token " + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {

    if (err) {
      console.log(err);
      return;
    }

    var parsed = JSON.parse(body);
    // logs error message and terminates program if
    // owner/repo does not exist
    if (parsed.message === "Not Found") {
      console.log("Error: Owner and/or repo does not exist.");
      return;
    }
    // logs error message and terminates program if credentials
    // in .env file is incorrect
    if (parsed.message === "Bad credentials") {
      console.log("Error: Incorrect credentials in .env file.");
      return;
    }

    cb(null, parsed);
  });
}

function downloadImageByURL(url, filePath, user) {
  request.get(url)
         .on("error", function(err) {
          console.log(err);
          return;
         })
         .on("response", function(response) {
          console.log(`Downloaded ${user}'s avatar successfully.`)
         })
         .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(args[0], args[1], function(err, result) {



  for (user of result) {
    downloadImageByURL(user.avatar_url, `./avatars/${user.login}.jpg`, user.login);
  }
  console.log("Request complete.")
});