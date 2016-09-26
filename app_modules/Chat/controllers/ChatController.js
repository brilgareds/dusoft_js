
var ChatController = function(mChat, eventChat) {
    this.mChat = mChat;
    this.eventChat = eventChat;

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
    
    
    if (!args.chat  || args.chat.termino_busqueda === undefined  || !args.chat.pagina) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.chat.pagina === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }
        

    G.Q.ninvoke(that.mChat,'listarGrupos', args.chat).then(function(grupos) {
        res.send(G.utils.r(req.url, 'Listado de grupos', 200, {grupos: grupos}));
      
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Listado los grupos', 500, {grupos: {}}));
    }).done();


};

/**
* @author Eduar Garcia
* +Descripcion Permite listar los usuarios de un grupo
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatController.prototype.listarUsuariosPorGrupo = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.mChat,'listarUsuariosPorGrupo', args.chat).then(function(usuarios) {
        res.send(G.utils.r(req.url, 'Listado de grupos', 200, {usuarios: usuarios}));
      
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error Listado los grupos', 500, {usuarios: {}}));
    }).done();


};


/**
* @author Eduar Garcia
* +Descripcion Permite modificar el estado de un grupo
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-29
*/
ChatController.prototype.insertarUsuariosEnGrupo = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.grupo_id   || !args.chat.usuarios) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'insertarUsuariosEnGrupo', args.chat).then(function(grupos) {
        res.send(G.utils.r(req.url, 'Listado de usuarios', 200, {}));
      
    }).fail(function(err) {
        res.send(G.utils.r(req.url, 'Error guardando usuario', 500, {}));
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion Permite modificar el estado de un grupo
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatController.prototype.guardarGrupo = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || args.chat.grupo_id === undefined || !args.chat.nombre) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'guardarGrupo', args.chat).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Listado de grupos', 200, {grupo_id: resultado}));
      
    }).fail(function(err) {
        
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion Permite obtener un grupo por id
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatController.prototype.obtenerGrupoPorId = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.grupo_id ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'obtenerGrupoPorId', args.chat).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Listado de grupos', 200, {grupo: resultado}));
      
    }).fail(function(err) {
        
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion Permite inactivar un usuario en determinado grupo
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatController.prototype.cambiarEstadoUsuarioGrupo = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.grupo_id || !args.chat.usuario_id || args.chat.estado === undefined ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'cambiarEstadoUsuarioGrupo', args.chat).then(function(resultado) {
        res.send(G.utils.r(req.url, 'Eliminar usuario', 200, {grupo: resultado}));
      
    }).fail(function(err) {
        
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion Permite guardar una conversacion
* @params obj: {usuarios, usuario_id}
* @fecha 2016-09-06
*/
ChatController.prototype.guardarConversacion = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.usuarios || !args.chat.usuario_id ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'guardarConversacion', args.chat).then(function(conversacionId) {
        res.send(G.utils.r(req.url, 'Guardar conversacion', 200, {conversacionId: conversacionId}));
      
    }).fail(function(err) {
        console.log("error ", err);
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion Remueve un usuario de una conversacion
* @params obj: {usuarios, usuario_id}
* @fecha 2016-09-06
*/
ChatController.prototype.removerUsuarioConversacion = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.id_conversacion || !args.chat.usuario_id ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'removerUsuarioConversacion', args.chat).then(function() {
        res.send(G.utils.r(req.url, 'Cambiar estado de usuario', 200, {}));
      
    }).fail(function(err) {
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};

/**
* @author Eduar Garcia
* +Descripcion Permite consultar conversaciones
* @params obj: {usuario_id}
* @fecha 2016-09-07
*/
ChatController.prototype.obtenerConversaciones = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.usuario_id ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'obtenerConversaciones', args.chat).then(function(conversaciones) {
        res.send(G.utils.r(req.url, 'Conversaciones usuario', 200, {conversaciones: conversaciones}));
      
    }).fail(function(err) {
        console.log("errror ", err);
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion Permite consultar detalle de una conversacion
* @params obj: {usuario_id}
* @fecha 2016-09-07
*/
ChatController.prototype.obtenerDetalleConversacion = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    
    if (!args.chat  || !args.chat.id_conversacion ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
  
    G.Q.ninvoke(that.mChat,'obtenerDetalleConversacion', args.chat).then(function(conversaciones) {
        res.send(G.utils.r(req.url, 'Conversaciones usuario', 200, {conversaciones: conversaciones}));
      
    }).fail(function(err) {
        
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion Ingresa un mensaje a la conversacion
* @params obj: {usuario_id}
* @fecha 2016-09-07
*/
ChatController.prototype.guardarMensajeConversacion = function(req, res) {
    var that = this;
    var args = req.body.data;
    var mensajeGuardado = {};
    
    if (!args.chat  || !args.chat.id_conversacion || !args.chat.usuario_id || !args.chat.mensaje ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    
    G.Q.ninvoke(that, "subirArchivoMensaje", {req:req}).then(function(archivo){
        
        if(archivo.nombreArchivo){
            args.chat.archivoAdjunto = archivo.nombreArchivo;
            args.chat.mensaje = archivo.nombreArchivo;
        }
        
        return G.Q.ninvoke(that.mChat,'guardarMensajeConversacion', args.chat);
        
    }).then(function(_mensajeGuardado) {
        mensajeGuardado = _mensajeGuardado;
        return G.Q.ninvoke(that.mChat, "obtenerUsuariosConversacion", {conversacion:{id_conversacion:args.chat.id_conversacion}, titulo:false});
      
    }).then(function(usuarios){
        var detalle = mensajeGuardado[0];
        detalle.id_conversacion = args.chat.id_conversacion;
        return G.Q.ninvoke(that.eventChat,"onNotificarMensaje",detalle, usuarios, args.chat.usuario_id);
        
        
    }).then(function(){
        res.send(G.utils.r(req.url, 'Conversaciones usuario', 200, {conversacion: mensajeGuardado}));
        
    }).fail(function(err) {
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        res.send(G.utils.r(req.url, msj , status, {}));
    }).done();

};


/**
* @author Eduar Garcia
* +Descripcion Consulta los usuarios de una conversacion
* @params obj: {usuario_id}
* @fecha 2016-09-14
*/
ChatController.prototype.listarUsuariosConversacion = function(req, res) {
    var that = this;
    var args = req.body.data;
    
    if (!args.chat  || !args.chat.id_conversacion ) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.mChat, "obtenerUsuariosConversacion", {conversacion:{id_conversacion:args.chat.id_conversacion}, titulo:false}).then(function(usuarios){
        
        res.send(G.utils.r(req.url, 'Usuarios', 200, {usuarios: usuarios}));
        
    }).fail(function(err){
        var msj = err;
        var status = 500;
        
        if(err.status){
            status = err.status;
            msj = err.msj;
        }
        
        res.send(G.utils.r(req.url, msj , status, {}));
    });
    

};

/**
* @author Eduar Garcia
* +Descripcion Permite subir un archivo en el chat
* @params obj: {usuario_id}
* @fecha 2016-09-07
*/
ChatController.prototype.subirArchivoMensaje = function(parametros, callback) {
    
    if(!parametros.req.files.file){
        callback(false, {});
        return;
    }
    
    G.Q.ninvoke(G.utils, "subirArchivo", parametros.req.files, true).then(function(_rutaNueva) {
        console.log("file was moved to ", _rutaNueva, " original ", parametros.req.files.file.name);
        
        callback(false, {rutaNueva:'_rutaNueva', nombreArchivo:parametros.req.files.file.name});
        
    }).fail(function(err){
        callback(err);
    })
    

};






ChatController.$inject = [
                          "m_chat", 
                          "e_chat"
                         ];

module.exports = ChatController;