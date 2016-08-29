
var ChatController = function(mChat) {
    this.mChat = mChat;

};

/**
* @author Eduar Garcia
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-29
*/
ChatController.prototype.listarGrupos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var termino_busqueda = {};
    var pagina_actual = args.autorizaciones.pagina_actual;

    if (!args.chat  || !args.chat.termino_busqueda  || !args.chat.pagina_actual) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.chat.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }
        

    G.Q.ninvoke(this.mChat,'listarGrupos', args.chat).then(function(grupos) {
        res.send(G.utils.r(req.url, 'Listado de grupos', 200, {grupos: grupos}));
      
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Listado los grupos', 500, {grupos: {}}));
    }).done();


};

/**
* @author Andres M Gonzalez
* +Descripcion lista los productos bloqueados que no se han aprobado
* @fecha 2016-05-25
*/
ChatController.prototype.verificarAutorizacionProductos = function(req, res) {
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
ChatController.prototype.modificarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var numero_pedido = args.autorizarProductos.numeroPedido;
    var tipoPedido = args.autorizarProductos.tipoPedido;
    var modelo;
    var estado_pedido='0';
    var evento;
    var termino = {};
    var envio=false;
    var opciones;
    var def = G.Q.defer();
    var parametrosPermisos = { usuario_id:req.session.user.usuario_id, empresa_id:req.session.user.empresa, modulos:[req.session.user.moduloActual], convertirJSON:true };

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
    
            
    G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametrosPermisos).then(function(parametrizacion){
      opciones=parametrizacion.modulosJson.productos_en_pedidos.opciones;
      if(opciones.sw_cambiar_estado){
          return G.Q.ninvoke(modelo, 'consultar_pedido', numero_pedido);
      }else{
           throw {estado:403, mensaje:"El Usuario no tiene permisos para modificar"};
      }
      
   }).then(function(resultado){
        
       /**
         * +Descripcion: Se valida si el estado del pedido es 
         *               1 activo
         *               8 (desaprobado por cartera)
         *               10 (por autorizar)
         *               y el estado de la autorizacion del producto
         *               0 pendiente 
         *               1 aprobado 
         *               2 denegado 
         */
        
        if (((resultado[0].estado_actual_pedido === '8' || resultado[0].estado_actual_pedido === '0' || resultado[0].estado_actual_pedido === '10') 
                 && args.autorizarProductos.estado === 2) ||  args.autorizarProductos.estado === 1) {
            return  G.Q.ninvoke(that.m_autorizaciones, 'modificarAutorizacionProductos', termino);
  
        } else {
            throw {estado:403, mensaje:"El estado actual del pedido no puede ser modificado"};
            
        }

    }). then(function(resultados){  
        
       return G.Q.ninvoke(that.m_autorizaciones, 'verificarPedidoAutorizado', numero_pedido);        
        
     }).then(function(resultado){
            if(tipoPedido===1){
                return G.Q.ninvoke(that.m_autorizaciones,"verificarProductoAutorizadoFarmacia",numero_pedido);
            }else{
                return G.Q.ninvoke(that.m_autorizaciones,"verificarProductoAutorizadoCliente",numero_pedido);
            } 
     }).then(function(resultado){         
         console.log(" resultado de autorizar pedido ", resultado, " numero de pedido ", numero_pedido, " tipo pedido ", tipoPedido);
         if(resultado[0].numero_productos !== resultado[0].numero_denegados ){
             if(resultado[0].numero_pendientes === '0' ){
                  envio=true;
                  return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);
             }else{
                def.resolve(); 
             }
         }else{
             estado_pedido=10;
             envio=true;
             return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);
        } 
     }).then(function(){
         if(envio){
           evento.onNotificarPedidosActualizados({numero_pedido: numero_pedido});  
         }
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
ChatController.prototype.insertarAutorizacionProductos = function(req, res) {
    var that = this;
    var args = req.body.data;
    var numero_pedido = args.autorizarProductos.numeroPedido;
    var tipoPedido = args.autorizarProductos.tipoPedido;
    var estado_pedido='0';
    var modelo;
    var evento;
    var termino = {};
    var envio=false;
    var estado_actual_pedido;
    var opciones;
    var def = G.Q.defer();
    var parametrosPermisos = { usuario_id:req.session.user.usuario_id, empresa_id:req.session.user.empresa, modulos:[req.session.user.moduloActual], convertirJSON:true };
    
    
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
    
    G.Q.ninvoke(that.m_usuarios, "obtenerParametrizacionUsuario", parametrosPermisos).then(function(parametrizacion){
        
      opciones=parametrizacion.modulosJson.productos_en_pedidos.opciones;//.sw_cambiar_estado
      
      if(opciones.sw_cambiar_estado){
          return G.Q.ninvoke(modelo, 'consultar_pedido', numero_pedido);
      }else{
           throw {estado:403, mensaje:"El Usuario no tiene permisos para modificar"};
      }
      
   }).then(function(resultado){
        /**
         * +Descripcion: Se valida si el estado del pedido es 
         *               1 activo
         *               8 activo (desaprobado por cartera)
         *               10 (por autorizar)
         *               y el estado de la autorizacion del producto
         *               1 aprovado 
         *               1 denegado 
         */
        estado_actual_pedido=resultado[0].estado_actual_pedido;
       if (((resultado[0].estado_actual_pedido === '8' || resultado[0].estado_actual_pedido === '0' || resultado[0].estado_actual_pedido === '10') 
                 && args.autorizarProductos.estado === 2) ||  args.autorizarProductos.estado === 1) {

            return  G.Q.ninvoke(that.m_autorizaciones, 'insertarAutorizacionProductos', termino);
        } else {          
            throw {estado:403, mensaje:"El estado actual del pedido no puede ser modificado"};
        }
     }).then(function(resultados){         
        return G.Q.ninvoke(that.m_autorizaciones, 'verificarPedidoAutorizado', numero_pedido);        
        
     }).then(function(resultado){
         
            if(tipoPedido===1){
                return G.Q.ninvoke(that.m_autorizaciones,"verificarProductoAutorizadoFarmacia",numero_pedido);
            }else{
                return G.Q.ninvoke(that.m_autorizaciones,"verificarProductoAutorizadoCliente",numero_pedido);
            } 
     }).then(function(resultado){
         console.log(" resultado de autorizar pedido ", resultado, " numero de pedido ", numero_pedido, " tipo pedido ", tipoPedido);
          if(resultado[0].numero_productos !== resultado[0].numero_denegados){
            if(resultado[0].numero_pendientes === '0' ){
                envio=true;
               if(estado_actual_pedido === '8' || estado_actual_pedido === '0' || estado_actual_pedido === '10'){
                return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);
               }else{
                  def.resolve(); 
               }
            }else{
                def.resolve();
            }
         }else{
             estado_pedido=10;
             envio=true;
            if(estado_actual_pedido === '8' || estado_actual_pedido === '0' ){
            return G.Q.ninvoke(modelo,"actualizar_estado_actual_pedido",numero_pedido,estado_pedido);
            }
        } 
         
     }).then(function(){
         if(envio){
           evento.onNotificarPedidosActualizados({numero_pedido: numero_pedido});  
         }
        res.send(G.utils.r(req.url, 'Inserto Autorizacion de Productos Bloqueados!!!!', 200, {insertarAutorizacionProductos: ''}));
     }).fail(function(err){
         console.log("error insert ",err);
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
ChatController.prototype.listarVerificacionProductos = function(req, res) {
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

    }).fail(function(err) {
       res.send(G.utils.r(req.url, 'Error al Consultar Productos Verificados', 500, {listarVerificacionProductos: {}}));
    }).done();

};

ChatController.$inject = [
                          "m_chat", 
                         ];

module.exports = ChatController;