var request = require('request');
var fs = require('fs');
var env = require('dotenv').config();
var mkdirp = require('mkdirp');
var args = [process.argv[2], process.argv[3]]


console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (args[0] === undefined || args[1] === undefined) {
    console.log("Error: owner and/or repo arguments not specified, please try again");
    return;
  }

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      Authorization: 'token ' + process.env.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {

    if (err) {
      console.log(err);
      return;
    }

    var parsed = JSON.parse(body);

    cb(null, parsed);


    // request.get(options.url).on('error', function() {
    //   throw err;
    // })
    // .on('response', function() {
    //   console.log('Response Status Code: ', res.statusCode + '\n'
    //     + 'Response Message: ' + res.statusMessage + '\n'
    //     + 'Download running ... ');
    //     cb(err, result]);

    // })
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function(err) {
          console.log(err);
          return
         })
         .on('response', function(response) {

          console.log(`Response Status  Code: ${response.statusCode}
            \nReponse Message: ${response.statusMessage}
            \nContent Type: ${response.headers['content-type']}\n`)
         })
         .pipe(fs.createWriteStream(filePath))
         .on('end', function() {
          console.log('Download complete');
         })

}

getRepoContributors(args[0], args[1], function(err, result) {

  mkdirp('./avatars', function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  for (user of result) {
    downloadImageByURL(user.avatar_url, `./avatars/${user.login}.jpg`);
  }
  console.log('Request complete.')
});

