var request = require('request');
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


    request.get(options.url).on('error', function() {
      throw err;
    })
    .on('response', function() {
      console.log('Response Status Code: ', res.statusCode + '\n'
        + 'Response Message: ' + res.statusMessage + '\n'
        + 'Content Type: ' + res.headers['content-type'] + '\n'
        + 'Download running ... ');
    })
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});