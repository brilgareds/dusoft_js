var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/PedidosFarmacias/listarBodegas";


var that = this;
vows.describe('Test Listar Pedidos Farmacias').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Listar Pedidos Farmacias - Parametros Incorrectos': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data  = { pedidos_farmacias : { empresa_id : 'FD', centro_utilidad_id : 15}}

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'log' : fn.log()
        }
    }
}).export(module);

