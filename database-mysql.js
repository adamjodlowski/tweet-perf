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
