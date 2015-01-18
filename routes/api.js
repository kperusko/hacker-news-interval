module.exports = function(app, express) {
    var router = express.Router();

    // test route
    router.get('/', function(req, res) {
        res.json({ message: 'It works!' });
	});
	
	return router;
};
