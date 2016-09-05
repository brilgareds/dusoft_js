
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
    
    console.log("chat args >>>>>>>>>>>>>>>", args);
    
    if (!args.chat  || args.chat.termino_busqueda === undefined  || !args.chat.pagina) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }

    if (args.chat.pagina === '') {
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
* @author Eduar Garcia
* +Descripcion Permite modificar el estado de un grupo
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
    
    G.Q.ninvoke(this.mChat,'listarUsuariosPorGrupo', args.chat).then(function(usuarios) {
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
  
    G.Q.ninvoke(this.mChat,'insertarUsuariosEnGrupo', args.chat).then(function(grupos) {
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
  
    G.Q.ninvoke(this.mChat,'guardarGrupo', args.chat).then(function(resultado) {
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
  
    G.Q.ninvoke(this.mChat,'obtenerGrupoPorId', args.chat).then(function(resultado) {
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
  
    G.Q.ninvoke(this.mChat,'cambiarEstadoUsuarioGrupo', args.chat).then(function(resultado) {
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

ChatController.$inject = [
                          "m_chat", 
                         ];

module.exports = ChatController;