var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/movBodegas/E008/auditoriaProductosDocumentoTemporal";


var that = this;
vows.describe('Consultar Productos Para Auditar').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Consultar Existencia Produto': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = {
                    documento_temporal: {
                        documento_temporal_id : 2306,
                        usuario_id: 1350,
                        filtro : {
                            codigo_barras : true,
                            termino_busqueda : '7707288820698'
                        }
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

