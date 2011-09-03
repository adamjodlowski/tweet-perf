/*
 * Database module based on 'db-mysql' http://nodejsdb.org/
 */
 
var mysql = require('db-mysql');

var clients = [];
var i;
for (i = 1; i < 5; i++) {
    (function(i) {
        new mysql.Database({
            hostname: '10.1.1.10',
            user: 'devcamp',
            password: 'devcamp',
            database: 'twitter' + i
        }).connect(function(error) {
            clients[i] = this;
        });
    }(i));
}

var USERS = 'users';
var STATUSES = 'statuses';
var FOLLOWERS = 'followers';
var LIMIT = 20;

function Database() {
    
}

Database.prototype.findUser = function (username, callback) {
    var i;
    
    callback([
        {"created_at": "Fri Jul 16 16:58:46 +0000 2010",
        "text": "got a lovely surprise from @craftybeans.",
        "id": 18700887835},
        {"created_at": "Fri Jul 16 16:55:52 +0000 2010",
        "text": "Anything is possible when you're in",
        "id": 18700688341}
    ]);
}

Database.prototype.selectTweets = function (username, callback) {
    for (i = 1; i < 5; i++) {
        (function(client){  
            client
                .query()
                .select('users.screen_name, statuses.text, statuses.created_at')
                .from(USERS)
                .join({type: 'LEFT', table: 'statuses', conditions: 'users.id = statuses.user_id', escape: false})
                .where('users.screen_name = ?', [username])
                .order('statuses.created_at')
                .limit(LIMIT);
                .execute(function(error, rows, cols){
                    if (error) {
                        console.log(error);
                    } else if (rows.length) {
                        callback(rows);
                    }
                });
        }(clients[i]));
    }
};

Database.prototype.insertTweet = function (username, status, callback) {
    
};

Database.prototype.selectTimeline = function (username, callback) {
    
}

exports.Database = Database;