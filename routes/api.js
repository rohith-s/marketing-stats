var express = require('express'),
    router = express.Router();
router.get('/test', function (req, res) {
    res.status(200).send('hello');
});
module.exports = router;