/*
 * Database module based on 'mysql' https://github.com/felixge/node-mysql
 */
 
var mysql = require('mysql');

var USERS = 'users';
var STATUSES = 'statuses';
var FOLLOWERS = 'followers';

 /*
 * Database schema:
 * users: id, name, screen_name
 * statuses: id, user_id, text, created_at
 * followers: user_id, follower_id
 */

// tweets are partitioned into databases
var DATABASE0 = 'twitter1';
var DATABASE1 = 'twitter2';
var DATABASE2 = 'twitter3';
var DATABASE3 = 'twitter4';

var clients[0] = mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE0,
});

var clients[1] = mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE1,
});

var clients[2] = mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE2,
});

var clients[3] = mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE3,
});

//------------------------------------------------------------------------------

function Database() {
    
};

exports.Database = Database;

Database.prototype.selectTweets = function (username, callback) {

	// TODO proper implementation needed

	callback ([
		{"created_at": "Fri Jul 16 16:58:46 +0000 2010",
		"text": "got a lovely surprise from @craftybeans.",
		"id": 18700887835},
		{"created_at": "Fri Jul 16 16:55:52 +0000 2010",
		"text": "Anything is possible when you're in",
		"id": 18700688341}
		]);

};

Database.prototype.insertTweet = function (username, status, callback) {

	// TODO didn't check if this even works
	
	var now = new Date();

	clients[0].query(
		'INSERT INTO ' + STATUSES + ' SET id = ?, user_id = ?, text = ?, created_at = ?',
		[now.toString(), username, status, now],
	function() {
	
		callback ({'created_at': now.toString(), 'id': now});
	
	});

	//callback ({"created_at": "Fri Jun 24 17:43:26 +0000 2011", "id": 84315710834212866});

};

Database.prototype.selectTimeline = function (username, callback) {

	// TODO proper implementation needed

	callback ([
		{"created_at": "Fri Jul 16 16:58:46 +0000 2010",
		"text": "got a lovely surprise from @craftybeans. ",
		"id": 18700887835,
		"user": {"name": "cindy li",
				"id": 29733,
				"screen_name": "cindyli"}},
		{"created_at": "Fri Jul 16 16:55:52 +0000 2010",
		"text": "Anything is possible when you're in",
		"id": 18700688341,
		"user": {"name": "Daniel Burka",
		"id": 635543,"screen_name": "dburka"}}
		]);
		
};
