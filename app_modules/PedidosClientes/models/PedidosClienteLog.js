/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var PedidosClienteLog = function() {

    // Temporalmente
 
};

/**
 * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
 * @param {funcion} callback
 * @returns {void}
 * +Descripcion: Metodo encargado de encargado de insertar los registros
 * a una tabla log de seguimiento
 * @author Cristian Ardila
 * @fecha 29/09/2015
 */
PedidosClienteLog.prototype.logModificarProductoCotizacion = function(paramLogCliente, callback) {

   console.log("<<<<<<<<<<<<< PedidosClienteLog.prototype.logModificarProductoCotizacion >>>>>>>>>>>>>>>>>>");
   console.log("paramLogCliente ", paramLogCliente);
   
   
   
   callback();
    /* G.knex("inv_planillas_farmacia_devolucion_detalle").
    returning("id_inv_planilla_farmacia_devolucion_detalle").
    insert({
            id_inv_planilla_farmacia_devolucion: id,
            empresa_id:empresa_id, 
            prefijo:prefijo, 
            numero:numero,
            cantidad_cajas:cantidad_cajas, 
            cantidad_neveras: cantidad_neveras,
            temperatura_neveras: temperatura_neveras,
            observacion:observacion,
            usuario_id:usuario_id
            
        }).
    then(function(resultado){
      
        callback(false, resultado[0]);
       
    }).catch(function(err){
        callback(err);
        
    }).done();*/
};


/**
 * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
 * @param {funcion} callback
 * @returns {void}
 * +Descripcion: Metodo encargado de encargado de insertar los registros
 * a una tabla log de seguimiento
 * @author Cristian Ardila
 * @fecha 29/09/2015
 */
PedidosClienteLog.prototype.logEliminarProductoCotizacion = function(paramLogCliente, callback) {

   console.log("<<<<<<<<<<<<< PedidosClienteLog.prototype.logEliminarProductoCotizacion >>>>>>>>>>>>>>>>>>");
   console.log("paramLogCliente ", paramLogCliente);
   
   
   
   callback();
    /* G.knex("inv_planillas_farmacia_devolucion_detalle").
    returning("id_inv_planilla_farmacia_devolucion_detalle").
    insert({
            id_inv_planilla_farmacia_devolucion: id,
            empresa_id:empresa_id, 
            prefijo:prefijo, 
            numero:numero,
            cantidad_cajas:cantidad_cajas, 
            cantidad_neveras: cantidad_neveras,
            temperatura_neveras: temperatura_neveras,
            observacion:observacion,
            usuario_id:usuario_id
            
        }).
    then(function(resultado){
      
        callback(false, resultado[0]);
       
    }).catch(function(err){
        callback(err);
        
    }).done();*/
};




/**
 * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
 * @param {funcion} callback
 * @returns {void}
 * +Descripcion: Metodo encargado de encargado de insertar los registros
 * a una tabla log de seguimiento
 * @author Cristian Ardila
 * @fecha 29/09/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.solicitarAutorizacion
 */
PedidosClienteLog.prototype.logTrazabilidadVentas = function(cotizacion, callback) {
 
    G.knex("ventas_trazabilidad").
    insert({
            tipo: cotizacion.detalle.tipo,
            pendiente:cotizacion.detalle.pendiente, 
            numero:cotizacion.detalle.numero,
            solicitud:cotizacion.detalle.solicitud, 
            fecha_solicitud: cotizacion.detalle.fecha_solicitud,
            aprobacion: cotizacion.detalle.aprobacion,
            fecha_aprobacion:cotizacion.detalle.fecha_aprobacion,
            usuario_id:cotizacion.detalle.usuario_id          
        }).
    then(function(resultado){  
       
        callback(false, resultado);
       
    }).catch(function(err){  
       
        callback(err);
    }).done();
};




/**
 * @param {obj} paramLogCliente Objeto con los parametros de cabecera y detalle
 * @param {funcion} callback
 * @returns {void}
 * +Descripcion: Metodo encargado de encargado de insertar los registros
 * a una tabla log de seguimiento
 * @author Cristian Ardila
 * @fecha 29/09/2015
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.observacionCarteraCotizacion
 */
PedidosClienteLog.prototype.logAprobacionCotizacion = function(cotizacion, callback) {
   
   console.log("************PedidosClienteLog.prototype.logAprobacionCotizacion****************");
   console.log("************PedidosClienteLog.prototype.logAprobacionCotizacion****************");
   console.log("************PedidosClienteLog.prototype.logAprobacionCotizacion****************");
   console.log("cotizacion ", cotizacion);
   G.knex('ventas_trazabilidad')
    .where('numero', cotizacion.detalle.numero)
    .update({
            tipo: cotizacion.detalle.tipo,
            pendiente:cotizacion.detalle.pendiente, 
            numero:cotizacion.detalle.numero,
            solicitud: cotizacion.detalle.solicitud,
            aprobacion: cotizacion.detalle.aprobacion,
            fecha_aprobacion:cotizacion.detalle.fecha_aprobacion,
            usuario_aprobacion:cotizacion.detalle.usuario_aprobacion
            
    }).then(function(rows) { 
        console.log("rows ", rows)
        callback(false, rows);
    }).catch(function(error){
        console.log("error ", error);
        callback(error);
    });
};



/*
 * @author : Cristian Ardila
 * Descripcion : Funcion encargada de consultar el estado de una cotizacion
 * @fecha: 11/03/2016
 * @Funciones que hacen uso del model : 
 *  --PedidosCliente.prototype.observacionCarteraCotizacion
 */
PedidosClienteLog.prototype.logConsultarExistenciaNumero = function(parametro, callback) {
    
    G.knex('ventas_trazabilidad').where({
        numero: parametro.numero,
        tipo: parametro.tipo
     
    }).select('pendiente').then(function(rows) {
        callback(false, rows);
    }).catch (function(error) {
        callback(error);
    });
};

module.exports = PedidosClienteLog;