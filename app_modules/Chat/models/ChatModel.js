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
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-29
*/
ChatModel.prototype.cambiarEstado = function(parametros, callback) {

    var sql =  "UPDATE chat_grupos SET estado = :1 WHERE id = :2 ";
    
    G.knex.raw(sql, {1:parametros.estado, 2:parametros.grupo_id}).
    then(function(resultado){
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
    
    G.knex("chat_grupos").
    where('id', parametros.grupo_id).
    update({
        estado:parametros.estado,
        nombre:parametros.nombre
    }).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    });   
};


/**
* @author Eduar Garcia
* +Descripcion Modifica un grupo
* @params obj: {grupo_id, estado}
* @fecha 2016-09-01
*/
ChatModel.prototype.insertarGrupo = function(parametros, callback) {
    var that = this;
    
    G.Q.ninvoke(that, "obtenerGrupoPorNombre", parametros).
    then(function(resultado){
        
        if(resultado.length > 0){
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
* +Descripcion consulta los grupos del chat, permite tener un termino de busqueda
* @params obj: {pagina, termino_busqueda}
* @fecha 2016-08-30
*/
ChatModel.prototype.listarUsuariosPorGrupo = function(parametros, callback) {

    var sql =  "SELECT c.nombre, a.grupo_id, b.usuario, b.usuario_id from chat_grupos_usuarios a\
                INNER JOIN system_usuarios b ON b.usuario_id = a.usuario_id\
                INNER JOIN chat_grupos c ON a.grupo_id = c.id\
                WHERE a.grupo_id = :1 ";
    
    G.knex.raw(sql, {1:parametros.grupo_id}).
    then(function(resultado){
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