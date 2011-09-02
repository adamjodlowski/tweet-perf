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

	// TODO proper implementation needed

	database.selectTweets(username, function(tweets) {
	
		callback(tweets);
	
	});

};
