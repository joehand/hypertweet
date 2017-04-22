#!/usr/bin/env node

var ram = require('random-access-memory')
var hypercore = require('hypercore')
var discovery = require('hyperdiscovery')
var minimist = require('minimist')
var chalk = require('chalk')
var moment = require('moment')
var dotenv = require('dotenv')
var hypertweet = require('.')

var argv = minimist(process.argv.slice(2), {
  alias: {help: 'h', dir: 'd'},
  default: {
    dir: process.cwd()
  },
  boolean: ['help', 'log']
})
dotenv.load()

if (argv.help) {
  console.error('hypertweet! streaming twitter api -> hypercore')
  console.error('')
  console.error('  hypertweet            create a hypertweet feed + share')
  console.error('          --dir /data   directory to store hypercore feed')
  console.error('          --log         display new tweets, useful for debugging')
  console.error('          --url         specify a streaming twitter endpoint')
  console.error('  hypertweet <key>      pretty print a shared hypertweet feed')
  console.error('')
  console.error('Also check out https://hypertweet.glitch.me/ & remix!!  =)')
  process.exit()
}

// tail hypercore stream + print
if (argv._[0]) {
  tailStream()
} else {
  // stream twitter data -> hypercore
  var opts = {
    streamUrl: argv.url
  }
  hypertweet(argv.dir, opts, function (err, feed) {
    if (err) throw err
    console.log('Tweets streaming at:', feed.key.toString('hex'))
    if (argv.log) {
      var stream = feed.createReadStream({tail: true, live: true})
      stream.on('data', function (tweet) {
        console.log(`${new Date().toLocaleString()} tweet by: ${tweet.user.name}`)
      })
    }
  })
}

function tailStream () {
  var key = argv._[0]
  var feed = hypercore(ram, key, {sparse: true, valueEncoding: 'json'})

  feed.ready(function () {
    console.log(chalk.magenta.bold('HyperTweet!!'))

    discovery(feed)
    feed.update(function () {
      var stream = feed.createReadStream({
        live: true,
        tail: true
      })
      stream.on('data', print)
      stream.on('error', function (err) {
        console.error(err)
        process.exit(1)
      })
    })
  })

  function print (tweet) {
    console.log(`${chalk.blue.bold(tweet.user.name)} (@${tweet.user.screen_name})`)
    console.log(tweet.text, '\n')
    var date = new Date(tweet.created_at)
    console.log(chalk.dim(moment(date).fromNow()))
    console.log('\n\n')
  }
}
