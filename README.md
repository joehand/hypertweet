# hypertweet

Proof of concept Twitter + [Dat](https://datproject.org) feed stream thingy.

Streams your twitter feed to a [hypercore](https://github.com/mafintosh/hypercore) feed. Pretty print your feed or stream it anywhere with [hyperpipe](https://github.com/mafintosh/hyperpipe).

![hypertweet](https://raw.githubusercontent.com/joehand/hypertweet/master/hypertweet.png)

## Install

```
npm install -g hypertweet
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

### Collect Feed Data

Streams your feed into a hypercore feed:

```sh
hypertweet [--dir=/joe/my-twitter-data/] # Saves in `cwd/data` or `--dir`
sharing 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4
2017-04-21T02:20:24.205Z 'tweet by:' 'some twitter user'
2017-04-21T02:20:25.000Z 'tweet by:' 'more chirps'
2017-04-21T02:20:30.043Z 'tweet by:' 'asdf'
```

### Print anywhere

Pretty print it in another terminal (or another computer anywhere):

```sh
hypertweet 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4

# pretty tweets here
```

### Or pipe

Pipe anywhere to anything.

```sh
npm install -g hyperpipe
hyperpipe /db 0c3ec59a8111fde379e7ef82e6610ec02daf6bd3b704f41554cd5fe76afd5cc4 > data.json
```

## License

[MIT](LICENSE.md)
