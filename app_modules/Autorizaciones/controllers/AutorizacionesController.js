
var Autorizaciones = function(autorizaciones, pedidos_farmacias, pedidos_clientes, ordenes_compra, m_productos,eventos_pedidos_clientes,eventos_pedidos_farmacias) {
    this.m_autorizaciones = autorizaciones;
    this.m_pedidos_farmacias = pedidos_farmacias;
    this.m_pedidos_clientes = pedidos_clientes;
    this.m_ordenes_compra = ordenes_compra;
    this.m_productos = m_productos;
    this.e_pedidos_clientes = eventos_pedidos_clientes;
    this.e_pedidos_farmacias = eventos_pedidos_farmacias;
};

/**
* @author Andres M Gonzalez
* +Descripcion controlador que lista todos los pedidos de farmacia
* @params detalle: 1 lista el detalle de cada pedido 0: lista los pedidos que tengan bloqueos
* @fecha 2016-05-25
*/
Autorizaciones.prototype.listarProductosBloqueados = function(req, res) {
    var that = this;
    var args = req.body.data;
    var termino_busqueda = {};
    var pagina_actual = args.autorizaciones.pagina_actual;

    if (args.autorizaciones === undefined || args.autorizaciones.termino_busqueda === undefined || args.autorizaciones.pagina_actual === undefined || args.autorizaciones.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizaciones.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    if (args.autorizaciones.detalle === undefined) {
        args.autorizaciones.detalle = '';
    }
    
    termino_busqueda.termino = args.autorizaciones.termino_busqueda;
    termino_busqueda.empresa = args.autorizaciones.empresa_id;
    termino_busqueda.tipo_pedido = args.autorizaciones.tipo_pedido;
    termino_busqueda.detalles = args.autorizaciones.detalle;    

    if (termino_busqueda.tipo_pedido === 0) {
        G.Q.ninvoke(this.m_autorizaciones,'listarProductosBloqueados', termino_busqueda, pagina_actual).
          then(function(listarProductosBloqueados) {
          res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados Clientes!!!!', 200, {listarProductosBloqueados: listarProductosBloqueados}));
        }).
          fail(function(err) {
          res.send(G.utils.r(req.url, 'Error Listado de Productos Bloqueados Clientes', 500, {listarProductosBloqueados: {}}));
        }).
          done();
    } else {
        G.Q.nfcall(this.m_autorizaciones.listarProductosBloqueadosfarmacia, termino_busqueda, pagina_actual).
           then(function(listarProductosBloqueadosfarmacia) {
           res.send(G.utils.r(req.url, 'Listado de Productos Bloqueados Farmacia!!!!', 200, {listarProductosBloqueados: listarProductosBloqueadosfarmacia}));
        }).
           fail(function(err) {
           res.send(G.utils.r(req.url, 'Error Listado de Productos Bloqueados Farmacia', 500, {listarProductosBloqueadosfarmacia: {}}));
        }).
           done();
    }
};

/**
* @author Andres M Gonzalez
* +Descripcion lista los productos bloqueados que no se han aprobado
* @fecha 2016-05-25
*/
Autorizaciones.prototype.verificarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var termino = {};
    
    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;

    G.Q.nfcall(that.m_autorizaciones.verificarAutorizacionProducto, termino).
        then(function(verificarAutorizacionProductos) {
        res.send(G.utils.r(req.url, 'Consultar Autorizacion de Productos Bloqueados ok!!!!', 200, {verificarAutorizacionProductos: verificarAutorizacionProductos}));
    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al Consultar Autorizacion de Productos Bloqueados', 500, {verificarAutorizacionProducto: {}}));
    }).
       done();

};

/**
 * @author Andres M Gonzalez
 * +Descripcion modifica el estado de la autorizacion de productos
 * @fecha 2016-05-25
 */
Autorizaciones.prototype.modificarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var numero_pedido = args.autorizarProductos.numeroPedido;
    var tipoPedido = args.autorizarProductos.tipoPedido;
    var modelo;
    var estado_pedido='0';
    var evento;
    var termino = {};

    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;    
    
    if(tipoPedido===1){
        modelo=that.m_pedidos_farmacias;
        evento=that.e_pedidos_farmacias;
    }else{
        modelo=that.m_pedidos_clientes;
        evento=that.e_pedidos_clientes;
    }
    
    G.Q.ninvoke(modelo, 'consultar_pedido', numero_pedido).then(function(resultado) {
        
       /**
         * +Descripcion: Se valida si el estado del pedido es 
         *               1 activo
         *               8 (desaprobado por cartera)
         *               10 (por autorizar)
         *               y el estado de la autorizacion del producto
         *               1 aprobado 
         *               2 denegado 
         */
        
        console.log("estado_actual",resultado[0].estado_actual_pedido,typeof(resultado[0].estado_actual_pedido));
        console.log("estado",args.autorizarProductos.estado,typeof(args.autorizarProductos.estado) );
         if (((resultado[0].estado_actual_pedido === '8' || resultado[0].estado_actual_pedido === '0' || resultado[0].estado_actual_pedido === '10') 
                 && args.autorizarProductos.estado === 2) ||  args.autorizarProductos.estado === 1) {
            return  G.Q.ninvoke(that.m_autorizaciones, 'modificarAutorizacionProductos', termino);
  
        } else {
            throw {estado:403, mensaje:"El estado actual del pedido no puede ser modificado"};
            
        }

    }). then(function(resultados){  
        
       return G.Q.ninvoke(that.m_autorizaciones, 'verificarPedidoAutorizado', numero_pedido);        
        
     }).then(function(resultado){
       var def = G.Q.defer();
        if(resultado.rowCount === 0 && args.autorizarProductos.estado === 2){
            evento.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);

        }else{
            def.resolve();
        }    
     }).then(function(){
        res.send(G.utils.r(req.url, 'Actualizo Autorizacion de Productos Bloqueados!!!!', 200, {modificarAutorizacionProductos: ''}));         
     }).fail(function(err){        
        if (!err.estado){
            err= {estado: 500, mensaje: err};
         }
         res.send(G.utils.r(req.url, err.mensaje, err.estado, {}));        
    }).done();
 };

/**
* @author Andres M Gonzalez
* +Descripcion inserta el estado de la autorizacion de productos
* @fecha 2016-05-25
*/
Autorizaciones.prototype.insertarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var numero_pedido = args.autorizarProductos.numeroPedido;
    var tipoPedido = args.autorizarProductos.tipoPedido;
    var estado_pedido='0';
    var modelo;
    var evento;
    var termino = {};
    
    if (args.autorizarProductos === undefined || args.autorizarProductos.estado === undefined || args.autorizarProductos.autorizacionId === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.autorizarProductos.estado === '' || args.autorizarProductos.autorizacionId === '') {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    termino.estado = args.autorizarProductos.estado;
    termino.autorizacionId = args.autorizarProductos.autorizacionId;
    termino.usuarioId = req.body.session.usuario_id;    
    
    if(tipoPedido===1){
        modelo=that.m_pedidos_farmacias;
        evento=that.e_pedidos_farmacias;
    }else{
        modelo=that.m_pedidos_clientes;
        evento=that.e_pedidos_clientes;
    }
    
    G.Q.ninvoke(modelo, 'consultar_pedido', numero_pedido).then(function(resultado) {
        /**
         * +Descripcion: Se valida si el estado del pedido es 
         *               1 activo
         *               8 activo (desaprobado por cartera)
         *               10 (por autorizar)
         *               y el estado de la autorizacion del producto
         *               1 aprovado 
         *               1 denegado 
         */
        
         console.log("estado_actual",resultado[0].estado_actual_pedido,typeof(resultado[0].estado_actual_pedido));
        console.log("estado",args.autorizarProductos.estado,typeof(args.autorizarProductos.estado) );
       if (((resultado[0].estado_actual_pedido === '8' || resultado[0].estado_actual_pedido === '0' || resultado[0].estado_actual_pedido === '10') 
                 && args.autorizarProductos.estado === 2) ||  args.autorizarProductos.estado === 1) {

            return  G.Q.ninvoke(that.m_autorizaciones, 'insertarAutorizacionProductos', termino);
        } else {          
            throw {estado:403, mensaje:"El estado actual del pedido no puede ser modificado"};
        }
     }).then(function(resultados){         
        return G.Q.ninvoke(that.m_autorizaciones, 'verificarPedidoAutorizado', numero_pedido);        
        
     }).then(function(resultado){
        var def = G.Q.defer();
        if(resultado.rowCount === 0 && args.autorizarProductos.estado === 2){
            evento.onNotificarPedidosActualizados({numero_pedido: numero_pedido});
            return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);

        }else{
           def.resolve();
        }    
     }).then(function(){
        res.send(G.utils.r(req.url, 'Inserto Autorizacion de Productos Bloqueados!!!!', 200, {insertarAutorizacionProductos: ''}));
     }).fail(function(err){     
         if (!err.estado){
            err= {estado: 500, mensaje: err};
         }
         res.send(G.utils.r(req.url, err.mensaje, err.estado, {}));         
         
     }).done();
 };
 
/**
* @author Andres M Gonzalez
* +Descripcion lista el detalle de las autorizaciones de cada productos
* @fecha 2016-05-25
*/
Autorizaciones.prototype.listarVerificacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var termino = {};
    var pagina_actual = args.verificacion.pagina_actual;
    
    if (args.verificacion === undefined || args.verificacion.codigoProducto === undefined || args.verificacion.empresaId === undefined || args.verificacion.pedidoId === undefined || args.verificacion.tipoPedido === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    termino.codigoProducto = args.verificacion.codigoProducto;
    termino.empresaId = args.verificacion.empresaId;
    termino.pedidoId = args.verificacion.pedidoId;
    termino.tipoPedido = args.verificacion.tipoPedido;
 
    G.Q.ninvoke(this.m_autorizaciones,"listarVerificacionProductos", termino, pagina_actual).
            then(function(listarVerificacionProductos) {
        res.send(G.utils.r(req.url, 'Listar Productos Verificados ok!!!!', 200, {listarVerificacionProductos: listarVerificacionProductos}));

    }).
       fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al Consultar Productos Verificados', 500, {listarVerificacionProductos: {}}));
    }).
       done();

};

Autorizaciones.$inject = [
                          "m_autorizaciones", 
                          "m_pedidos_farmacias", 
                          "m_pedidos_clientes", 
                          "m_ordenes_compra", 
                          "m_productos",
                          "e_pedidos_clientes", 
                          "e_pedidos_farmacias"
                         ];

module.exports = Autorizaciones;