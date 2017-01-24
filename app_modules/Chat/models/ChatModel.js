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
    
    var query = G.knex.select(G.knex.raw(sql));
    
    if(parametros.termino_busqueda.length > 0){
        query.where("a.nombre", G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
    } 
    
    if(parametros.estado){
        query.where("estado", parametros.estado)
    }
    
    query.limit(G.settings.limit).
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
    
    query.where("c.estado", "1").
    orderBy("c.nombre", "ASC").limit(G.settings.limit).
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
    var promesa;
    var usuariosExistentes = false;
    var def = G.Q.defer();
    
    G.Q.nfcall(__verificarConversacionPorUsuarios, parametros).then(function(conversacion){
        
        usuariosExistentes = (conversacion.length === 0) ? false : true; 
        
        console.log("id conversacion ", parametros.id_conversacion, " usuarios existentens ", usuariosExistentes);
        
        if(parseInt(parametros.id_conversacion) === 0 && !usuariosExistentes){
            promesa = G.Q.ninvoke(that, "insertarConversacion", parametros);
        } else {
            
            if(usuariosExistentes){
                parametros.id_conversacion = conversacion[0].id_conversacion;
            }
            
            var obj = {
                campos:{
                    estado:'1'
                },
                id_conversacion:parametros.id_conversacion
            };

            promesa = G.Q.ninvoke(that, "modificarConversacion", obj);
        }

        return promesa;
        
    }).then(function(resultado){
        console.log("resultado despues de validar ", resultado);
        parametros.conversacionId = resultado[0];
        
        if(usuariosExistentes){
            def.resolve();
        } else {
            return G.Q.ninvoke(that, "insertarUsuariosEnConversacion", parametros);
        }
        
    }).then(function(){
        callback(false, parametros.conversacionId);

    }).fail(function(err){
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
    
    var conversaciones = [];
        
    var query = G.knex.column(columns).
    from("chat_conversacion_usuarios as a").
    innerJoin("chat_conversacion as b", "b.id", "a.id_conversacion");
    
    if(parametros.usuario_id){
        query.where("a.usuario_id", parametros.usuario_id);
    }
    
    query.orderBy("b.fecha_modificacion", "DESC").then(function(resultado){
        
        var parametros = {
            conversaciones:resultado,
            contexto:that,
            index:0
        };
        
        return G.Q.nfcall(__obtenerTituloConversaciones, parametros);
    }).then(function(_conversaciones){
        var def = G.Q.defer();
        conversaciones = _conversaciones;
        
        if(parametros.termino_busqueda && parametros.termino_busqueda.length > 0){
            return G.Q.nfcall(__filtrarDetalleConversaciones, {conversaciones:conversaciones, index:0, contexto:that, termino_busqueda:parametros.termino_busqueda, filtro: parametros.filtro});
        }
       
        
    }).then(function(_conversaciones){
        
        if(_conversaciones){
            conversaciones = _conversaciones;
        }
        
        callback(false, conversaciones);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};


function __filtrarDetalleConversaciones(parametros, callback){
    var conversacion = parametros.conversaciones[parametros.index];
    
    if(!conversacion){
        
        callback(false, parametros.conversaciones);
        return;
    }
    
    conversacion.termino_busqueda = parametros.termino_busqueda;
    conversacion.filtro = parametros.filtro;
    
    G.Q.ninvoke(parametros.contexto, "obtenerDetalleConversacion", conversacion).then(function(resultado){
        
        //Filtra solo las conversaciones con resultados
        if(resultado.length === 0){
            parametros.conversaciones.splice(parametros.index, 1);
        } else {
            parametros.conversaciones[parametros.index]["detalle"] = resultado;
            parametros.index++;
        }
             
        __filtrarDetalleConversaciones(parametros, callback);
        
    }).fail(function(err){
        callback(err);
    });
       
}


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
        "b.nombre",
        "a.*"
    ];
    
    var query = G.knex.column(columns).
    from("chat_conversacion_usuarios as a").
    innerJoin("system_usuarios as b", "b.usuario_id", "a.usuario_id");
    
    query.where("a.id_conversacion", parametros.conversacion.id_conversacion);
    
    
    if(parametros.usuario_id){
        query.where("a.usuario_id", parametros.usuario_id);
    }
    
    query.then(function(usuarios){
        
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
        "a.fecha_mensaje as fecha_registro",
        G.knex.raw("to_char(a.fecha_mensaje, 'dd-Mon HH:MI am') as fecha_mensaje")
    ];
    
    var query = G.knex.column(columns).
    from("chat_conversacion_detalle as a").
    innerJoin("system_usuarios as b", "b.usuario_id", "a.usuario_id").
    where("a.id_conversacion", parametros.id_conversacion);
    

    if(parametros.detalle_id){
        query.where("id", parametros.detalle_id);
    }
    
    if(parametros.termino_busqueda && parametros.termino_busqueda.length > 0){
        query.andWhere(function() {
                        
            if(parametros.filtro && parametros.filtro.usuario){ 
                this.where("b.usuario", G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
            } else {
                this.where(G.knex.raw("a.mensaje"), G.constants.db().LIKE, "%" + parametros.termino_busqueda + "%");
            }
            
        });
    }
        
    query.limit(G.settings.limit).
    offset((parametros.pagina - 1) * G.settings.limit).
    orderBy("a.fecha_mensaje", "desc");
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
    parametros.contexto = this;
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
    var id;
    
    G.knex("chat_conversacion_detalle").
    insert({"id_conversacion":parametros.id_conversacion, "usuario_id":parametros.usuario_id, "mensaje":parametros.mensaje, "archivo_adjunto":parametros.archivoAdjunto}).
    returning("id").then(function(resultado){
        
        id = resultado[0];
        var obj = {
            campos:{
                fecha_modificacion:'now()'
            },
            id_conversacion:parametros.id_conversacion
        };
        
        return G.Q.ninvoke(that, "modificarConversacion", obj );
        
    }).then(function(resultado){
        console.log("ultimo insertado ", resultado);
        return G.Q.ninvoke(that, "obtenerDetalleConversacion",{id_conversacion:parametros.id_conversacion, detalle_id:id});
        
    }).then(function(resultado){
        console.log("ultimo registro ", resultado);
        callback(false, resultado);
        
    }).catch(function(err){
        callback(err);       
    }); 
};

/**
* @author Eduar Garcia
* +Descripcion Modifica el tiempo de modificacion de una conversacion al guardar un mensaje
* @params obj: {id_conversacion, usuario_id}
* @fecha 2016-09-06
*/
ChatModel.prototype.modificarConversacion = function(parametros, callback) {
    G.knex("chat_conversacion").
    where('id', parametros.id_conversacion).
    update(parametros.campos).
    returning("id").
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    });
 
};


/**
* @author Eduar Garcia
* +Descripcion Crea una conversacion
* @params obj: {id_conversacion, usuario_id}
* @fecha 2016-09-06
*/
ChatModel.prototype.insertarConversacion = function(parametros, callback) {
    G.knex("chat_conversacion").
    returning("id").   
    insert({"usuario_creador":parametros.usuario_id}).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });  
 
};


/**
* @author Eduar Garcia
* +Descripcion Remueve un usuario de una conversacion
* @params obj: {id_conversacion, usuario_id}
* @fecha 2016-09-15
*/
ChatModel.prototype.removerUsuarioConversacion = function(parametros, callback) {
    G.knex("chat_conversacion_usuarios").
    where('id_conversacion', parametros.id_conversacion).
    andWhere('usuario_id', parametros.usuario_id).
    del().
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });  
};

/**
* @author Eduar Garcia
* +Descripcion Obtiene el token de un usuario en la aplicacion del chat
* @params obj: {appId, usuario_id}
* @fecha 2017-01-17
*/
ChatModel.prototype.obtenerIdDispositivoPorUsuario = function(parametros, callback) {
    G.knex.distinct(G.knex.raw('ON (a.device_id) a.*')).
    from("system_usuarios_sesiones as a").
    innerJoin("aplicaciones as b", "b.id", "a.id_aplicacion").
    where('a.usuario_id', parametros.usuario_id).
    andWhere('b.token', parametros.token).
    then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });  
};
/*select distinct on (a.device_id) a.* from system_usuarios_sesiones a 
inner join aplicaciones as b on b.id = a.id_aplicacion
where a.usuario_id = 1350 and b.token = 'dusoft-chat'*/

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
    var def = G.Q.defer();
    
    if(!usuario){
        callback(false);
        return;
    }
    
    G.Q.ninvoke(parametros.contexto, "obtenerUsuariosConversacion",{usuario_id:usuario.id, conversacion:{id_conversacion:parametros.conversacionId}}).then(function(resultado){
        //Inserta el usuario solo si no existe en la conversacion
        console.log("buscando usuario ", resultado);
        if(resultado.length === 0){
            return G.knex("chat_conversacion_usuarios").
                   insert({"id_conversacion":parametros.conversacionId, "usuario_id":usuario.id});
        } else {
            def.resolve();
        }
        
    }).then(function(){
        
        var time = setTimeout(function(){
            parametros.usuarios.splice(0,1);
            __insertarUsuariosEnConversacion(parametros, callback);
            clearTimeout(time);
        },0);
        
    }).fail(function(err){
        callback(err);
    }).done();
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

/**
* @author Eduar Garcia
* +Descripcion Valida que no los usuarios a insertarse no esten ya en otra conversacion
* @params Object: {parametros}
* @fecha 2016-11-28
*/
function __verificarConversacionPorUsuarios(parametros, callback){
    
    var usuarios = [];
    
    for(var i in parametros.usuarios){
        usuarios.push(parametros.usuarios[i].id);
    }
    
    var columns = ["id_conversacion"];
    var query =  G.knex.column(columns).
    from("chat_conversacion_usuarios").
    groupBy("id_conversacion").
    havingRaw("sort(array_agg(usuario_id)) = sort( '{ "+usuarios.join()+" }' :: int[])");
        
    query.then(function(conversacion){

        callback(false, conversacion);
        
    }).catch(function(err){
        callback(err);       
    }); 
    
}


module.exports = ChatModel;