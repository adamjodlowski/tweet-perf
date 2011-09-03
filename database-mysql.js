/*
 * Database module based on 'mysql' https://github.com/felixge/node-mysql
 */
 
var mysql = require('mysql');

var USERS = 'users';
var STATUSES = 'statuses';
var FOLLOWERS = 'followers';
var LIMIT = 20;

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

var clients = [];

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE0,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE1,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE2,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: '10.1.1.10',
	port: 3306,
	database: DATABASE3,
}));

//------------------------------------------------------------------------------

function Database() {
};

exports.Database = Database;

Database.prototype.selectTweets = function (username, callback) {

	var counter = 0;
	var full_results = [];

	var joinTweets = function(results) {
		
		full_results = full_results.concat(results);

		counter++;
		if (counter == 4) {
			callback (full_results);
		}
	}

	for (i = 0; i < 4; i++) {

			clients[i].query(
			'SELECT * FROM ' + STATUSES + ' s INNER JOIN ' + USERS + ' u ON s.user_id = u.id WHERE screen_name LIKE ? ORDER BY s.created_at LIMIT ' + LIMIT,
			[username],
			function(err, results, fields) {

					joinTweets(results);
	
				}
			);
	}
}


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

	var counter = 0;
	var full_followers = [];

	var joinFollowers = function(followers) {
		
		full_followers = full_followers.concat(followers);

		counter++;
		if (counter == 4) {
	
			console.log(full_followers);
			//zapytanie + callback

		}
	}

	for (i = 0; i < 4; i++) {

			//20 tweetow z kazdego usera	
			//zapytaj o id moje i wszystkich ktorych followuje

			clients[i].query(
			'SELECT * FROM ' + FOLLOWERS + ' f INNER JOIN ' + USERS + ' u ON f.follower_id = u.id WHERE screen_name LIKE ?',
			[username],
			function(err, results, fields) {

					var temp_followers = [];

					for (j = 0; j < results.length; j++) {
	
							temp_followers.push(results[j].user_id);

					}
					joinFollowers(temp_followers);
	
				}
			);


			//zapytaj o wpisy moje i 



/*			clients[i].query(
			'SELECT * FROM ' + STATUSES + ' s INNER JOIN ' + USERS + ' u ON s.user_id = u.id WHERE screen_name LIKE ? ORDER BY s.created_at LIMIT ' + LIMIT,
			[username],
			function(err, results, fields) {

					joinTweets(results);
	
				}
			);
*/

	}

};
