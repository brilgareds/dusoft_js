/* global G */

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
        "a.cantidad_neveras"
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
                        .leftJoin("aprobacion_despacho_planillas_d as d", "d.id_aprobacion_planillas", "a.id_aprobacion_planillas");
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
        insert({"id_aprobacion": obj.id_aprobacion, "path": obj.path})
            .then(function (resultado) {
                callback(false, resultado);
            })
            .catch(function (err) {
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

        return  G.Q.ninvoke(contexto, 'modificarEstadoPedido', documento, transaccion);

    }).then(function (resultado) {

        setTimeout(function () {

            __registrarDetalleAprobacion(contexto, index, idPlanilla, documentos, transaccion, callback);

        }, 0);
    }).catch(function (err) {
        callback(err);
    }).done();

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

/**
 * @author German Galvis
 * +Descripcion Metodo encargado de actualizar el estado del pedido
 * @fecha 2019-04-23 YYYY-MM-DD
 * @returns {callback}
 */
ValidacionDespachosModel.prototype.modificarEstadoPedido = function (documento, transaccion, callback) {

    var query = '';
    var estado = 3;

    if (documento.estadoPedido === '8') {
        estado = 9;
    }

    if (documento.tipo === '0') {



        query = G.knex('solicitud_productos_a_bodega_principal')
                .where('solicitud_prod_a_bod_ppal_id', documento.numeroPedido)
                .update({
                    estado: estado
                });
    } else if (documento.tipo === '1') {
        query = G.knex('ventas_ordenes_pedidos')
                .where('empresa_id', documento.empresaId)
                .andWhere('pedido_cliente_id', documento.numeroPedido)
                .update({
                    estado_pedido: estado
                });
    } else {
        callback(false, true);
    }

    if (transaccion)
        query.transacting(transaccion);
    query.then(function (resultado) {
        callback(false, resultado);
    }).catch(function (err) {
        callback(err);
    }).done();
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

    var sql = "SELECT '2' as tipo, a.numero, a.prefijo, b.observacion, b.empresa_id,a.cantidad_cajas,a.cantidad_neveras FROM aprobacion_despacho_planillas_d as a\
               inner join aprobacion_despacho_planillas as b on a.id_aprobacion_planillas = b.id_aprobacion_planillas \
               WHERE a.prefijo = :1\
               AND a.numero NOT IN( SELECT numero FROM inv_planillas_detalle_empresas WHERE prefijo = :1)\
               ORDER BY numero";

    var query = G.knex.raw(sql, {1: obj.prefijo});
    query.then(function (resultado) {
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

ValidacionDespachosModel.prototype.modificarRegistroEntradaBodega = function (obj, callback) {

    var query = G.knex("inv_registro_entrada_bodega").
            where('registro_entrada_bodega_id', obj.registro_entrada_bodega_id).
            update(
                    {
                        "prefijo_id": obj.prefijo,
                        "numero": obj.numero,
                        "numero_guia": obj.numeroGuia,
                        "tipo_id_tercero": obj.tipoIdtercero,
                        "tercero_id": obj.terceroId,
                        "cantidad_caja": obj.cantidadCaja,
                        "cantidad_nevera": obj.cantidadNevera,
                        "cantidad_bolsa": obj.cantidadBolsa,
                        "transportadora_id ": obj.transportadoraId,
                        "observacion": obj.observacion,
                        "operario_id": obj.operario_id
                    });

    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
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
               AND b.numero = :2 AND a.empresa_id = :3";

    G.knex.raw(sql, {1: obj.prefijo, 2: obj.numero, 3: obj.empresa_id})
            .then(function (resultado) {
                callback(false, resultado.rows);
            })
            .catch(function (error) {
                console.log("error [validarExistenciaDocumento] ", error);
                callback(error);
            }).done();
};
ValidacionDespachosModel.prototype.modificarRegistroEntradaBodega = function (obj, callback) {

    var query = G.knex("inv_registro_entrada_bodega").
            where('registro_entrada_bodega_id', obj.registro_entrada_bodega_id).
            update(
                    {
                        "prefijo_id": obj.prefijo,
                        "numero": obj.numero,
                        "numero_guia": obj.numeroGuia,
                        "tipo_id_tercero": obj.tipoIdtercero,
                        "tercero_id": obj.terceroId,
                        "cantidad_caja": obj.cantidadCaja,
                        "cantidad_nevera": obj.cantidadNevera,
                        "cantidad_bolsa": obj.cantidadBolsa,
                        "transportadora_id ": obj.transportadoraId,
                        "observacion": obj.observacion,
                        "operario_id": obj.operario_id
                    });
    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
};

ValidacionDespachosModel.prototype.modificarRegistroSalidaBodega = function (obj, callback) {

    var query = G.knex("inv_registro_salida_bodega").
            where('registro_salida_bodega_id', obj.registro_salida_bodega_id).
            update(
                    {
                        "prefijo_id": obj.prefijo,
                        "numero": obj.numero,
                        "numero_guia": obj.numeroGuia,
                        "tipo_id_tercero": obj.tipoIdtercero,
                        "tercero_id": obj.terceroId,
                        "cantidad_caja": obj.cantidadCaja,
                        "cantidad_nevera": obj.cantidadNevera,
                        "cantidad_bolsa": obj.cantidadBolsa,
                        "tipo_pais_id": obj.tipoPaisId,
                        "tipo_dpto_id": obj.tipoDptoid,
                        "tipo_mpio_id": obj.tipoMpioId,
                        "placa": obj.placa,
                        "conductor": obj.conductor,
                        "ayudante": obj.ayudante,
                        "usuario_id": obj.usuarioId,
                        "fecha_envio": obj.fechaEnvio,
                        "fecha_registro": 'now()',
                        "observacion": obj.observacion,
                        "operario_id": obj.operarioId
                    });
    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
};

ValidacionDespachosModel.prototype.registroSalida = function (obj, callback) {

    var query = G.knex("inv_registro_salida_bodega").
            insert(
                    {
                        "prefijo_id": obj.prefijo,
                        "numero": obj.numero,
                        "numero_guia": obj.numeroGuia,
                        "tipo_id_tercero": obj.tipoIdtercero,
                        "tercero_id": obj.terceroId,
                        "cantidad_caja": obj.cantidadCaja,
                        "cantidad_nevera": obj.cantidadNevera,
                        "cantidad_bolsa": obj.cantidadBolsa,
                        "tipo_pais_id": obj.tipoPaisId,
                        "tipo_dpto_id": obj.tipoDptoid,
                        "tipo_mpio_id": obj.tipoMpioId,
                        "placa": obj.placa,
                        "conductor": obj.conductor,
                        "ayudante": obj.ayudante,
                        "usuario_id": obj.usuarioId,
                        "fecha_envio": obj.fechaEnvio,
                        "fecha_registro": 'now()',
                        "observacion": obj.observacion,
                        "operario_id": obj.operarioId
                    });

    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
};

ValidacionDespachosModel.prototype.listarRegistroSalida = function (obj, callback) {

    var column = ["a.prefijo_id",
        "a.numero",
        "a.numero_guia",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.tipo_pais_id",
        "a.tipo_dpto_id",
        "a.tipo_mpio_id",
        "a.cantidad_caja",
        "a.cantidad_nevera",
        "a.cantidad_bolsa",
        "a.placa",
        "a.conductor",
        "a.ayudante",
        G.knex.raw("to_char(a.fecha_envio,'YYYY-MM-DD HH24:MI:SS') as fecha_envio"),
        "f.municipio",
        "a.usuario_id",
        "a.observacion",
        "d.nombre as nombre_usuario",
        "b.nombre_tercero",
        "a.registro_salida_bodega_id",
        "a.operario_id",
        "e.nombre as nombre_operario",
        "g.nombre as nombre_ayudante",
        "h.nombre as nombre_conductor",
        "a.fecha_registro"];

    var query = G.knex.column(column)
            .select()
            .from('inv_registro_salida_bodega as a')
            .innerJoin('terceros as b', function () {
                this.on("b.tipo_id_tercero", "a.tipo_id_tercero")
                        .on("b.tercero_id", "a.tercero_id");
            })
            .innerJoin('system_usuarios as d', function () {
                this.on("d.usuario_id", "a.usuario_id");
            })
            .innerJoin('operarios_bodega as g', function () {
                this.on("g.operario_id", "a.ayudante");
            })
            .innerJoin('operarios_bodega as h', function () {
                this.on("h.operario_id", "a.conductor");
            })
            .innerJoin('operarios_bodega as e', function () {
                this.on("e.operario_id", "a.operario_id");
            })
            .innerJoin('tipo_mpios as f', function () {
                this.on("f.tipo_pais_id", "a.tipo_pais_id")
                        .on("f.tipo_dpto_id", "a.tipo_dpto_id")
                        .on("f.tipo_mpio_id", "a.tipo_mpio_id");
            })
            .where(function () {
                if (obj.busqueda !== undefined && obj.busqueda.trim() !== "") {
                    this.orWhere("numero_guia", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("numero", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("d.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("e.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("f.municipio", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("a.placa", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("g.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("h.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("a.fecha_envio", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("b.nombre_tercero", 'ilike', '%' + obj.busqueda + '%');
                }
            }).orderBy("a.fecha_registro", "desc")
            .limit(G.settings.limit).
            offset((obj.pagina - 1) * G.settings.limit);

    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
};


ValidacionDespachosModel.prototype.registroEntrada = function (obj, callback) {

    var query = G.knex("inv_registro_entrada_bodega").
            insert(
                    {
                        "prefijo_id": obj.prefijo,
                        "numero": obj.numero,
                        "numero_guia": obj.numeroGuia,
                        "tipo_id_tercero": obj.tipoIdtercero,
                        "tercero_id": obj.terceroId,
                        "cantidad_caja": obj.cantidadCaja,
                        "cantidad_nevera": obj.cantidadNevera,
                        "cantidad_bolsa": obj.cantidadBolsa,
                        "transportadora_id ": obj.transportadoraId,
                        "usuario_id": obj.usuarioId,
                        "fecha_registro": 'now()',
                        "observacion": obj.observacion,
                        "operario_id": obj.operario_id
                    });

    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });
};

ValidacionDespachosModel.prototype.listarRegistroEntrada = function (obj, callback) {

    var column = ["a.prefijo_id",
        "a.numero",
        "a.numero_guia",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "a.cantidad_caja",
        "a.cantidad_nevera",
        "a.cantidad_bolsa",
        "a.transportadora_id",
        "a.usuario_id",
        "a.observacion",
        "c.descripcion as nombre_transportadora",
        "d.nombre as nombre_usuario",
        "b.nombre_tercero",
        "a.registro_entrada_bodega_id",
        "a.operario_id",
        "e.nombre as nombre_operario",
        "a.fecha_registro"];

    var query = G.knex.column(column)

            .select()
            .from('inv_registro_entrada_bodega as a')
            .innerJoin('terceros as b', function () {
                this.on("b.tipo_id_tercero", "a.tipo_id_tercero")
                        .on("b.tercero_id", "a.tercero_id");
            })
            .leftJoin('inv_transportadoras as c', function () {
                this.on("c.transportadora_id", "a.transportadora_id");
            })
            .innerJoin('system_usuarios as d', function () {
                this.on("d.usuario_id", "a.usuario_id");
            })
            .innerJoin('operarios_bodega as e', function () {
                this.on("e.operario_id", "a.operario_id");
            })
            .where(function () {
                if (obj.busqueda !== undefined && obj.busqueda.trim() !== "") {
                    this.orWhere("numero_guia", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("numero", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("d.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("c.descripcion", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("e.nombre", 'ilike', '%' + obj.busqueda + '%');
                    this.orWhere("b.nombre_tercero", 'ilike', '%' + obj.busqueda + '%');
                }
            }).orderBy("a.fecha_registro", "desc").limit(G.settings.limit).
            offset((obj.pagina - 1) * G.settings.limit);
    query.then(function (resultado) {

        callback(false, resultado);

    }).catch(function (err) {
        console.log("error sql registroEntrada", err);
        callback(err);
    });

};
module.exports = ValidacionDespachosModel;
