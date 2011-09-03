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
	host: 'localhost',
	port: 3306,
	database: DATABASE0,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: 'localhost',
	port: 3306,
	database: DATABASE1,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: 'localhost',
	port: 3306,
	database: DATABASE2,
}));

clients.push(mysql.createClient({
	user: 'devcamp',
	password: 'devcamp',
	host: 'localhost',
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
	
	var now = new Date();

	clients[0].query(
		'INSERT INTO ' + STATUSES + ' SET id = ?, user_id = ?, text = ?, created_at = ?',
		[now.toString(), username, status, now],
	function(err, result) {
	
		callback ({'created_at': now.toString(), 'id': result.insertId});
	
	});

};

Database.prototype.selectTimeline = function (username, callback) {

	var counter = 0;
	var followers_size = 0;
	var full_results = [];

	var joinTweets = function(results) {
		
		full_results = full_results.concat(results);

		counter++;


		if (counter >= 4*followers_size) {
			callback (full_results);
		}
	}


	var counter = 0;
	var full_followers = [];

	var joinFollowers = function(followers) {
		
		full_followers = full_followers.concat(followers);

		counter++;
		if (counter == 4) {
	
			followers_size = full_followers.length;

			for (k = 0; k < followers_size; k++) {

					for (l = 0; l < 4; l++) {

							clients[l].query(
							'SELECT * FROM ' + STATUSES + ' WHERE user_id = ? ORDER BY created_at LIMIT ' + LIMIT,
							[full_followers[k]],
							function(err, results, fields) {
							
									joinTweets(results);
	
								}
							);

					}

			}

		}
	}
	
	for (i = 0; i < 4; i++) {

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

	}

};
