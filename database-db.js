/*
 * Database module based on 'db-mysql' http://nodejsdb.org/
 */
 
var mysql = require('db-mysql');

var clients = [];
var i;
for (i = 1; i < 5; i++) {
    (function(i) {
        new mysql.Database({
            hostname: 'localhost',
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

var LIMIT = 20;

function Database() {
    
}

Database.prototype.query = function(createQuery, callback, queryAll) {
    var queriesDone = 0;
    var results = [];
    var logResultsCount = [];
    
    for (i = 1; i < clients.length; i++) {
        (function(client, i){
            createQuery(client.query(), i).execute(function(error, rows, cols){
                if (error) {
                    console.log('SQL ERROR: ' + error);
                } else {
                    results = results.concat(rows);
                    logResultsCount[i] = rows.length;
                    
                    queriesDone++;
                    
                    if (queryAll === false && rows.length) {    
                        if(cols.length === 1 && rows.length === 1) {
                            callback(rows[0][cols[0].name]);
                        } else {
                            callback(rows);
                        }
                    } else if (queryAll !== false && queriesDone === (clients.length - 1)) {
                        callback(results);
                    }
                }
            });
        }(clients[i], i));
    }
}

Database.prototype.findUserId = function (username, callback) {
    this.query(function(query) {
        return query
            .select('users.id')
            .from('users')
            .where('users.screen_name = ?', [username])
            .limit(1);
    }, callback, false);
}

Database.prototype.selectFollowed = function (username, callback) {
    var that = this;
    that.findUserId(username, function(user_id){
        that.query(function(query){
            return query
                .select('user_id')
                .from('followers')
                .where('followers.follower_id = ?', [user_id]);
        }, function(results) {
            results.push(user_id);
            callback(results);
        });
    });
}

Database.prototype.selectTweets = function (username, callback) {
    this.query(function(query, client_index){
        return query
            .select('users.screen_name, statuses.text, statuses.created_at')
            .from('users')
            .join({type: 'LEFT', table: 'statuses', conditions: 'users.id = statuses.user_id', escape: false})
            .where('users.screen_name = ?', [username])
            .order('statuses.created_at')
            .limit(LIMIT);
    }, callback);
};

Database.prototype.insertTweet = function (username, status, callback) {
    var that = this;
    that.findUserId(username, function(user_id){
        var client_id = user_id % 4;
        if (client_id === 0) {
            client_id = 4;
        }
        
        clients[client_id].query().insert(
            'statuses',
            ['user_id', 'text', 'created_at', 'updated_at'],
            [user_id, status, new Date(), new Date()]
        ).execute(function(error, rows, cols){
            if (error) {
                console.log('SQL INSERT ERROR: ' + error);
                callback();
            } 
            callback({id: rows.id, database: 'twitter'+client_id});
        });
    });
};

Database.prototype.selectStatus = function(status_id, callback) {
    this.query(function(query){
        return query
            .select('users.screen_name, statuses.text, statuses.created_at')
            .from('statuses')
            .join({type: 'LEFT', table: 'users', conditions: 'statuses.user_id = user.id', escape: false})
            .where('statuses.id = ?', [status_id])
            .limit(1);
    }, callback, false);
}

Database.prototype.selectTimeline = function (username, callback) {
    var that = this;
    that.selectFollowed(username, function(results){
        for (var i in results) {
            if (typeof results[i] === 'object') {
                results[i] = results[i].user_id;
            }
        }
        that.query(function(query){
            return query
                .select('users.screen_name, statuses.text, statuses.created_at')
                .from('users')
                .join({type: 'LEFT', table: 'statuses', conditions: 'users.id = statuses.user_id', escape: false})
                .where('users.id IN (?)', [results.join(',')])
                .order('statuses.created_at')
                .limit(LIMIT);
        }, callback);
    });
}

exports.Database = Database;
