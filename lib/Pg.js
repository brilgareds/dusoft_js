var Pg = function() {

    this.pg = require('pg');
    this.pgClient = require('pg').Client;
    this.pg_query = require('pg-query');


    this.host = "";
    this.username = "";
    this.password = "";
    this.database = "";
    this.connectionString = "";
    this.client = "";
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

    that.connectionString = 'pg://' + this.username + ':' + this.password + '@' + this.host + '/' + this.database;

    this.pg.connect(that.connectionString, function(err, client, done) {
        if (err)
            console.log("Pg->connect() Error: #red[" + err + "]");
        else {
            //that.client = client;
            that.pg_query.connectionParameters = that.connectionString;
            done();
            console.log("Pg->connect() OK");
        }
    });
};

Pg.prototype.begin = function(callback) {

    var that = this;

    that.client = new that.pgClient(that.connectionString);
    that.client.connect();
    that.client.query('BEGIN', callback);
};

Pg.prototype.rollback = function(callback) {
    var that = this;
    this.client.query('ROLLBACK', [], function(err) {
        that.client.end();
        callback(err);
    });
};

Pg.prototype.commit = function(callback) {
    var that = this;
    this.client.query('COMMIT', that.client.end.bind(that.client), callback);
    //this.client.query('COMMIT', callback);
};

Pg.prototype.transaction = function(sql, values, callback) {

    var that = this;

    console.log("Pg Query: #green[" + sql + "]");

    that.client.query(sql, values, function(err, rows, result) {
        if (err) {
            that.rollback(function() {
                console.log("Pg Query ERROR: #red[" + err + "]");
                console.log('***** Transaction Error ******');
                console.log(err);
                callback(err);
            });
            return;
        } else {
            console.log("Pg Query: #green[OK]");
            callback(err, rows, result);
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


Pg.prototype.paginated = function(sql, values, current_page, limit, callback) {
    var that = this;

    var page = current_page - 1;
    var offset = G.settings.limit * page;

    if (limit !== undefined) {
        offset = limit * page;
    }

    if (limit === undefined) {
        limit = G.settings.limit;
    }

    sql = sql + " LIMIT " + limit + " OFFSET " + offset;

    that.q(sql, values, function(err, rows, result) {

        callback(err, rows, result);

    });
};

Pg.prototype.pagination = function(sql, values, current_page, limit, callback) {

    var that = this;

    var page = current_page - 1;
    var offset = G.settings.limit * page;

    if (limit !== undefined) {
        offset = limit * page;
    }

    if (limit === undefined) {
        limit = G.settings.limit;
    }

    var queryStart = new Date();

    this.count(sql, values, function(err, rows) {

        var total_records = rows[0].count;

        sql = sql + " LIMIT " + limit + " OFFSET " + offset;

        that.q(sql, values, function(err, rows, result) {

            callback(err, rows, result, total_records);

            var queryEnd = new Date();

            // console.log("1) Query Time " + (queryEnd - queryStart) + " milliseconds");
        });
    });
};


Pg.prototype.count = function(sql, values, callback) {

    var sql_count = "select count(*) from ( " + sql + " ) as total; ";
    //this.q
    this.q(sql_count, values, function(err, rows, result) {
        callback(err, rows, result);
    });
};


Pg.prototype.q = function(sql, values, callback) {

    this.pg_query(sql, values, function(err, rows, result) {

        //console.log("Pg Query: #green[" + sql + "]");
        if (err) {
            console.log("QUERY ", sql, values);
            console.log("Pg Query ERROR: #red[" + err + "]");
        }
        else {
            console.log("Pg Query: #green[OK]");
        }
        callback(err, rows, result);
    });
};

module.exports.create = function() {
    return new Pg();
};

module.exports._class = Pg;

