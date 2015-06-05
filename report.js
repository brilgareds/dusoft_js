var jsreport = require("jsreport");
var settings = require('./lib/Settings').create();

require('jsreport').bootstrapper({ httpPort: settings.reports_serverPort }).start();