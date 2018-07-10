var request = require('request');
var fs = require('fs');
var env = require('dotenv').config();

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
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
          throw err;
         })
         .on('response', function(response) {
          console.log(`Response Status Code: ${response.statusCode}
            \nReponse Message: ${response.statusMessage}
            \nContent Type: ${response.headers['content-type']}`)
         })
         .pipe(fs.createWriteStream(filePath))
         .on('end', function() {
          console.log('Download complete');
         })

}

getRepoContributors("jquery", "jquery", function(err, result) {

  console.log("Result:");
  for (user of result) {
    downloadImageByURL(user.avatar_url, `./avatars/${user.login}.jpg`);
  }
  console.log('Request complete.')
});