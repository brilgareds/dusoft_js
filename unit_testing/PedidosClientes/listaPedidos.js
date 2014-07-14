var vows = require('vows');
var assert = require('assert');
var client = require('request');

var config = require('../lib/Settings').create();
var fn = require('../lib/functions');
var url_login = "/login";
var url = "/api/PedidosClientes/listarPedidos";


var that = this;
vows.describe('Test Listar Pedidos Clientes').addBatch({
    'Autenticar Usuario -> ': {
        topic: config.post(url_login, config.auth_request_obj),
        'Listar Pedidos Clientes - Parametros Incorrectos': {
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
            //'log' : fn.log()
        },
        'Listar Pedidos Clientes - Parametros Vacios': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = { pedidos_clientes : { termino_busqueda : '', _pagina_actual :'' }};

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'Debe Responder con un Objeto': fn.isObject(),
            'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
            'Debe Responder con el url del Servicio': fn.assertService(url),
            'Debe Responder con Faltan Datos Obligatorios': fn.assertMsj('Algunos Datos Obligatorios No Estan Definidos'),
            'Debe Responder con Status 404': fn.assertStatus(404),
            'Debe Responder con Datos Vacios (obj)': fn.assertEmptyObj(),            
        },
        'Listar Pedidos Clientes - Parametros Correctos': {
            topic: function(topic) {
                var body = topic.body;
                var obj = config.request_obj;
                obj.session = body.obj.sesion;
                obj.data = { pedidos_clientes : { termino_busqueda : '', pagina_actual : 1 }};

                client.post(config.api_url + url, {
                    json: obj
                }, this.callback);
            },
            'Debe Responder con un Objeto': fn.isObject(),
            'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
            'Debe Responder con el url del Servicio': fn.assertService(url),
            'Debe Responder con Lista Pedidos Clientes': fn.assertMsj('Lista Pedidos Clientes'),
            'Debe Responder con Status 200': fn.assertStatus(200),
            'Debe Responder con Array Datos (obj)': fn.assertArrayObj('pedidos_clientes'),
            //'log' : fn.log()
        }
    }
}).export(module);

