var ChatModel = function() {

};

/**
* @author Eduar Garcia
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-29
*/
ChatModel.prototype.listarGrupos = function(parametros, callback) {

    var sql =  "a.id, a.nombre, to_char(a.fecha_creacion, 'yyyy-mm-dd') as fecha_creacion, a.estado, \
                CASE WHEN a.estado = '0' THEN 'Inactivo' WHEN a.estado = '1' THEN 'Activo' END AS descripcion_estado,\
                (SELECT COUNT(b.grupo_id) AS total FROM chat_grupos_usuarios b\
                WHERE b.grupo_id = a.id) AS numero_integrantes from chat_grupos a ";
    
    G.knex.select(G.knex.raw(sql)).
    limit(G.settings.limit).
    offset((parametros.pagina - 1) * G.settings.limit).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};


/**
* @author Eduar Garcia
* +Descripcion Cambie el estado de un usuario en un grupo
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-29
*/
ChatModel.prototype.cambiarEstadoUsuarioGrupo = function(parametros, callback) {
    
    G.knex("chat_grupos_usuarios").
    where('grupo_id', parametros.grupo_id).
    andWhere("usuario_id", parametros.usuario_id).
    update({
        estado:Number(parametros.estado),
    }).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 
    
};


/**
* @author Eduar Garcia
* +Descripcion Modificar o crea un gruop
* @params obj: {grupo_id, estado}
* @fecha 2016-09-01
*/
ChatModel.prototype.guardarGrupo = function(parametros, callback) {

   var that = this;
   G.Q.ninvoke(that, "modificarGrupo", parametros).then(function(resultado){
       
       var def = G.Q.defer();
       console.log("resultado modificacion ", resultado);
       if(resultado === 0){
           return G.Q.ninvoke(that, "insertarGrupo", parametros);
       } else {
           def.resolve();
       }
       
   }).then(function(resultado){
       console.log("grupo insertado ", resultado);
       callback(false, resultado);
       
   }).fail(function(err){
       callback(err)
   });;
};

/**
* @author Eduar Garcia
* +Descripcion Modifica un grupo
* @params obj: {grupo_id, estado}
* @fecha 2016-09-01
*/
ChatModel.prototype.modificarGrupo = function(parametros, callback) {
    
    var that = this;
    G.Q.ninvoke(that, "obtenerGrupoPorNombre", parametros).
    then(function(resultado){
        
        if(resultado.length > 0 && parametros.grupo_id !== resultado[0].id){
            throw { msj:"El nombre del grupo no esta disponible", status:403 };
        } else {            
            return G.knex("chat_grupos").
            where('id', parametros.grupo_id).
            update({
                estado:parametros.estado,
                nombre:parametros.nombre
            });
        }
        
    }).then(function(resultado){
        callback(false, resultado);
    }).fail(function(err){
        callback(err); 
    });
    
};


/**
* @author Eduar Garcia
* +Descripcion Inserta un grupo
* @params obj: {grupo_id, estado}
* @fecha 2016-09-01
*/
ChatModel.prototype.insertarGrupo = function(parametros, callback) {
    var that = this;
    
    G.Q.ninvoke(that, "obtenerGrupoPorNombre", parametros).
    then(function(resultado){
        
        if(resultado.length > 0 && parametros.grupo_id !== resultado[0].id){
            throw { msj:"El nombre del grupo no esta disponible", status:403 };
        } else {            
            return G.knex("chat_grupos").returning("id").insert({"estado":parametros.estado, "nombre":parametros.nombre});
        }
        
    }).then(function(resultado){
        callback(false, resultado);
    }).fail(function(err){
        callback(err); 
    });

}

/**
* @author Eduar Garcia
* +Descripcion Permite obtener un grupo por nombre, se utiliza para validar que no hallan nombres repetidos
* @params obj: {nombre}
* @fecha 2016-09-01
*/
ChatModel.prototype.obtenerGrupoPorNombre = function(parametros, callback) {
    
    G.knex.select('*').from("chat_grupos").
    whereRaw("lower(nombre) = ?", [parametros.nombre.toLowerCase()]).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};

/**
* @author Eduar Garcia
* +Descripcion Permite obtener un grupo por id
* @params obj: {nombre}
* @fecha 2016-09-01
*/
ChatModel.prototype.obtenerGrupoPorId = function(parametros, callback) {
    
    G.knex.select('*').from("chat_grupos").
    where("id", parseInt(parametros.grupo_id)).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};

/**
* @author Eduar Garcia
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatModel.prototype.listarUsuariosPorGrupo = function(parametros, callback) {
    
    var columns = [
        "c.nombre as nombre_grupo",
        "a.grupo_id",
        "b.usuario",
        "b.usuario_id",
        "b.nombre",
        "a.estado"
    ];
    
    var query = G.knex.column(columns).
    from("chat_grupos_usuarios as a").
    innerJoin("system_usuarios as b", "b.usuario_id", "a.usuario_id").
    innerJoin("chat_grupos as c", "a.grupo_id", "c.id");
    
    if(parametros.grupo_id){
        query.where("a.grupo_id", parametros.grupo_id);
    }
    
    if(parametros.termino_busqueda.length > 0){
        query.andWhere(function() {
           if(parametros.filtro.busquedaGrupo){
               this.orWhere("c.nombre", G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
           } else {
               this.orWhere("b.usuario", G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
           }
           
           this.orWhere("b.nombre", G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
        });
    }
    
    query.orderBy("c.nombre", "ASC").limit(G.settings.limit).
    offset((parametros.pagina - 1) * G.settings.limit);
    
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};

/**
* @author Eduar Garcia
* +Descripcion Permite insertar usuarios en los grupos
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatModel.prototype.insertarUsuariosEnGrupo = function(parametros, callback) {
    G.Q.nfcall(__insertarUsuariosEnGrupo, parametros).
    then(function(){
        callback(false);
    }).fail(function(err){
       callback(err); 
    });
};

/**
* @author Eduar Garcia
* +Descripcion Permite insertar usuarios en los grupos
* @params obj: {usuarios}
* @fecha 2016-09-06
*/
ChatModel.prototype.guardarConversacion = function(parametros, callback) {
    var that = this;
    G.knex("chat_conversacion").
    returning("id").
    insert({"usuario_creador":parametros.usuario_id}).
    then(function(resultado){
        parametros.conversacionId = resultado[0];
        return G.Q.ninvoke(that, "insertarUsuariosEnConversacion", parametros);
        
    }).then(function(){
        callback(false, parametros.conversacionId);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });  
};

/**
* @author Eduar Garcia
* +Descripcion Consulta las conversaciones de un usuario
* @params obj: {usuario_id}
* @fecha 2016-09-01
*/
ChatModel.prototype.obtenerConversaciones = function(parametros, callback) {
    var that = this;
    var columns = [
        "a.id_conversacion",
        "b.id",
        "a.usuario_id",
        G.knex.raw("to_char(b.fecha_creacion, 'yyyy-dd-mm') as fecha_creacion"),
        "a.estado AS estado_usuario_conversacion"
    ];
    
    var query = G.knex.column(columns).
    from("chat_conversacion_usuarios as a").
    innerJoin("chat_conversacion as b", "b.id", "a.id_conversacion");
    
    if(parametros.usuario_id){
        query.where("a.usuario_id", parametros.usuario_id);
    }
    
    /*query.orderBy("c.nombre", "ASC").limit(G.settings.limit).
    offset((parametros.pagina - 1) * G.settings.limit);*/
    
    query.orderBy("b.fecha_creacion", "DESC").then(function(resultado){
        
        var parametros = {
            conversaciones:resultado,
            contexto:that,
            index:0
        };
        
        return G.Q.nfcall(__obtenerTituloConversaciones, parametros);
    }).then(function(resultado){
       
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};


/**
* @author Eduar Garcia
* +Descripcion Permite armar el titulo de una conversacion con el nombre de los usuarios participantes ej: Lina, Marcela, Rafael etc
* @params obj: Object conversaciones {conversacion}
* @fecha 2016-09-07
*/
ChatModel.prototype.obtenerUsuariosConversacion = function(parametros, callback) {

    var that = this;
    var columns = [
        "b.usuario",
        "a.*"
    ];
    
    var query = G.knex.column(columns).
    from("chat_conversacion_usuarios as a").
    innerJoin("system_usuarios as b", "b.usuario_id", "a.usuario_id");
    
    query.where("a.id_conversacion", parametros.conversacion.id_conversacion).
    then(function(usuarios){
        
        if(parametros.titulo){
            var titulos = [];
        
            for(var i in usuarios){
                var usuario = usuarios[i];

                titulos.push(usuario.usuario);

            }

            callback(false, titulos.join());
        } else {
            callback(false, usuarios);
        }

    }).then(function(resultado){
        
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });
    
};


/**
* @author Eduar Garcia
* +Descripcion Permite obtener el detalle de una conversacion
* @params obj: Object conversaciones {conversacion}
* @fecha 2016-09-07
*/
ChatModel.prototype.obtenerDetalleConversacion = function(parametros, callback) {
    
    var that = this;
    var columns = [
        "a.id",
        "b.usuario",
        "a.mensaje",
        "a.archivo_adjunto",
        G.knex.raw("to_char(a.fecha_mensaje, 'HH:MM am') as fecha_mensaje")
    ];
    
    var query = G.knex.column(columns).
    from("chat_conversacion_detalle as a").
    innerJoin("system_usuarios as b", "b.usuario_id", "a.usuario_id").
    where("a.id_conversacion", parametros.id_conversacion);
    

    if(parametros.detalle_id){
        query.where("id", parametros.detalle_id);
    }
    
    query.then(function(resultado){
        
        callback(false, resultado);
        
    }).catch(function(err){
        
        callback(err);       
    });
    
};

/**
* @author Eduar Garcia
* +Descripcion Permite insertar usuarios en una conversacion
* @params obj: {id, usuarios}
* @fecha 2016-09-06
*/
ChatModel.prototype.insertarUsuariosEnConversacion = function(parametros, callback) {
    G.Q.nfcall(__insertarUsuariosEnConversacion, parametros).
    then(function(){
        callback(false);
    }).fail(function(err){
       callback(err); 
    });
};


/**
* @author Eduar Garcia
* +Descripcion Permite insertar usuarios en una conversacion
* @params obj: {id_conversacion, usuario_id}
* @fecha 2016-09-06
*/
ChatModel.prototype.guardarMensajeConversacion = function(parametros, callback) {
    var that = this;
    G.knex("chat_conversacion_detalle").
    insert({"id_conversacion":parametros.id_conversacion, "usuario_id":parametros.usuario_id, "mensaje":parametros.mensaje}).
    returning("id").
    then(function(resultado){
        console.log("ultimo insertado ", resultado);
        return G.Q.ninvoke(that, "obtenerDetalleConversacion",{id_conversacion:parametros.id_conversacion, detalle_id:resultado[0]});
        
    }).then(function(resultado){
        console.log("ultimo registro ", resultado);
        callback(false, resultado);
        
    }).catch(function(err){
        callback(err);       
    }); 
};

/**
* @author Eduar Garcia
* +Descripcion Funcion recursiva para obtener titulo de un arreglo de conversaciones
* @params obj: Object conversaciones {conversaciones, index, contexto}
* @fecha 2016-09-07
*/
function __obtenerTituloConversaciones(parametros, callback){
    var conversacion = parametros.conversaciones[parametros.index];
    
    if(!conversacion){
        callback(false, parametros.conversaciones);
        return;
    }
    
    setTimeout(function(){
        G.Q.ninvoke(parametros.contexto, "obtenerUsuariosConversacion", {conversacion:conversacion, titulo:true}).
        then(function(titulo){
            parametros.conversaciones[parametros.index].titulo = titulo;
            parametros.index ++;
            __obtenerTituloConversaciones(parametros, callback);
        }).fail(function(err){
            //console.log("error generado ", err);
            callback(err);
        });
    },0);
    
}

function __insertarUsuariosEnConversacion(parametros, callback){
    
    var usuario = parametros.usuarios[0];
    
    if(!usuario){
        callback(false);
        return;
    }
    
    G.knex("chat_conversacion_usuarios").
    insert({"id_conversacion":parametros.conversacionId, "usuario_id":usuario.id}).
    then(function(resultado){
        
        var time = setTimeout(function(){
            parametros.usuarios.splice(0,1);
            __insertarUsuariosEnConversacion(parametros, callback);
            clearTimeout(time);
        },0);
        
    }).catch(function(err){
        callback(err);       
    });  
}

function __insertarUsuariosEnGrupo(parametros, callback){
    
    var usuario = parametros.usuarios[0];
    
    if(!usuario){
        callback(false);
        return;
    }
    
    G.knex("chat_grupos_usuarios").
    returning("id").
    insert({"grupo_id":parametros.grupo_id, "usuario_id":usuario.id}).
    then(function(resultado){
        
        var time = setTimeout(function(){
            parametros.usuarios.splice(0,1);
            __insertarUsuariosEnGrupo(parametros, callback);
        },0);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });  
}


module.exports = ChatModel;