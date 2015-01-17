
var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'Yeeeez' });
});

app.use('/api', router);

app.listen(port);
console.log('Server is listening on port ' + port);
