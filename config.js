module.exports = {
	http: {
        port: process.env.PORT || 3000
    },
    https: {
        port: false,

        // Paths to key and cert as string
        ssl: {
            key: '',
            cert: ''
        }
    },
    hostname: process.env.HOST || process.env.HOSTNAME,
    db: process.env.MONGOHQ_URL || 'mongodb://localhost:27017/news-interval'
};
