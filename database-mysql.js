/*
 * Database module based on 'mysql' https://github.com/felixge/node-mysql
 */

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

	// TODO proper implementation needed

	callback ({"created_at": "Fri Jun 24 17:43:26 +0000 2011", "id": 84315710834212866});

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
