

var ValidacionDespachosModel = function () {

};

/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado listar los despachos aprobados
 */
ValidacionDespachosModel.prototype.listarDespachosAprobados = function(obj, callback){
   
    var fecha = "";
    var subfijo = "AND";
    if(!obj.registroUnico){
        fecha = "a.fecha_registro between :fechaInicial and :fechaFinal and";
        subfijo = "OR";
    }
    // Nota : Solo se consultan docuementos o pedido que hayan sido auditados
    var sql = "a.id_aprobacion_planillas, b.empresa_id, b.razon_social, prefijo, numero, cantidad_cajas, cantidad_neveras, observacion, sw_otras_salidas, fecha_registro, c.nombre \
               FROM aprobacion_despacho_planillas a INNER JOIN empresas b ON a.empresa_id = b.empresa_id \
               INNER JOIN system_usuarios c ON a.usuario_id = c.usuario_id\n\
               WHERE "+fecha+"\
                ( \
                    a.prefijo :: varchar "+G.constants.db().LIKE+"  :prefijo and \
                    a.numero  :: varchar "+G.constants.db().LIKE+"  :numero  \
                   \
                ) "+subfijo+" a.empresa_id :: varchar "+G.constants.db().LIKE+"  :empresa_id";
    // paginaActual 
   
    var parametros = {
        fechaInicial: obj.fechaInicial, 
        fechaFinal: obj.fechaFinal, 
        prefijo: "%"+ obj.prefijo +"%", 
        numero: "%"+ obj.numero  +"%",
        empresa_id: obj.empresa_id
    };
    
    var query = G.knex.select(G.knex.raw(sql, parametros)).
    limit(G.settings.limit).
    offset((obj.paginaActual - 1) * G.settings.limit).orderBy("a.prefijo", "desc").then(function(resultado){
        
        callback(false, resultado);
    }).catch(function(err){
        
        callback(err);
       
    });
};

/*
 * @author : Eduar Garcia
 * @fecha:  26/12/2016
 * Descripcion :  Permite insertar el registro de una imagen
 */
ValidacionDespachosModel.prototype.agregarImagen = function(obj, callback) {
    
    G.knex("aprobacion_despacho_planillas_imagenes").
    returning("id").
    insert({"id_aprobacion":obj.id_aprobacion, "path":obj.path}).
    then(function(resultado){
        
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 
};

/*
 * @author : Eduar Garcia
 * @fecha:  26/12/2016
 * Descripcion :  Permite eliminar el registro de una imagen
 */
ValidacionDespachosModel.prototype.eliminarImagen = function(obj, callback) {
    
    G.knex("aprobacion_despacho_planillas_imagenes").
    del().
    where("id", obj.id).
    then(function(resultado){
        
        callback(false, resultado);
        
    }).catch(function(err){
        console.log("error sql",err);
        callback(err);       
    }); 
};




/*
* funcion que realiza consulta a la tabla Empresas
* @param {type} callback
* @returns {datos de consulta}
*/
// json
ValidacionDespachosModel.prototype.listarImagenes = function (obj,callback) {

    var column = [
        "id",
        "id_aprobacion",
        "path"
    ];

    var query = G.knex.column(column)
    .select()
    .from('aprobacion_despacho_planillas_imagenes')
    .where("id_aprobacion", obj.id_aprobacion)
    .then(function (rows) {
        callback(false, rows);

    }).catch(function (error) {
        callback(error);
    }).done();
};


/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar el detalle del pedido
 */
ValidacionDespachosModel.prototype.registrarAprobacion = function(obj, callback) {
 
 var sql = "INSERT INTO aprobacion_despacho_planillas (empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras,observacion,sw_otras_salidas, fecha_registro, usuario_id) \
                 VALUES ( :1, :2, :3, :4, :5, :6, :7, NOW(), :8 ) returning id_aprobacion_planillas;";

    G.knex.raw(sql, {1:obj.empresa_id, 2:obj.prefijo, 3:obj.numero, 4:obj.cantidad_cajas, 5:obj.cantidad_neveras, 
                     6:obj.observacion, 7: obj.estado, 8: obj.usuario_id}).
     then(function(resultado){
       callback(false, resultado.rows[0]);
    }).catch(function(err){
        
       callback(err);
    });
};

/*
* funcion que realiza consulta a la tabla Empresas
* @param {type} callback
* @returns {datos de consulta}
*/
// json
ValidacionDespachosModel.prototype.listarEmpresas = function (empresaNombre,callback) {

    var column = [
        "empresa_id",
        "razon_social"
    ];

    var query = G.knex.column(column)
    .select()
    .from('empresas')
    .where(G.knex.raw("razon_social :: varchar"), G.constants.db().LIKE, "%" + empresaNombre + "%")
    .limit(5)//;
//             callback(false, query.toSQL());
    .then(function (rows) {
        callback(false, rows);
    })
    .catch(function (error) {
        callback(error);
    }).done();
};


ValidacionDespachosModel.prototype.listarDocumentosOtrasSalidas = function (obj ,callback) {
    
    //Para el caso de otras salidas se valida que las cantidades pasadas por despacho sean menores a las aprobadas por seguridad
    var sql = "SELECT DISTINCT ON  (a.prefijo) a.numero, a.prefijo, a.observacion FROM\
                aprobacion_despacho_planillas AS a WHERE (\
                  SELECT count(b.numero) as total FROM inv_planillas_detalle_empresas as b WHERE b.prefijo = a.prefijo\
                ) < (\
                  SELECT count(c.numero) as total FROM aprobacion_despacho_planillas as c WHERE c.prefijo = a.prefijo\
                ) AND (a.prefijo "+G.constants.db().LIKE+" :1 OR  a.numero::VARCHAR "+G.constants.db().LIKE+" :1)";
    
    
    G.knex.raw(sql, {1: "%"+ obj.termino_busqueda + "%"})
    .then(function (resultado) {
        callback(false, resultado.rows);
    })
    .catch(function (error) {
       
        callback(error);
    }).done();
};

ValidacionDespachosModel.prototype.listarNumeroPrefijoOtrasSalidas = function (obj ,callback) {
    
    var sql = "SELECT numero, prefijo, observacion, empresa_id FROM aprobacion_despacho_planillas WHERE prefijo = :1\
               AND numero NOT IN( SELECT numero FROM inv_planillas_detalle_empresas WHERE prefijo = :1)"

    G.knex.raw(sql, {1:obj.prefijo})
    .then(function (resultado) {
        callback(false, resultado.rows);
    })
    .catch(function (error) {
      
        callback(error);
    }).done();
};


ValidacionDespachosModel.prototype.validarExistenciaDocumento = function (obj ,callback) {
    
    var sql = "SELECT numero, prefijo, empresa_id FROM aprobacion_despacho_planillas WHERE prefijo = :1\
               AND numero = :2 AND empresa_id = :3"
    
    G.knex.raw(sql, {1:obj.prefijo, 2:obj.numero, 3:obj.empresa_id})
    .then(function (resultado) {
       
        callback(false, resultado.rows);
    })
    .catch(function (error) {
      
        callback(error);
    }).done();
};

module.exports = ValidacionDespachosModel;