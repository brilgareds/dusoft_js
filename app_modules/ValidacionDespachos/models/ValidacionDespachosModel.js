var ValidacionDespachosModel = function () {

};

/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado listar los despachos aprobados
 */
ValidacionDespachosModel.prototype.listarDespachosAprobados = function (obj, callback) {

    var columnas = [
        G.knex.raw("distinct on (todo.fecha_registro, todo.id_aprobacion_planillas,todo.observacion, todo.empresa_id,todo.razon_social,\
                todo.nombre, todo.sw_otras_salidas, todo.cantidad_cajas, todo.cantidad_neveras) todo.fecha_registro"),
        "todo.id_aprobacion_planillas",
        "todo.observacion",
        "todo.empresa_id",
        "todo.razon_social",
        "todo.nombre",
        "todo.sw_otras_salidas",
        "todo.cantidad_cajas",
        "todo.cantidad_neveras",
        "todo.prefijo",
        "todo.numero"
    ];

    var columnas_subquery = [
        G.knex.raw("distinct on (fecha_registro, a.id_aprobacion_planillas, observacion, b.empresa_id, b.razon_social, c.nombre, a.sw_otras_salidas,\
                    a.cantidad_cajas, a.cantidad_neveras) fecha_registro"),
        "a.id_aprobacion_planillas",
        "observacion",
        "b.empresa_id",
        "b.razon_social",
        "c.nombre",
        "a.sw_otras_salidas",
        "a.cantidad_cajas",
        "a.cantidad_neveras",
    ];

    var subQuery = G.knex.select(G.knex.raw(columnas_subquery + ", d.prefijo,d.numero"))
            .from('aprobacion_despacho_planillas as a')
            .innerJoin("empresas as b", "b.empresa_id", "a.empresa_id")
            .innerJoin("system_usuarios as c", "c.usuario_id", "a.usuario_id")
            .innerJoin("aprobacion_despacho_planillas_d as d", "d.id_aprobacion_planillas", "a.id_aprobacion_planillas")
            .union(function () {
                this.select(G.knex.raw(columnas_subquery + ", a.prefijo,a.numero"))
                        .from('aprobacion_despacho_planillas as a')
                        .innerJoin("empresas as b", "b.empresa_id", "a.empresa_id")
                        .innerJoin("system_usuarios as c", "c.usuario_id", "a.usuario_id")
                        .leftJoin("aprobacion_despacho_planillas_d as d", "d.id_aprobacion_planillas", "a.id_aprobacion_planillas")
            });

    var query = G.knex.select(columnas)
            .from(G.knex.raw("( " + subQuery + " ) as todo"))
            .where(function () {
                if (!obj.registroUnico) {
                    this.andWhere(G.knex.raw("todo.fecha_registro between '" + obj.fechaInicial + "' and '" + obj.fechaFinal + "'"));
                    this.andWhere(G.knex.raw("( todo.prefijo :: varchar " + G.constants.db().LIKE + "'%" + obj.prefijo + "%' \
                                                and todo.numero  :: varchar " + G.constants.db().LIKE + "'%" + obj.numero + "%' )"));

                } else {

                    this.andWhere('todo.id_aprobacion_planillas', obj.idPlantilla);
                }

            });

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit).orderBy("fecha_registro", "desc");

    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [resultado]:: ", err);
        callback(err);

    });
};

/*
 * @author : Eduar Garcia
 * @fecha:  26/12/2016
 * Descripcion :  Permite insertar el registro de una imagen
 */
ValidacionDespachosModel.prototype.agregarImagen = function (obj, callback) {

    G.knex("aprobacion_despacho_planillas_imagenes").
            returning("id").
            insert({"id_aprobacion": obj.id_aprobacion, "path": obj.path}).
            then(function (resultado) {
                callback(false, resultado);

            }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};

/*
 * @author : Eduar Garcia
 * @fecha:  26/12/2016
 * Descripcion :  Permite eliminar el registro de una imagen
 */
ValidacionDespachosModel.prototype.eliminarImagen = function (obj, callback) {

    G.knex("aprobacion_despacho_planillas_imagenes").
            del().
            where("id", obj.id).
            then(function (resultado) {

                callback(false, resultado);

            }).catch(function (err) {
        console.log("error sql", err);
        callback(err);
    });
};




/*
 * funcion que realiza consulta a la tabla Empresas
 * @param {type} callback
 * @returns {datos de consulta}
 */
// json
ValidacionDespachosModel.prototype.listarImagenes = function (obj, callback) {

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

/**
 * @author Cristian Ardila
 * +Descripcion Transaccion encargada de registrar la cabecera y el detalle de
 *              el despacho ya validado
 * @fecha 06/10/2017
 */
ValidacionDespachosModel.prototype.transaccionRegistrarAprobacion = function (obj, callback) {
    var that = this;
    var idPlanilla;
    G.knex.transaction(function (transaccion) {
        G.Q.ninvoke(that, 'registrarAprobacion', obj, transaccion).then(function (resultado) {
            idPlanilla = resultado.id_aprobacion_planillas;
            return G.Q.nfcall(__registrarDetalleAprobacion, that, 0, resultado.id_aprobacion_planillas, obj.detalle, transaccion);

        }).then(function () {

            transaccion.commit();
        }).fail(function (err) {
            transaccion.rollback(err);
        }).done();
    }).then(function () {
        callback(false, {id_aprobacion_planillas: idPlanilla});
    }).catch(function (err) {
        callback(err);
    }).done();

};


function __registrarDetalleAprobacion(contexto, index, idPlanilla, documentos, transaccion, callback) {

    var documento = documentos[index];

    if (!documento) {
        callback(false);
        return;
    }

    index++;

    G.Q.ninvoke(contexto, 'registrarDetalleAprobacion', idPlanilla, documento, transaccion).then(function (resultado) {

    });
    setTimeout(function () {

        __registrarDetalleAprobacion(contexto, index, idPlanilla, documentos, transaccion, callback);

    }, 300);

}
/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar la cabecera de la aprobacion
 *                de los despachos por parte del encargado de seguridad
 */
ValidacionDespachosModel.prototype.registrarAprobacion = function (obj, transaccion, callback) {

    var sql = "INSERT INTO aprobacion_despacho_planillas (empresa_id, observacion, fecha_registro, cantidad_cajas, cantidad_neveras, usuario_id) \
                 VALUES ( :1, :2,  NOW(), :3, :4, :5 ) returning id_aprobacion_planillas;";

    var query = G.knex.raw(sql, {1: obj.empresaId, 2: obj.observacion, 3: obj.cantidadTotalCajas, 4: obj.cantidadTotalNeveras, 5: obj.usuarioId});

    if (transaccion)
        query.transacting(transaccion);
    query.then(function (resultado) {
        callback(false, resultado.rows[0]);
    }).catch(function (err) {
        console.log("err ", err);
        callback(err);
    });
};

/*
 * @author : Cristian Ardila
 * @fecha:  05/11/2015
 * Descripcion :  Funcion encargada de almacenar el detalle de la aprobacion 
 *                Esta incluye los EFC
 */
ValidacionDespachosModel.prototype.registrarDetalleAprobacion = function (idPlanilla, obj, transaccion, callback) {


    var sql = "INSERT INTO aprobacion_despacho_planillas_d (id_aprobacion_planillas, prefijo, numero, cantidad_cajas, cantidad_neveras,sw_otras_salidas) \
                 VALUES ( :1, :2, :3, :4, :5, :6) returning id_aprobacion_planillas;";

    var query = G.knex.raw(sql, {1: idPlanilla, 2: obj.prefijo.toUpperCase(), 3: obj.numero, 4: obj.cantidadCajas, 5: obj.cantidadNeveras, 6: obj.estado});

    if (transaccion)
        query.transacting(transaccion);
    query.then(function (resultado) {
        callback(false, resultado.rows[0]);
    }).catch(function (err) {
        console.log("err ", err);
        callback(err);
    });

};

/*
 * funcion que realiza consulta a la tabla Empresas
 * @param {type} callback
 * @returns {datos de consulta}
 */
// json
ValidacionDespachosModel.prototype.listarEmpresas = function (empresaNombre, callback) {

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

ValidacionDespachosModel.prototype.listarDocumentosOtrasSalidas = function (obj, callback) {

    //Para el caso de otras salidas se valida que las cantidades pasadas por despacho sean menores a las aprobadas por seguridad
    var sql = "SELECT DISTINCT ON  (b.prefijo) b.numero, b.prefijo, a.observacion FROM\
                aprobacion_despacho_planillas AS a \
                inner join aprobacion_despacho_planillas_d as b on a.id_aprobacion_planillas = b.id_aprobacion_planillas\
                WHERE b.sw_otras_salidas = 1\
                 AND a.fecha_registro  >= '2019-01-01'\n\
                 AND ( SELECT COUNT ( d.numero ) AS total FROM inv_planillas_detalle_empresas AS d WHERE d.prefijo = b.prefijo ) < ( SELECT COUNT ( C.numero ) AS total\
                 FROM aprobacion_despacho_planillas_d AS C WHERE	C.prefijo = b.prefijo)\
                 AND (b.prefijo " + G.constants.db().LIKE + " :1 OR  b.numero::VARCHAR " + G.constants.db().LIKE + " :1)";


    G.knex.raw(sql, {1: "%" + obj.termino_busqueda + "%"})
            .then(function (resultado) {
                callback(false, resultado.rows);
            })
            .catch(function (error) {

                callback(error);
            }).done();
};

ValidacionDespachosModel.prototype.listarNumeroPrefijoOtrasSalidas = function (obj, callback) {

    var sql = "SELECT a.numero, a.prefijo, b.observacion, b.empresa_id FROM aprobacion_despacho_planillas_d as a\
               inner join aprobacion_despacho_planillas as b on a.id_aprobacion_planillas = b.id_aprobacion_planillas \
               WHERE a.prefijo = :1\
               AND a.numero NOT IN( SELECT numero FROM inv_planillas_detalle_empresas WHERE prefijo = :1)\
               ORDER BY numero";

    G.knex.raw(sql, {1: obj.prefijo})
            .then(function (resultado) {
                callback(false, resultado.rows);
            })
            .catch(function (error) {

                callback(error);
            }).done();
};


ValidacionDespachosModel.prototype.validarExistenciaMultiplesDocumentos = function (obj, callback) {
    var that = this;

    G.Q.nfcall(__validarExistenciaMultiplesDocumentos, that, 0, obj.documentos, obj.empresa_id, [], []).then(function (resultado) {

        callback(false, resultado);
    }).catch(function (error) {
        callback(error);
    }).done();
};

function __validarExistenciaMultiplesDocumentos(contexto, index, documentos, empresa, documentosAprobados, documentosNoAprobados, callback) {

    var documento = documentos[index];

    if (!documento) {
        callback(false, {documentosNoAprobados: documentosNoAprobados, documentosAprobados: documentosAprobados});
        return;
    }

    index++;

    G.Q.ninvoke(contexto, 'validarExistenciaDocumento', {prefijo: documento.prefijo, numero: documento.numero, empresa_id: empresa}).then(function (resultado) {

        if (resultado.length > 0) {
            documentosAprobados.push(documento);
        } else {
            documentosNoAprobados.push(documento);
        }
    });
    setTimeout(function () {

        __validarExistenciaMultiplesDocumentos(contexto, index, documentos, empresa, documentosAprobados, documentosNoAprobados, callback);

    }, 300);

}


ValidacionDespachosModel.prototype.validarExistenciaDocumento = function (obj, callback) {

    var sql = "SELECT b.numero, b.prefijo, a.empresa_id \
               FROM aprobacion_despacho_planillas as a\
               INNER JOIN aprobacion_despacho_planillas_d as b \
               ON a.id_aprobacion_planillas = b.id_aprobacion_planillas\
               WHERE b.prefijo = :1\
               AND b.numero = :2 AND a.empresa_id = :3"

    G.knex.raw(sql, {1: obj.prefijo, 2: obj.numero, 3: obj.empresa_id})
            .then(function (resultado) {
                callback(false, resultado.rows);
            })
            .catch(function (error) {
                console.log("error [validarExistenciaDocumento] ", error);
                callback(error);
            }).done();
};

module.exports = ValidacionDespachosModel;