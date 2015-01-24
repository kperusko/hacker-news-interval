module.exports = {
  db: {
    uri: process.env.MONGOHQ_URL ||
      'mongodb://localhost:27017/news-interval'
  },
  port: process.env.PORT || 3000,
  hostname: process.env.HOST || process.env.HOSTNAME,
  log: {
    format: 'combined'
  }
};
