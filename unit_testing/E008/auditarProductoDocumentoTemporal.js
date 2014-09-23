var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/movBodegas/E008/auditarProductoDocumentoTemporal";


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
                        item_id: 1555725,
                        auditado: true,
                        numero_caja: 1,
                        justificacion: {
                            doc_tmp_id: 2308,
                            codigo_producto: "132H0482480",
                            cantidad_pendiente: 50,
                            justificacion: "No Habia",
                            justificacion_auditor: "Auditor Justifica que no y no y no ",
                            existencia: 50,
                            usuario_id : 1350
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

