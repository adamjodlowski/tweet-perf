/*
 * Database module based on 'mysql-pool' https://github.com/Kijewski/node-mysql-pool
 */
 
var MySQLPool = require('mysql-pool').MySQLPool;
var clients = [];
var i;
for (i = 1; i <= 4; i++) {
    clients = new MySQLPool({
        poolSize: 4,
        user: 'devcamp',
        password: 'devcamp',
        database: 'twitter' + i
    });
}

var USERS = 'users';
var STATUSES = 'statuses';
var FOLLOWERS = 'followers';

function Database() {
    
}

exports.Database = Database;

Database.prototype.selectTweets = function (username, callback) {
    
};

Database.prototype.insertTweet = function (username, status, callback) {
    
};

Database.prototype.selectTimeline = function (username, callback) {
    
}