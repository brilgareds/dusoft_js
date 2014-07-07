var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/PedidosClientes/listaPedidosOperarioBodega";


var that = this;
vows.describe('Test Lista Pedidos Operarios Bodega - Pedidos Clientes').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Listar Pedidos Operario - Parametros Incorrectos': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'Debe Responder con un Objeto': fn.isObject(),
            'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
            'Debe Responder con el url del Servicio': fn.assertService(url),
            'Debe Responder con Datos Obligatorios': fn.assertMsj('Algunos Datos Obligatorios No Estan Definidos'),
            'Debe Responder con Status 404': fn.assertStatus(404),
            'Debe Responder con Datos Vacios (obj)': fn.assertEmptyObj(),            
        },
        'Listar Pedidos Operario - Parametros Vacios': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = { lista_pedidos : { operario_id: '' }}

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'Debe Responder con un Objeto': fn.isObject(),
            'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
            'Debe Responder con el url del Servicio': fn.assertService(url),
            'Debe Responder con Se Requiere Id': fn.assertMsj('Se requiere el id de un operario de bodega'),
            'Debe Responder con Status 404': fn.assertStatus(404),
            'Debe Responder con Datos Vacios (obj)': fn.assertEmptyObj(),            
        },
        'Listar Pedidos Operario - Parametros Correctos': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = { lista_pedidos : { operario_id: 19 }}

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'Debe Responder con un Objeto': fn.isObject(),
            'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
            'Debe Responder con el url del Servicio': fn.assertService(url),
            'Debe Responder con Lista Pedidos Clientes': fn.assertMsj('Lista Pedidos Clientes'),
            'Debe Responder con Status 200': fn.assertStatus(200),
            'Debe Responder con Array Datos (obj)': fn.assertArrayObj('pedidos_clientes')
        }
    }
}).export(module);

