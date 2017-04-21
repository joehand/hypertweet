var hypercore = require('hypercore')
var Chirp = require('chirp-stream')
var path = require('path')
var discovery = require('hyperdiscovery')

module.exports = archiverStream

function archiverStream (dir, cb) {
  var dataDir = dir || path.join(process.cwd(), 'data')

  var twitter = Chirp({
    consumer: {
      public: process.env.TWITTER_CONSUMER_KEY,
      secret: process.env.TWITTER_CONSUMER_SECRET
    },
    token: {
      public: process.env.TWITTER_ACCESS_TOKEN_KEY,
      secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  })

  var tweetstream = twitter.stream('https://userstream.twitter.com/1.1/user.json')
  var userFeed = hypercore(path.join(dataDir, 'feed'), {valueEncoding: 'json'})
  userFeed.ready(function (err) {
    if (err) return cb(err)

    discovery(userFeed)
    cb(null, userFeed)
  })

  tweetstream.on('json', function (data) {
    if (!data.user) return // ignore non-tweet stuff
    userFeed.append(data, function (err) {
      if (err) return console.error(err)
    })
  })

  tweetstream.on('end', function () {
    console.log('end')
  })

  tweetstream.on('error', function (err) {
    console.error(err)
  })
}
