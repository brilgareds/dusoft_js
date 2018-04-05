
/* global G, $scope */

var Radicacion = function (radicacion, m_usuarios) {
    this.m_radicacion = radicacion;
    this.m_usuarios = m_usuarios;
};

Radicacion.prototype.listarConcepto = function (req, res) {

    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_radicacion, "listarConcepto").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de concepto ok!!!!', 200, {listarConcepto: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar concepto', 500, {listarConcepto: {}}));
            }).
            done();

};


Radicacion.prototype.subirArchivo = function (req, res) {

    var that = this;
    var args = req.body.data;

if (args.data.ruta.name !== ""){
    req.files.file.customPath = G.settings.carpetaFactura + "Sistemas/";
    console.log("ruta",G.settings.carpetaFactura + "Sistemas/");

    G.Q.ninvoke(G.utils, "subirArchivo", req.files, true).then(function (resultado) {

        res.send(G.utils.r(req.url, 'Archivo cargado correctamente', 200, {data: resultado}));

    }).fail(function (err) {
        console.log('el subirArchivo', err);
        console.log("se ha generado un error subirArchivo ", err);
        res.send(G.utils.r(req.url, err, 500, {ordenes_compras: []}));
    });
    }else{
       res.send(G.utils.r(req.url, 'No hay archivo para subir', 200, {data: ""})); 
    }
};


Radicacion.prototype.listarFactura = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_radicacion, "listarFactura").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de factura ok!!!!', 200, {listarFactura: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar factura', 500, {listarFactura: {}}));
            }).
            done();

};
Radicacion.prototype.listarAgrupar = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args;

    G.Q.ninvoke(that.m_radicacion, "listarAgrupar", parametros).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de agrupar ok!!!!', 200, {listarAgrupar: resultado}));
            }).
            fail(function (err) {
                console.log("error", err);
                res.send(G.utils.r(req.url, 'Error al listar ', 500, {listarAgrupar: {}}));
            }).
            done();

};

Radicacion.prototype.eliminarGrupoFactura = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args;
    console.log(parametros);
    G.Q.ninvoke(that.m_radicacion, "eliminarGrupoFactura", parametros).then(function (resultado) {

        return G.Q.ninvoke(that.m_radicacion, "modificarEntregado", {sw_entregado: 0, factura_id: parametros.factura_id});

    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'se elimino correctamente ok!!!!', 200, {eliminarGrupoFactura: resultado}));
    }).
            fail(function (err) {
                console.log("error", err);
                res.send(G.utils.r(req.url, 'Error al eliminar ', 500, {eliminarGrupoFactura: {}}));
            }).
            done();

};

Radicacion.prototype.guardarConcepto = function (req, res) {

    var that = this;
    var args = req.body.data;


    if (args.nombre === undefined || args.nombre === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el nombre del concepto', 404, {}));
        return;
    }

    var obj = {nombre: args.nombre};

    G.Q.ninvoke(that.m_radicacion, "guardarConcepto", obj).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'guardar concepto ok!!!!', 200, {guardarConcepto: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al guardar concepto', 500, {guardarConcepto: {error: err}}));
            }).
            done();
}
/*
 * radicacion de factura
 */
Radicacion.prototype.guardarFactura = function (req, res) {

    var that = this;
    var args = req.body.data;
    console.log("-------------------------------------------------");
    console.log("guardarFactura args", args);
    console.log("--------------------------------------------------");

    if (args.numeroFactura === undefined || args.numeroFactura === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el numero de la factura', 404, {}));
        return;
    }

    if (args.conceptoRadicacionId === undefined || args.conceptoRadicacionId === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar el proveedor', 404, {}));
        return;
    }

    if (args.swEntregado === undefined || args.swEntregado === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar si fue entregado o no', 404, {}));
        return;
    }

    if (args.municipio === undefined || args.municipio === "") {
        res.send(G.utils.r(req.url, 'Debe selecccionar la ciudad', 404, {}));
        return;
    }

    if (args.precio === undefined || args.precio === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el precio', 404, {}));
        return;
    }


//    if (args.fechaVencimiento === undefined || args.fechaVencimiento === "") {
//        res.send(G.utils.r(req.url, 'Debe digitar la fecha de vencimiento', 404, {}));
//        return;
//    }
    if (args.descripcion === undefined || args.descripcion === "") {
        console.log("argss", args);
        res.send(G.utils.r(req.url, 'Debe digitar la descripcion', 404, {}));
        return;
    }
    
    var d = new Date(args.fechaVencimiento);
    var tipo_pais_id = args.tipo_pais_id;
    var tipo_dpto_id = args.tipo_dpto_id;
    var obj = {
        numeroFactura: args.numeroFactura,
        concepto_radicacion_id: args.conceptoRadicacionId,
        sw_entregado: args.swEntregado,
        nombre_ciudad: args.municipio,
        tipo_pais_id: tipo_pais_id,
        tipo_mpio_id: args.tipo_mpio_id,
        tipo_dpto_id: tipo_dpto_id,
        precio: args.precio,
        ruta: args.ruta,
        fechaVencimiento: d,
        usuario_id: req.session.user.usuario_id,
        concepto: args.descripcion,
        ruta : args.ruta
    };
    console.log("argssssssss", args);

    G.Q.ninvoke(that.m_radicacion, "factura", obj).then(function (resultado) {
        res.send(G.utils.r(req.url, 'factura ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error de factura', 500, {factura: {error: err}}));
    }).done();
};


Radicacion.prototype.modificarFactura = function (req, res) {
    var that = this;
    var args = req.body.data;

console.log("args..............",args);
    if (args.factura_id === undefined || args.factura_id === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar la factura id', 404, {}));
        return;
    }

    if (args.numeroFactura === undefined || args.numeroFactura === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el numero de la factura', 404, {}));
        return;
    }

    if (args.conceptoSeleccionado === undefined || args.conceptoSeleccionado === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar el proveedor', 404, {}));
        return;
    }   
//    if (args.municipio === undefined || args.municipio === "") {
//        res.send(G.utils.r(req.url, 'Debe selecccionar la ciudad', 404, {}));
//        return;
//   }
    if (args.precio === undefined || args.precio === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el precio', 404, {}));
        return;
    }

    if (args.sw_entregado === undefined || args.sw_entregado === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar', 404, {}));
        return;
    }

    if (args.fecha_entrega === undefined || args.fecha_entrega === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar', 404, {}));
        return;
    }

console.log("argsaaa",args)
    G.Q.ninvoke(that.m_radicacion, "modificarFactura", args).then(function (resultado) {
        console.log("modificarFactura", resultado)
        res.send(G.utils.r(req.url, 'modificacion factura ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};

Radicacion.prototype.modificarEntregado = function (req, res) {
    var that = this;
    var args = req.body.data;



    if (args.factura_id === undefined || args.factura_id === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar la factura id', 404, {}));
        return;
    }

    if (args.sw_entregado === undefined || args.sw_entregado === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar entregado', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_radicacion, "modificarEntregado", args).then(function (resultado) {

        res.send(G.utils.r(req.url, 'modificacion factura entregada ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};
Radicacion.prototype.modificarNombreArchivo = function (req, res) {
    var that = this;
    var args = req.body.data;



    if (args.relacion_id === undefined || args.relacion_id === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar la relacion', 404, {}));
        return;
    }

    if (args.archivo === undefined || args.archivo === "") {
        res.send(G.utils.r(req.url, 'Debe seleccionar el archivo', 404, {}));
        return;
    }

    G.Q.ninvoke(that.m_radicacion, "modificarNombreArchivo", args).then(function (resultado) {

        res.send(G.utils.r(req.url, 'modificacion factura entregada ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};


Radicacion.prototype.insertAgruparFactura = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args.facturas;


    if (args.facturas.length < 0) {
        res.send(G.utils.r(req.url, 'Debe seleccionar las facturas', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_radicacion, "agruparFacturaSecuencia").then(function (resultado) {

        parametros.secuencia = resultado;
        parametros.usuario_id = req.session.user.usuario_id;

        return G.Q.nfcall(__guardarFacturaAgrupada, that, parametros, 0);

    }).then(function (resultado) {

        res.send(G.utils.r(req.url, 'agrupar factura ok!!!!', 200, {factura: resultado}));

    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al agrupar factura', 500, {factura: {error: err}}));
    }).done();

};

function __guardarFacturaAgrupada(that, parametros, index, callback) {

    var parametro = parametros[index];
    if (!parametro) {
        callback(false, index);
        return;
    }
    parametro.secuencia = parametros.secuencia;
    parametro.usuario_id = parametros.usuario_id;
    parametro.sw_entregado = '1';
    G.Q.ninvoke(that.m_radicacion, "insertAgruparFactura", parametro).then(function (resultado) {

        G.Q.nfcall(that.m_radicacion.modificarEntregado, parametro).then(function (result) {

            var timer = setTimeout(function () {
                clearTimeout(timer);
                index++;
                __guardarFacturaAgrupada(that, parametros, index, callback)
            }, 0);
        }).fail(function (err) {
            console.log("error", err);
            callback(err);

        }).done();


    }).fail(function (err) {
        console.log("error", err);
        callback(err);

    }).done();

}
;

Radicacion.prototype.listarFacturaEntregado = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_radicacion, "listarFacturaEntregado").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de factura ok!!!!', 200, {listarFacturaEntregado: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar factura', 500, {listarFacturaEntregado: {}}));
            }).
            done();

};
Radicacion.prototype.agregarFacturaEntregado = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        numeroRadicacion: args.numeroRadicacion,
        numeroFactura: args.numeroFactura,
        factura_id: args.numeroFactura,
        sw_entregado: '1',
        usuario_id: req.session.user.usuario_id
    };

    G.Q.ninvoke(that.m_radicacion, "agregarFacturaEntregado", parametros).
            then(function (resultado) {

                return G.Q.nfcall(that.m_radicacion.modificarEntregado, parametros);

            }).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Agregar factura ok!!!!', 200, {agregarFacturaEntregado: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al agregar factura', 500, {agregarFacturaEntregado: {}}));
            }).
            done();

};

Radicacion.prototype.planillaRadicacion = function (req, res) {
    var that = this;
    var fecha = new Date();

    var args = req.body.data;


    var parametros = {
        relacion_id: args.relacion_id

    };
    G.Q.ninvoke(that.m_radicacion, "modificarDescarga", parametros).
            then(function (result) {
                
                return G.Q.ninvoke(that.m_radicacion, "listarItemReporte", parametros);
                
            }).then(function (resultado) {
        while (resultado.length < 14) {
            resultado.push({});

        }

        console.log("relacion_id", parametros.relacion_id);
        var formatoFecha = fecha.toFormat('DD-MM-YYYY');
        parametros.nombre = 'ximena';
        parametros.apellido = "vivas";
        __generarPdf({serverUrl: req.protocol + '://' + req.get('host') + "/",
            parametros: parametros,
            nombre: 'planilla',
            listado: resultado,
            fecha: formatoFecha,
            archivoHtml: 'planilla.html',
            reporte: "planilla.html"}, function (nombre_pdf) {
            res.send(G.utils.r(req.url, 'SE HA CREADO EL DOCUMENTO EXITOSAMENTE', 200, {nomb_pdf: nombre_pdf}));
        });



//    G.Q.ninvoke(that.m_radicacion, "planillaRadicacion", parametros).
//            then(function (resultado) {
//              }).
//                    then(function (resultado) {
//                         res.send(G.utils.r(req.url, 'Plantilla ok!!!!', 200, {planillaRadicacion: resultado}));
    }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al consultar factura', 500, {planillaRadicacion: {}}));
            }).
            done();

};


function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Radicacion/reports/planilla.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/Radicacion/reports/javascripts/rotulos.js', 'utf8'),
            recipe: "html",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width: '700px'
            }
        },
        data: datos
    }, function (err, response) {

        response.body(function (body) {
            var fecha = new Date();

            var nombreTmp = datos.nombre + ".html";

            G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                if (err) {
                    console.log("err [__generarPdf]: ", err);
                    callback(true, err);
                    return;
                } else {

                    callback(nombreTmp);
                    return;
                }
            });
        });
    });
}



Radicacion.$inject = [
    "m_radicacion",
    "m_usuarios"
];

module.exports = Radicacion;