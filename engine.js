/*
 * Engine module responsible for almost all application logic.
 */
 
 /*
 * Database schema:
 * users: id, name, screen_name
 * statuses: id, user_id, text, created_at
 * followers: user_id, follower_id
 */

function Engine() {

    this.tweetId = 0;
    
};

exports.Engine = Engine;

var databaseModule = require('./database-mysql');
var database = new databaseModule.Database();

Engine.prototype.getTweets = function (username, callback) {

	console.log('getting tweets for user ' + username);

	database.selectTweets(username, function(tweets) {
		
		// no additional processing is needed
		if (tweets) callback(tweets);
		else callback([]);
	
	});

};

Engine.prototype.postTweet = function (username, status, callback) {

	console.log('posting tweet for user ' + username + ' with status: ' + status);

	database.insertTweet(username, status, function(tweet) {
	
		callback(tweet);
	
	});

};

Engine.prototype.getTimeline = function (username, callback) {

	// TODO proper implementation needed

	database.selectTimeline(username, function(tweets) {
	
		callback(tweets);
	
	});

};

//------------------------------------------------------------------------------

var dateSorter = function
