/*
 * Main app module, contains server routes and basic request-response logic.
 */

var restify = require('restify');
var options = {
	serverName: 'Tweet-Perf Server',
	accept: [ 'application/json' ]
}
var server = restify.createServer(options);
server.listen(3000);

var engineModule = require('./engine');
var engine = new engineModule.Engine();

//------------------------------------------------------------------------------

/*
 * Obtaining user's timeline, example:
 * GET /statuses/user_timeline.json?screen_name=adamus
 */
server.get('/statuses/user_timeline.json', function(req, res) {

	if (req.params.screen_name) {

		engine.getTweets(req.params.screen_name, function(tweets) {
		
			if (tweets) {
			
				res.send(200, tweets);
			
			} else {
			
				res.send(200, []);
				
			}
		
		});

	} else {

		res.send(400);

	}

});

/*
 * Posting a tweet, example:
 * POST /statuses/update.json?status=I%20like%20pancakes&screen_name=adamus
 */
server.post('/statuses/update.json', function(req, res) {

	if (req.params.screen_name && req.params.status) {

		engine.postTweet(req.params.screen_name, req.params.status, function(tweet) {
		
			//if (tweet) {
			
				//res.send(201, tweet);
			
			//} else {
			
				res.send(500, {});
				
			//}
		
		});

	} else {

		res.send(400);

	}

});


 
//{
//  "created_at": "Fri Jun 24 17:43:26 +0000 2011",
//  "id": 84315710834212866
//}