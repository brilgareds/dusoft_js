var OperariosBodegaModel = function() {

};



/**
 * @api {sql} crear_operarios_bodega Insertar Operarios Bodega 
 * @apiName Insertar Operarios Bodega
 * @apiGroup Terceros (sql)
 * @apiDescription Inserta un operario de Bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} nombre_operario Nombre del Operario
 * @apiParam {String} usuario_id Identifiador del usuario que registra la actualización.
 * @apiParam {String} estado Estado del registro '1' = activos, '0' = Inactivos
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *      INSERT INTO operarios_bodega (nombre, usuario_id, estado) VALUES ( $1, $2, $3 );
 */ 
OperariosBodegaModel.prototype.crear_operarios_bodega = function(nombre_operario, usuario_id, estado, callback) {    
    G.knex.insert({nombre:nombre_operario, usuario_id: usuario_id, estado:estado}).
    into("operarios_bodega").then(function(rows){
        callback(false, rows);
    }).catch(function(err){
        callback(err);
    }).done();
    
};

/**
 * @api {sql} modificar_operarios_bodega Modificar Operarios Bodega 
 * @apiName Modificar Operarios Bodega
 * @apiGroup Terceros (sql)
 * @apiDescription Actualiza los datos de un operario de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} operario_id Identificador o Primary Key del Operario de bodega.
 * @apiParam {String} nombre_operario Nombre del Operario
 * @apiParam {String} usuario_id Identifiador del usuario que registra la actualización.
 * @apiParam {String} estado Estado del registro '1' = activos, '0' = Inactivos
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *      UPDATE operarios_bodega SET nombre= $2, usuario_id=$3, estado=$4 WHERE operario_id = $1 ;
 */ 

OperariosBodegaModel.prototype.modificar_operarios_bodega = function(operario_id, nombre_operario, usuario_id, estado, callback) {

    G.knex("operarios_bodega").
    where("operario_id", operario_id).
    update({nombre : nombre_operario, usuario_id: usuario_id, estado : estado}).then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        callback(err);
    });
    
};


/**
 * @api {sql} listar_operarios_bodega Listar Operarios Bodega 
 * @apiName Listar Operarios Bodega
 * @apiGroup Terceros (sql)
 * @apiDescription Selecciona todos los operarios de bodega.
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {String} termino_busqueda Filtra los operarios de bodega por el campo Nombre.
 * @apiParam {String} estado_registro Estado del registro ejemplo: '' = Todos los operarios, '1' = Operarios activos, '0' = Operarios Inactivos
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : 
 *     Accion : 
 * @apiSuccessExample SQL.
 *      select 
        a.operario_id, 
        a.nombre as nombre_operario, 
        a.usuario_id, 
        b.usuario as descripcion_usuario, 
        a.estado, 
        case when a.estado='1' then 'Activo' else 'Inactivo' end as descripcion_estado 
        from operarios_bodega a 
        left join system_usuarios b on a.usuario_id = b.usuario_id 
        where a.nombre ilike $1 and a.estado = $2 order by 2
 */ 
OperariosBodegaModel.prototype.listar_operarios_bodega = function(termino_busqueda, estado_registro, callback) {    
    var columnas = [
        "a.operario_id", 
        "a.nombre as nombre_operario", 
        "a.usuario_id", 
        "b.usuario as descripcion_usuario", 
        "a.estado", 
        G.knex.raw("case when a.estado='1' then 'Activo' else 'Inactivo' end as descripcion_estado")
    ];
    
    G.knex.column(columnas).
    from("operarios_bodega as a").
    leftJoin("system_usuarios as b","a.usuario_id", "b.usuario_id").
    where("a.nombre", G.constants.db().LIKE, "%" + termino_busqueda + "%").
    andWhere(function(){
        if(estado_registro !== ''){
            this.where("a.estado", estado_registro);
        }
    }).
    then(function(rows){
        callback(false, rows);
    }).
    catch(function(err){
        callback(err);
    });
};

/**
 * @api {sql} seleccionar_operario_bodega Seleccionar Operarios Bodega 
 * @apiName Seleccionar Operarios Bodega
 * @apiGroup Terceros (sql)
 * @apiDescription Selecciona los operarios de bodega (tabla operarios_bodega) filtrados por el id
 * @apiDefinePermission autenticado Requiere Autenticacion
 * Requiere que el usuario esté autenticado.
 * @apiPermission autenticado
 * @apiParam {Number} operario_id Operario de Bodega al que se le asigna el pedido.
 * @apiParam {Function} callback Funcion de retorno de informacion.
 * @apiSuccessExample Este SQL se usa en:
 *     Modulo : PedidosClientes
 *     Accion : Evento - onNotificacionOperarioPedidosAsignados();
 * @apiSuccessExample SQL.
 *     select 
 *     operario_id, 
 *     nombre as nombre_operario, 
 *     usuario_id, 
 *     estado 
 *     from operarios_bodega where operario_id = $1
 */                            
OperariosBodegaModel.prototype.seleccionar_operario_bodega = function(operario_id, callback) {

   var sql = "select operario_id, nombre as nombre_operario, usuario_id, estado from operarios_bodega where operario_id = ?";
    
   G.knex.raw(sql, [operario_id]).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   }); 

};

OperariosBodegaModel.prototype.seleccionar_operario_por_usuario_id = function(usuario_id, callback) {

   var sql = "select operario_id, nombre as nombre_operario, usuario_id, estado from operarios_bodega where usuario_id = ?";
    
   G.knex.raw(sql, [usuario_id]).
   then(function(resultado){
       callback(false, resultado.rows);
   }).catch(function(err){
       callback(err);
   });
    
};


module.exports = OperariosBodegaModel;