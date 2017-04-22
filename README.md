# hypertweet

Proof of concept Twitter + [Dat](https://datproject.org) feed stream thingy.

Streams your twitter feed to a [hypercore](https://github.com/mafintosh/hypercore) feed. Pretty print your feed or stream it anywhere with [hyperpipe](https://github.com/mafintosh/hyperpipe).

![hypertweet](https://raw.githubusercontent.com/joehand/hypertweet/master/hypertweet.png)

## Install

```sh
npm install -g hypertweet

hypertweet --help # see help!
```

### Set twitter tokens

[Get Twitter developer key](https://apps.twitter.com/) and either set them as environment variables or copy `.sample.env` to `.env` file.

```
process.env.TWITTER_CONSUMER_KEY,
process.env.TWITTER_CONSUMER_SECRET
process.env.TWITTER_ACCESS_TOKEN_KEY,
process.env.TWITTER_ACCESS_TOKEN_SECRET
```

## Usage

Use `hypertweet --help` to see all the options.

### Collect Feed Data

Streams your feed into a hypercore feed:

```sh
❯ hypertweet --dir=/joe/my-twitter-data/
sharing 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4

2017-04-21T02:20:24.205Z tweet by: 'some twitter user'
2017-04-21T02:20:25.000Z tweet by: 'more chirps'
2017-04-21T02:20:30.043Z tweet by: 'asdf'
```

### Print anywhere

Pretty print it in another terminal (or another computer anywhere):

```sh
❯ hypertweet 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4

# pretty tweets here
```

### Or pipe

Pipe anywhere to anything.

```sh
npm install -g hyperpipe
hyperpipe /db 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4 > data.json
```

## API

### `hypertweet(dir|storage, [opts], callback(err, feed))`

Create a stream from the twitter API and share via hypercore `feed`. Automatically joins network via `discovery-swarm`.

* `dir|storage`: directory or random access module, e.g `random-access-memory`.
* `opts.streamUrl`: the [twitter streaming api](https://dev.twitter.com/streaming/overview) endpoint you want. defaults to user.

## License

[MIT](LICENSE.md)
