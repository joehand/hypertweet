var hypercore = require('hypercore')
var Chirp = require('chirp-stream')
var discovery = require('hyperdiscovery')
var assert = require('assert')

module.exports = archiverStream

function archiverStream (dir, opts, cb) {
  if (typeof opts === 'function') cb = opts
  assert.ok(dir, 'hypertweet: dir/storage required')
  assert.ok(cb, 'hypertweet: callback required')
  if (!opts) opts = {}

  var storage = dir
  var streamUrl = opts.streamUrl || 'https://userstream.twitter.com/1.1/user.json'
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

  var tweetstream = twitter.stream(streamUrl, opts.streamOpts)
  var userFeed = hypercore(storage, {valueEncoding: 'json'})

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
    console.error('tweetstream end')
  })

  tweetstream.on('error', function (err) {
    console.error(err)
  })
}
