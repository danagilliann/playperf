'use strict';

var express = require('express');
// var controller = require('./soundcloud.controller');

var router = express.Router();

var request = require('request');


//router.get('/', controller.index);
//router.get('/:id', controller.show);
//router.post('/', controller.create);
//router.put('/:id', controller.update);
//router.patch('/:id', controller.update);
//router.delete('/:id', controller.destroy);

// router.post('/', function(req, res) {
// 	request('http://www.google.com', function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			return res.json(200, body);
// 	  }
// 	});
// });


// router.post('/playlist', function(req, res) {
// 	request('http://api.soundcloud.com/playlists.json?client_id=c8cff8892431fa994f15e719dc19e6ef&tags=' + req.body.genre.toString(), function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			return res.json(200, JSON.parse(body));
// 		}

// 	});
// });

router.post('/tracks', function(req, res) {
	request('http://api.soundcloud.com/tracks.json?client_id=c8cff8892431fa994f15e719dc19e6ef&tags=' + req.body.genre, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			return res.json(200, JSON.parse(body));
		}
	});
});

router.post('/specific', function(req, res){
	request('http://api.soundcloud.com/tracks.json?client_id=c8cff8892431fa994f15e719dc19e6ef&ids=' + req.body.id, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			return res.json(200, JSON.parse(body));
		}
	});
});



module.exports = router;




