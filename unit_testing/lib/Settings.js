
var client = require('request');
var qs = require('querystring');

var Settings = function(){
    var that = this;
    this.host       = "http://localhost";
    this.port       = "3001";
    this.api_path   = "/api";
    this.api_url    = this.host+':'+this.port;
    
    this.response_obj = { service : '', msj : '', status : '', obj : ''};
        
    this.valid_email= 'admin@admin.com';
    this.valid_password = '123';
    
    this.invalid_email= 'invalidemail@testing.com';
    this.invalid_password= 'invalid_pass';
    
    this.get = function (path, params) {
        var url = that.api_url+path;
        if (params)
            url = url + '?'+qs.stringify(params);
        return function () {
            client.get(url, this.callback);
        };
    };
    
    this.post = function(path, params){
        return function () {
            client.post(that.api_url+path, {
                json : params
            },this.callback);
        };
    };
};

Settings.prototype.className = "Settings";

module.exports.create = function(){
    return new Settings();
};

module.exports._class = Settings;

