/*
 * Engine module responsible for almost all application logic.
 */

function Engine() {

    this.tweetId = 0;
    
};

exports.Engine = Engine;

var databaseModule = require('./database-mysql');
var database = new databaseModule.Database();

Engine.prototype.getTweets = function (username, callback) {

	//console.log('getting tweets for user ' + username);

	database.selectTweets(username, function(tweets) {
		
		if (tweets) {
		
			tweets.sort(dateSorter);
			
			callback(tweets.slice(0, 19));
		
		} else callback([]);
	
	});

};

Engine.prototype.postTweet = function (username, status, callback) {

	//console.log('posting tweet for user ' + username + ' with status: ' + status);

	database.insertTweet(username, status, function(tweet) {
	
		callback(tweet);
	
	});

};

Engine.prototype.getTimeline = function (username, callback) {

	//console.log('getting timeline for user ' + username);

	database.selectTimeline(username, function(tweets) {
	
		if (tweets) {
		
			tweets.sort(dateSorter);
			
			callback(tweets.slice(0, 19));
		
		} else callback([]);
	
	});

};

//------------------------------------------------------------------------------

// date sorting, needed for reducing tweets returned by home timeline
// we're passing it to sort() method
var dateSorter = function (a, b) {

	return a.created_at.getTime() < b.created_at.getTime() ? true : false;

};
