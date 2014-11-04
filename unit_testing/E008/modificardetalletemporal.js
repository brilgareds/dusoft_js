var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/movBodegas/E008/modificarDetalleDocumentoTemporal";


var that = this;
vows.describe('Test actualizarTipoDocumentoTemporalClientes').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Consultar Existencia Produto': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = {
                    documento_temporal: {
                        item_id: 1555515,
                        cantidad_ingresada: 25,
                        fecha_vencimiento:"2014-10-30",
                        lote:'1512',
                        valor_unitario:2
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

