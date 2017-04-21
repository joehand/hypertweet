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
  alias: {help: 'h'},
  boolean: ['help']
})
dotenv.load()

if (argv.help) {
  console.log('TODO')
  process.exit()
}

// tail hypercore stream + print
if (argv._[0]) {
  tailStream()
} else {
  // stream twitter data -> hypercore
  hypertweet(argv.dir, function (err) {
    if (err) throw err
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
