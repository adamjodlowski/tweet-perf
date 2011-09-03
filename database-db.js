/*
 * Database module based on 'db-mysql' http://nodejsdb.org/
 */
 
var mysql = require('db-mysql');

var clients = [];
var i;
for (i = 1; i < 5; i++) {
    (function(i) {
        new mysql.Database({
            hostname: '10.1.1.149', // 10.1.1.149 //'10.1.1.10',
            user: 'devcamp',
            password: 'devcamp',
            database: 'twitter' + i,
            socket: ''
        }).connect(function(error) {
            if (error) {
                console.log('Connection ERROR: ' + error);
            }
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

Database.prototype.query = function(createQuery, callback) {
    var queriesDone = 0;
    var results = [];
    for (i = 1; i < clients.length; i++) {
        (function(client, i){
            createQuery(client.query(), i).execute(function(error, rows, cols){
                if (error) {
                    console.log('SQL ERROR: ' + error);
                } else {
                    results += rows;
                    queriesDone++;
                    if (rows.length) {
                        callback(rows);
                    }
                    if (queriesDone === (clients.length - 1)) {
                        callback(results);
                    }
                }
            });
        }(clients[i], i));
    }
}

Database.prototype.selectTweets = function (username, callback) {
    this.query(function(query, client_index) {
        return query
            .select('users.screen_name, statuses.text, statuses.created_at')
            .from(USERS)
            .join({type: 'LEFT', table: 'statuses', conditions: 'users.id = statuses.user_id', escape: false})
            .where('users.screen_name = ?', [username])
            .order('statuses.created_at')
            .limit(LIMIT);
    }, callback);
};

Database.prototype.insertTweet = function (username, status, callback) {
    
};

Database.prototype.selectTimeline = function (username, callback) {
    
}

exports.Database = Database;