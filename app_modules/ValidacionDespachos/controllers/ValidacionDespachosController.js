
var ValidacionDespachos = function (induccion, m_pedidos_farmacias, m_pedidos_clientes, e_pedidos_farmacias, e_pedidos_clientes, m_terceros) {

    this.m_ValidacionDespachos = induccion;
    this.m_pedidos_farmacias = m_pedidos_farmacias;
    this.m_pedidos_clientes = m_pedidos_clientes;
    this.e_pedidos_farmacias = e_pedidos_farmacias;
    this.e_pedidos_clientes = e_pedidos_clientes;
    this.m_terceros = m_terceros;

};



/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */
ValidacionDespachos.prototype.listarDespachosAprobados = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.empresa_id === undefined) {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined) {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido ', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'El numero no esta definido', 404, {}));
        return;
    }

    var empresa_id = args.validacionDespachos.empresa_id;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var fechaInicial = args.validacionDespachos.fechaInicial;
    var fechaFinal = args.validacionDespachos.fechaFinal;
    var paginaActual = args.validacionDespachos.paginaActual;
    var registroUnico = args.validacionDespachos.registroUnico;

    var obj = {fechaInicial: fechaInicial,
        fechaFinal: fechaFinal,
        prefijo: (prefijo !== 0 ? prefijo.toUpperCase() : prefijo),
        numero: numero,
        empresa_id: empresa_id,
        paginaActual: paginaActual,
        registroUnico: registroUnico,
        idPlantilla: args.validacionDespachos.idPlantilla
    };
    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDespachosAprobados', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Lista de despachos aprobados por seguridad', 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error consultado los de despachos', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de listar las imagenes de una aprobacion
 * aprobados
 */
ValidacionDespachos.prototype.listarImagenes = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.id_aprobacion === undefined) {
        res.send(G.utils.r(req.url, 'El id de la aprobacion no esta definido ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarImagenes', {id_aprobacion: aprobacion}).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Listado de imagenes', 200, {imagenes: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();

};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo encargado de invocar el modelo para listar los despachos
 * aprobados
 */

ValidacionDespachos.prototype.adjuntarImagen = function (req, res) {

    var that = this;

    var args = req.body.data;
    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id_aprobacion || !args.validacionDespachos.prefijo || !args.validacionDespachos.numero) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var aprobacion = args.validacionDespachos.id_aprobacion;
    var prefijo = args.validacionDespachos.prefijo;
    var numero = args.validacionDespachos.numero;
    var file = req.files.file;
    var rutaTmp = file.path;
    var rutaNueva = G.dirname + G.settings.carpeta_aprobacion_despachos + prefijo + "-" + numero + "/" + prefijo + "-" + numero + "/" + file.name;
    var rutaFile = G.dirname + G.settings.carpeta_aprobacion_despachos + prefijo + "-" + numero;

    if (G.fs.existsSync(rutaTmp)) {
        G.Q.nfcall(G.fs.copy, rutaTmp, rutaNueva).then(function () {
            return  G.Q.nfcall(G.fs.unlink, rutaTmp);
        }).then(function () {

            var obj = {
                id_aprobacion: aprobacion,
                path: prefijo + "-" + numero + "/" + file.name
            };
            return G.Q.ninvoke(that.m_ValidacionDespachos, 'agregarImagen', obj)

        }).then(function () {

            return G.Q.nfcall(__scp, rutaFile);

        }).then(function (respuesta) {
            if (respuesta) {
                G.fs.unlinkSync(rutaNueva);
            }
            res.send(G.utils.r(req.url, 'Imagen guardada', 200, {validacionDespachos: {}}));

        }).fail(function (err) {
            console.log("Error", err);
            G.fs.unlinkSync(rutaNueva);
            res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
        }).done();
    } else {
        console.log("Error ---");
        res.send(G.utils.r(req.url, 'Error guardando la imagen', 500, {validacionDespachos: {}}));
    }
};

/**
 * @author Eduar Garcia
 * @fecha  26/12/2016
 * +Descripcion Metodo para eliminar una imagen de la aprobacion
 */
ValidacionDespachos.prototype.eliminarImagen = function (req, res) {

    var that = this;
    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (!args.validacionDespachos.id || !args.validacionDespachos.path) {
        res.send(G.utils.r(req.url, 'Algunos campos obligatorios estan vacios ', 404, {}));
        return;
    }

    var id = args.validacionDespachos.id;
    var path = args.validacionDespachos.path;
    var arrayPath = path.split('/');
    var resultado = "";
    G.Q.ninvoke(that.m_ValidacionDespachos, 'eliminarImagen', {id: id}).then(function (resultados) {
        resultado = resultados;

        return G.Q.nfcall(__borrarArchivoSSH, G.settings.imagePath + path);

    }).then(function (respuesta) {

        return res.send(G.utils.r(req.url, 'Eliminacion exitosa', 200, {imagenes: resultado}));

    }).fail(function (err) {
        console.log("error generado ", err);
        res.send(G.utils.r(req.url, 'Error al eliminar la imagen', 500, {validacionDespachos: {}}));

    }).done();
};

function __scp(file, callback) {
    var resp = false;
    G.scp.scp(file, {
        host: G.settings.imageHost,
        username: G.settings.imageUser,
        password: G.settings.imagePass,
        path: G.settings.imagePath
    }, function (err) {
        if (err === undefined) {
            resp = true;
        }
        callback(false, resp);

    });
}

function __borrarArchivoSSH(file, callback) {
    var resp = false;
    var host = G.settings.imageUser + "@" + G.settings.imageHost;
    var seq = G.sequest.connect(host, {username: G.settings.imageUser, password: G.settings.imagePass})
    seq('rm ' + file, function (err, stdout) {
        if (err === undefined) {
            resp = true;
        }
        seq.end() // will keep process open if you don't end it
    })
    callback(false, resp);
}

/*
 * funcion para consultar empresas
 * @param {type} req
 * @param {type} res
 * @returns {datos de consulta}
 */
ValidacionDespachos.prototype.listarEmpresas = function (req, res) {

    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
    if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_ValidacionDespachos.listarEmpresas(empresa, function (err, empresas) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};


/**
 * @author Cristian Ardila
 * @fecha  04/02/2016
 * +Descripcion: Controlador encargado de invocar el modelo que registrara la 
 *               aprobacion del personal de seguridad sobre un despacho
 * @returns {unresolved}
 */
ValidacionDespachos.prototype.registrarAprobacion = function (req, res) {
    var that = this;
    var args = req.body.data;
    var totalCajas = 0;
    var totalNeveras = 0;
    var totalBolsas = 0;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.empresaId === undefined || args.validacionDespachos.empresaId === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definido o esta vacio', 404, {}));
        return;
    }

    args.validacionDespachos.usuarioId = req.session.user.usuario_id;
    args.validacionDespachos.detalle.forEach(function (row) {
        totalCajas += parseInt(row.cantidadCajas);
        totalNeveras += parseInt(row.cantidadNeveras);
        totalBolsas += parseInt(row.cantidadBolsas);
    });

    args.validacionDespachos.cantidadTotalCajas = totalCajas;
    args.validacionDespachos.cantidadTotalNeveras = totalNeveras;
    args.validacionDespachos.cantidadTotalBolsas = totalBolsas;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'transaccionRegistrarAprobacion', args.validacionDespachos).then(function (resultado) {
        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {validacionDespachos: {}}));

    }).done();
};


ValidacionDespachos.prototype.listarDocumentosOtrasSalidas = function (req, res) {
    var that = this;
    var args = req.body.data;

    var obj = {
        termino_busqueda: args.validacionDespachos.termino_busqueda || ""
    };


    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarDocumentosOtrasSalidas', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {documentos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {documentos: {}}));

    }).done();
};

ValidacionDespachos.prototype.listarNumeroPrefijoOtrasSalidas = function (req, res) {
    var that = this;
    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El Prefijo no esta definido o esta vacio', 404, {}));
        return;
    }


    var prefijo = args.validacionDespachos.prefijo.toUpperCase();
    var termino_busqueda = args.validacionDespachos.termino_busqueda;

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarNumeroPrefijoOtrasSalidas', {prefijo: prefijo, termino_busqueda: termino_busqueda}).then(function (resultado) {

        return res.send(G.utils.r(req.url, 'Aprobacion con registro exitoso', 200, {planillas_despachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en el registro', 500, {planillas_despachos: {}}));

    }).done();
};



/**
 * @author Cristian Ardila 
 * @fecha  10/02/2016
 * +Descripcion Controlador que se encarga de ejecutar el modelo para validar la existencia
 *              de un documento
 * @returns {unresolved} */
ValidacionDespachos.prototype.validarExistenciaDocumento = function (req, res) {

    var that = this;

    var args = req.body.data;

    if (args.validacionDespachos === undefined) {
        res.send(G.utils.r(req.url, 'Variable (validacionDespachos) no esta definida', 404, {}));
        return;
    }


    if (args.validacionDespachos.empresa_id === undefined || args.validacionDespachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa no esta definida o esta vacia', 404, {}));
        return;
    }

    if (args.validacionDespachos.prefijo === undefined || args.validacionDespachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'El prefijo no esta definido o esta vacio', 404, {}));
        return;
    }

    if (args.validacionDespachos.numero === undefined || args.validacionDespachos.numero === '') {
        res.send(G.utils.r(req.url, 'El numero no esta definido o esta vacio', 404, {}));
        return;
    }

    var obj = {
        empresa_id: args.validacionDespachos.empresa_id,
        prefijo: args.validacionDespachos.prefijo.toUpperCase(),
        documentos: args.validacionDespachos.numero
    };

    var status = {};

    G.Q.ninvoke(that.m_ValidacionDespachos, 'validarExistenciaMultiplesDocumentos', obj).then(function (resultado) {

        return res.send(G.utils.r(req.url, status.mensaje, 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.prototype.registroEntradaBodega = function (req, res) {

    var that = this;

    var args = req.body.data.obj;

    var obj = {
        "prefijo": args.prefijo,
        "numero": args.numero,
        "numeroGuia": args.numeroGuia,
        "cantidadCaja": args.tipoEmpaque.cantidadCaja,
        "cantidadNevera": args.tipoEmpaque.cantidadNevera,
        "cantidadBolsa": args.tipoEmpaque.cantidadBolsa,
        "tipoIdtercero": args.tipoIdtercero,
        "terceroId": args.terceroId,
        "transportadoraId": args.transportadoraId,
        "usuarioId": req.session.user.usuario_id,
        "observacion": args.observacion,
        "operario_id": args.operario_id,
        that: that
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'registroEntrada', obj).then(function (resultado) {

        res.send(G.utils.r(req.url, "ingreso Correcto", 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.prototype.modificarRegistroEntradaBodega = function (req, res) {

    var that = this;

    var args = req.body.data.obj;

    var obj = {
        "prefijo": args.prefijo,
        "numero": args.numero,
        "numeroGuia": args.numeroGuia,
        "cantidadCaja": args.tipoEmpaque.cantidadCaja,
        "cantidadNevera": args.tipoEmpaque.cantidadNevera,
        "cantidadBolsa": args.tipoEmpaque.cantidadBolsa,
        "tipoIdtercero": args.tipoIdtercero,
        "terceroId": args.terceroId,
        "transportadoraId": args.transportadoraId,
        "usuarioId": req.session.user.usuario_id,
        "observacion": args.observacion,
        "operario_id": args.operario_id,
        "registro_entrada_bodega_id": args.registro_entrada_bodega_id,
        that: that
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'modificarRegistroEntradaBodega', obj).then(function (resultado) {

        res.send(G.utils.r(req.url, "modificacion Correcta", 200, {validacionDespachos: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.prototype.listarRegistroEntrada = function (req, res) {

    var that = this;
    var args = req.body.data.obj;
    var obj = {
        "busqueda": args.busqueda,
        "pagina": args.pagina
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarRegistroEntrada', obj).then(function (resultado) {

        res.send(G.utils.r(req.url, "listar Registro Entrada", 200, {listarRegistroEntrada: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.prototype.listarRegistroSalida = function (req, res) {

    var that = this;
    var args = req.body.data.obj;
    var obj = {
        "busqueda": args.busqueda,
        "pagina": args.pagina
    };

    G.Q.ninvoke(that.m_ValidacionDespachos, 'listarRegistroSalida', obj).then(function (resultado) {

        res.send(G.utils.r(req.url, "listar Registro Salida", 200, {listarRegistroSalida: resultado}));

    }).fail(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.prototype.registroSalidaBodega = function (req, res) {

    var that = this;

    var args = req.body.data.obj;
    var registro_salida_bodega_id = "";
    if (args.numeroGuia === "") {
        args.numeroGuia = '100';
    }
    var obj = {
        "prefijo": args.prefijo,
        "numero": args.numero,
        "numeroGuia": args.numeroGuia,
        "cantidadCaja": args.tipoEmpaque.cantidadCaja,
        "cantidadNevera": args.tipoEmpaque.cantidadNevera,
        "cantidadBolsa": args.tipoEmpaque.cantidadBolsa,
        "tipoIdtercero": args.tipoIdtercero,
        "terceroId": args.terceroId,
        "conductor": args.conductor,
        "ayudante": args.ayudante,
        "placa": args.placa,
        "fechaEnvio": args.fechaEnvio,
        "tipoPaisId": args.ciudad.pais_id,
        "tipoDptoid": args.ciudad.departamento_id,
        "tipoMpioId": args.ciudad.id,
        "usuarioId": req.session.user.usuario_id,
        "observacion": args.observacion,
        "operarioId": args.operarioId,
        "listaAgrupados": args.documentos,
        that: that
    };

    G.knex.transaction(function (transaccion) {

        obj.transaccion = transaccion;

        G.Q.ninvoke(that.m_ValidacionDespachos, 'listarOneSalidaDetalle', obj).then(function (resultado) {

            if (resultado.length === 0 || obj.numeroGuia.trim() === "") {

                return G.Q.ninvoke(that.m_ValidacionDespachos, 'registroSalida', obj);

            } else {

                throw {msj: 'La Guia ya se encuentra registrada'};

            }

        }).then(function (respuesta) {
            registro_salida_bodega_id = respuesta;
            return G.Q.ninvoke(that.m_terceros, 'seleccionar_operario_por_usuario_id', req.session.user.usuario_id);

        }).then(function (respuesta) {

            if (args.documentos.length > 0) {
                obj.operario = respuesta[0].operario_id;
                obj.registro_salida_bodega_id = registro_salida_bodega_id;
                return G.Q.nfcall(__registroSalidaDetalle, obj, 0);

            } else {

                return true;

            }

        }).then(function (respuesta) {

            transaccion.commit();

        }).fail(function (err) {

            transaccion.rollback(err);

        }).done();

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, "ingreso Correcto", 200, {validacionDespachos: resultado}));

    }).catch(function (err) {
        console.log("err ", err);
        var mensaje = 'Error en el registro';

        if (err.msj !== undefined) {
            mensaje = err.msj;
        }

        res.send(G.utils.r(req.url, mensaje, 404, {validacionDespachos: {err: err}}));

    }).done();
};

function __registroSalidaDetalle(obj, index, callback) {

    var detalle = obj.listaAgrupados[index];

    if (!detalle) {
        callback(false);
        return;
    }

    detalle.transaccion = obj.transaccion;

    detalle.registro_salida_bodega_id = obj.registro_salida_bodega_id;

    G.Q.ninvoke(obj.that.m_ValidacionDespachos, 'registroSalidaDetalle', detalle).then(function (resultado) {

        if (detalle.tipo === '0') {//0-farmacia 1-cliente 2-empresa

            return G.Q.ninvoke(obj.that.m_pedidos_farmacias, 'consultarEstadoActualPedidoFarmacia', detalle);
        } else if (detalle.tipo === '1') {

            return G.Q.ninvoke(obj.that.m_pedidos_clientes, 'consultarEstadoActualPedidoCliente', detalle);
        } else {

            return true;
        }

    }).then(function (resultado) {
        if (detalle.tipo === '0') {//0-farmacia 1-cliente 2-empresa

            if (resultado[0].estado === '3') {

                detalle.sw_estado = 4;
            } else if (resultado[0].estado === '9') {

                detalle.sw_estado = 5;
            } else {

                return true;
            }
            detalle.sw_despacho = 1;

            return G.Q.ninvoke(obj.that.m_pedidos_farmacias, 'actualizarEstadoActualPedidoFarmacia', detalle);

        } else if (detalle.tipo === '1') {
            if (resultado[0].estado_pedido === '3') {
                detalle.sw_estado = 4;
                detalle.estado_pedido = 4;
            } else if (resultado[0].estado_pedido === '9') {
                detalle.sw_estado = 5;
                detalle.estado_pedido = 5;
            } else {
                throw {status: 403, msj: "El Documento " + detalle.prefijo + "-" + detalle.numero + " se encuentra en estado : " + resultado[0].estado_pedido};
                return true;
            }
            detalle.estadoEntrega = 3;
//            console.log("entro cliente");
            return G.Q.ninvoke(obj.that.m_pedidos_clientes, 'actualizarEstadoActualPedidoCliente', detalle);
        } else {
            return true;
        }
    }).then(function (resultado) {//registro en la tablas de estados

        detalle.usuario = obj.usuarioId;

        if (detalle.tipo === '0') {//0-farmacia 1-cliente 2-empresa

            obj.that.e_pedidos_farmacias.onNotificarPedidosActualizados({numero_pedido: detalle.numero_pedido});
            return G.Q.ninvoke(obj.that.m_pedidos_farmacias, 'insertarResponsablesPedidos', {numero_pedido: detalle.numero_pedido, estado: detalle.sw_estado, usuario: detalle.usuario, responsable: obj.operario, transaccion: detalle.transaccion, sw_terminado: '1'});

        } else if (detalle.tipo === '1') {
//            console.log("entro cliente estado"); 
            obj.that.e_pedidos_clientes.onNotificarPedidosActualizados({numero_pedido: detalle.numero_pedido});
            return G.Q.ninvoke(obj.that.m_pedidos_clientes, 'insertarResponsablesPedidos', {numero_pedido: detalle.numero_pedido, estado_pedido: detalle.estado_pedido, responsable: obj.operario, usuario: detalle.usuario, transaccion: detalle.transaccion, sw_terminado: '1'});

        } else {
            return true;
        }

    }).then(function (resultado) {

        index++;
        __registroSalidaDetalle(obj, index, callback);

    }).fail(function (err) {

        callback(err);

    }).done();

}

ValidacionDespachos.prototype.modificarRegistroSalidaBodega = function (req, res) {
    var that = this;
    var args = req.body.data.obj;
    var obj = {
        "prefijo": args.prefijo,
        "numero": args.numero,
        "numeroGuia": args.numeroGuia,
        "cantidadCaja": args.tipoEmpaque.cantidadCaja,
        "cantidadNevera": args.tipoEmpaque.cantidadNevera,
        "cantidadBolsa": args.tipoEmpaque.cantidadBolsa,
        "tipoIdtercero": args.tipoIdtercero,
        "terceroId": args.terceroId,
        "conductor": args.conductor,
        "ayudante": args.ayudante,
        "placa": args.placa,
        "fechaEnvio": args.fechaEnvio,
        "tipoPaisId": args.ciudad.pais_id,
        "tipoDptoid": args.ciudad.departamento_id,
        "tipoMpioId": args.ciudad.id,
        "usuarioId": req.session.user.usuario_id,
        "observacion": args.observacion,
        "operarioId": args.operarioId,
        "registro_salida_bodega_id": args.registro_salida_bodega_id,
        "listaAgrupados": args.documentos,
        that: that
    };

    G.knex.transaction(function (transaccion) {

        obj.transaccion = transaccion;

        G.Q.ninvoke(that.m_ValidacionDespachos, 'modificarRegistroSalidaBodega', obj).then(function (resultado) {

            return G.Q.ninvoke(that.m_ValidacionDespachos, 'deleteSalidaDetalle', obj);

        }).then(function (resultado) {

            return G.Q.nfcall(__registroSalidaDetalle, obj, 0);

        }).then(function (respuesta) {

            transaccion.commit();

        }).fail(function (err) {

            transaccion.rollback(err);

        }).done();

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, "modificacion Correcta", 200, {validacionDespachos: resultado}));

    }).catch(function (err) {

        res.send(G.utils.r(req.url, 'Error en la consulta', 404, {validacionDespachos: {err: err}}));

    }).done();
};

ValidacionDespachos.$inject = ["m_ValidacionDespachos", "m_pedidos_farmacias", "m_pedidos_clientes", "e_pedidos_farmacias", "e_pedidos_clientes", "m_terceros"];

module.exports = ValidacionDespachos;