var Pg = function() {

    this.pg = require('pg');
    this.pg_query = require('pg-query');

    this.host = "";
    this.username = "";
    this.password = "";
    this.database = "";

    this.reconnectIntervalId = 0;
};

Pg.prototype.setCredentials = function(_host, _username, _password, _database) {

    this.host = _host;
    this.username = _username;
    this.password = _password;
    this.database = _database;

    this.connect();
};

Pg.prototype.connect = function() {

    var that = this;
    var connection_string = 'pg://' + this.username + ':' + this.password + '@' + this.host + '/' + this.database;

    this.pg.connect(connection_string, function(err, client, done) {
        if (err)
            console.log("Pg->connect() Error: #red[" + err + "]");
        else {
            that.pg_query.connectionParameters = connection_string;
            done();
            console.log("Pg->connect() OK");
        }
    });
};

Pg.prototype.query = function(sql, values, callback) {

    var queryStart = new Date();

    this.q(sql, values, function(err, rows, result) {

        callback(err, rows, result);

        var queryEnd = new Date();

        console.log("1) Query Time " + (queryEnd - queryStart) + " milliseconds");
    });

};

Pg.prototype.q = function(sql, values, callback) {

    this.pg_query(sql, values, function(err, rows, result) {

        console.log("Pg Query: #green[" + sql + "]");
        if (err) {
            console.log("Pg Query ERROR: #red[" + err + "]");
        }
        else {
            console.log("Pg Query: #green[OK]");
        }
        callback(err, rows, result);
    });
};


Pg.prototype.pagination = function(sql, values, limit, offset, callback) {

    var that = this;

    var queryStart = new Date();

    this.count(sql, values, function(err, rows) {
 
        var total_records = rows[0].count;
        
        sql = sql + " LIMIT " + limit + " OFFSET "+ offset;

        that.q(sql, values, function(err, rows, result) {

            callback(err, rows, result, total_records);

            var queryEnd = new Date();

            console.log("1) Query Time " + (queryEnd - queryStart) + " milliseconds");
        });
    });
};


Pg.prototype.count = function(sql, values, callback) {

    var sql_count = "select count(*) from ( " + sql + " ) as total; ";

    this.q(sql_count, values, function(err, rows, result) {
        callback(err, rows, result);
    });
};


module.exports.create = function() {
    return new Pg();
};

module.exports._class = Pg;

