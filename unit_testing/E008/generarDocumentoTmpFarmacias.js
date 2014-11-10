var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/movBodegas/E008/documentoTemporalFarmacias";


var that = this;
vows.describe('Generar Documento Final Clientes').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Consultar Existencia Produto': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = { usuario_id : body.obj.sesion.usuario_id, auth_token : body.obj.sesion.auth_token } ;
                obj.data = {
                    documento_temporal: {
                        numero_pedido : 65805,
                        empresa_id: 1350,
                        observacion : 'Test',
                        usuario_id : 1350
                    }
                };

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'log': fn.log()
        }
    }
}).export(module);

