var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/sessions";
//var url = "/api/Empresas/listarEmpresas";


var that = this;
vows.describe('Test Consultar Existencia Producto').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Consultar Existencia Produto': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = { usuario_id : body.obj.sesion.usuario_id, auth_token : body.obj.sesion.auth_token } ;
                obj.data = {
                    bodegas : {empresa_id : '03', centro_utilidad_id : '1 '}
                };
                
                console.log('===============================');
                console.log(obj);
                console.log('===============================');
                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'log': fn.log()
        }
    }
}).export(module);

