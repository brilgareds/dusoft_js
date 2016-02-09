

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
    var sql = "b.empresa_id, b.razon_social, prefijo, numero, cantidad_cajas, cantidad_neveras, observacion, sw_otras_salidas, fecha_registro, c.nombre \
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

//
/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar el detalle del pedido
 */
ValidacionDespachosModel.prototype.registrarAprobacion = function(obj, callback) {

 var sql = "INSERT INTO aprobacion_despacho_planillas (empresa_id, prefijo, numero, cantidad_cajas, cantidad_neveras,observacion,sw_otras_salidas, fecha_registro, usuario_id) \
                 VALUES ( :1, :2, :3, :4, :5, :6, :7, NOW(), :8 );";

    G.knex.raw(sql, {1:obj.empresa_id, 2:obj.prefijo, 3:obj.numero, 4:obj.cantidad_cajas, 5:obj.cantidad_neveras, 
                     6:obj.observacion, 7: obj.estado, 8: obj.usuario_id}).
     then(function(resultado){
       callback(false, resultado);
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
    
    var sql = "SELECT DISTINCT ON  (prefijo) numero, prefijo, observacion FROM aprobacion_despacho_planillas "

    G.knex.raw(sql)
    .then(function (resultado) {
        callback(false, resultado.rows);
    })
    .catch(function (error) {
        console.log("error ", error);
        callback(error);
    }).done();
};

ValidacionDespachosModel.prototype.listarNumeroPrefijoOtrasSalidas = function (obj ,callback) {
    
    var sql = "SELECT numero, prefijo, observacion FROM aprobacion_despacho_planillas WHERE prefijo = :1"

    G.knex.raw(sql, {1:obj.prefijo})
    .then(function (resultado) {
        callback(false, resultado.rows);
    })
    .catch(function (error) {
        console.log("error ", error);
        callback(error);
    }).done();
};



module.exports = ValidacionDespachosModel;