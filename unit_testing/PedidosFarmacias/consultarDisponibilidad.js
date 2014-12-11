var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/Pedidos/consultarDisponibilidad";


var that = this;
vows.describe('Test Listar Pedidos Farmacias').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Listar Pedidos Farmacias - Parametros Incorrectos': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = { usuario_id : body.obj.sesion.usuario_id, auth_token : body.obj.sesion.auth_token } ;
                obj.data  = { pedidos : { empresa_id : '03', numero_pedido : 68741, codigo_producto : '198E0021730', identificador:'FM'}}

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'log' : fn.log()
        }
    }
}).export(module);

