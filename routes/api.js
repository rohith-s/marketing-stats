var express = require('express'),
    router = express.Router();
router.get('/test', function (req, res) {
    res.send('hello');
});
module.exports = router;