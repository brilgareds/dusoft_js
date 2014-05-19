var vows = require('vows'),
assert = require('assert');

var config = require('./lib/Settings').create();
var fn = require('./lib/functions');
var url = "/login";


vows.describe('Pruebas de Inicio de Sesion').addBatch({
    'Función Login Sin Parametros /login': {
        topic: config.post(url, { }),
        'Debe Responder con un Objeto': fn.isObject(),
        'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
        'Debe Responder con el url del Servicio': fn.assertService(url),
        'Debe Responder con La Sintaxis del request es invalida': fn.assertMsj('La sintaxis del request es invalida'),
        'Debe Responder con Status 404': fn.assertStatus(404),
        'Debe Responder con Datos Vacios (obj)': fn.assertEmptyObj(),
        //'log' : fn.log()        
    },
    'Función Login con Parametros Erroneos /login': {
        topic: config.post(url, { }),
        'Debe Responder con un Objeto': fn.isObject(),
        'Debe Responder con un Objeto Valido': fn.validObj(config.response_obj),
        'Debe Responder con el url del Servicio': fn.assertService(url),
        'Debe Responder con La Sintaxis del request es invalida': fn.assertMsj('La sintaxis del request es invalida'),
        'Debe Responder con Status 404': fn.assertStatus(404),
        'Debe Responder con Datos Vacios (obj)': fn.assertEmptyObj(),
        //'log' : fn.log()        
    },
}).export(module);