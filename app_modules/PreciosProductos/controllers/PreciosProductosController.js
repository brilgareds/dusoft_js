
/* global G, $scope */

var Precios_productos = function (m_precios_productos, m_usuarios) {
    this.m_precios_productos = m_precios_productos;
    this.m_usuarios = m_usuarios;
};

Precios_productos.prototype.listarConcepto = function (req, res) {

    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_precios_productos, "listarConcepto").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de concepto ok!!!!', 200, {listarConcepto: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar concepto', 500, {listarConcepto: {}}));
            }).
            done();

};


Precios_productos.prototype.subirArchivo = function (req, res) {

    var that = this;
    var args = req.body.data;

if (args.data.ruta.name !== ""){
    req.files.file.customPath = G.settings.carpetaFactura + "Sistemas/";
   

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


Precios_productos.prototype.listarFactura = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_precios_productos, "listarFactura").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de factura ok!!!!', 200, {listarFactura: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar factura', 500, {listarFactura: {}}));
            }).
            done();

};
Precios_productos.prototype.listarAgrupar = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args;
    var session = req.body.session;
    var resultado = '';
    var resultado2 = '';
    parametros.empresa_id = session.empresaId;
    parametros.centro_id = session.centroUtilidad;
    parametros.bodega_id = session.bodega;

    if(parametros.fecha_ini != undefined && parametros.fecha_fin != undefined){
        parametros.fecha_ini = parametros.fecha_ini.substring(0, 10);
        parametros.fecha_fin = parametros.fecha_fin.substring(0, 10);
    }else{
        parametros.fecha_ini = '01-01-1800';
        parametros.fecha_fin = '01-01-2100';
    }
    //parametros.fecha_fin = '2019-01-14';

    G.Q.ninvoke(that.m_precios_productos, "listarAgrupar", parametros).
        then(function (resultado) {
            //console.log('Primer Resultado: ',resultado[0]);
            if(resultado == undefined || resultado.length == 0 ){ resultado = ''; }
            G.Q.ninvoke(that.m_precios_productos, "listarDocumentosAjustes", parametros).
            then(function (resultado2) {
                if(resultado2 == undefined || resultado2.length == 0){ resultado2 = ''; }
                //console.log('Segundo Resultado: ',resultado2[0]);
                res.send(G.utils.r(req.url, req.body, 200, {listarAgrupar: resultado, documentosAjustes: resultado2}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error1!! '+err, 500, {listarAgrupar: {}}));
            });
        }).
        fail(function (err) {
            res.send(G.utils.r(req.url, 'Error2!! '+err, 500, {listarAgrupar: {}}));
        }).
        done();
};

Precios_productos.prototype.eliminarGrupoFactura = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args;
    console.log(parametros);
    G.Q.ninvoke(that.m_precios_productos, "eliminarGrupoFactura", parametros).then(function (resultado) {

        return G.Q.ninvoke(that.m_precios_productos, "modificarEntregado", {sw_entregado: 0, factura_id: parametros.factura_id});

    }).then(function (resultado) {
        res.send(G.utils.r(req.url, 'se elimino correctamente ok!!!!', 200, {eliminarGrupoFactura: resultado}));
    }).
            fail(function (err) {
                console.log("error", err);
                res.send(G.utils.r(req.url, 'Error al eliminar ', 500, {eliminarGrupoFactura: {}}));
            }).
            done();

};

Precios_productos.prototype.guardarConcepto = function (req, res) {

    var that = this;
    var args = req.body.data;


    if (args.nombre === undefined || args.nombre === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el nombre del concepto', 404, {}));
        return;
    }

    var obj = {nombre: args.nombre};

    G.Q.ninvoke(that.m_precios_productos, "guardarConcepto", obj).
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
Precios_productos.prototype.guardarFactura = function (req, res) {

    var that = this;
    var args = req.body.data;
   
    if (args.numeroFactura === undefined || args.numeroFactura === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el numero de la factura', 404, {}));
        return;
    }

    if (args.conceptoPrecios_productosId === undefined || args.conceptoPrecios_productosId === "") {
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
        concepto_radicacion_id: args.conceptoPrecios_productosId,
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
    
    G.Q.ninvoke(that.m_precios_productos, "factura", obj).then(function (resultado) {
        res.send(G.utils.r(req.url, 'factura ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error de factura', 500, {factura: {error: err}}));
    }).done();
};


Precios_productos.prototype.modificarFactura = function (req, res) {
    var that = this;
    var args = req.body.data;


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


    G.Q.ninvoke(that.m_precios_productos, "modificarFactura", args).then(function (resultado) {
       
        res.send(G.utils.r(req.url, 'modificacion factura ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};

Precios_productos.prototype.modificarEntregado = function (req, res) {
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

    G.Q.ninvoke(that.m_precios_productos, "modificarEntregado", args).then(function (resultado) {

        res.send(G.utils.r(req.url, 'modificacion factura entregada ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};
Precios_productos.prototype.modificarNombreArchivo = function (req, res) {
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

    G.Q.ninvoke(that.m_precios_productos, "modificarNombreArchivo", args).then(function (resultado) {

        res.send(G.utils.r(req.url, 'modificacion factura entregada ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error al modificar la factura', 500, {factura: {error: err}}));
    }).done();

};


Precios_productos.prototype.insertAgruparFactura = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = args.facturas;


    if (args.facturas.length < 0) {
        res.send(G.utils.r(req.url, 'Debe seleccionar las facturas', 404, {}));
        return;
    }


    G.Q.ninvoke(that.m_precios_productos, "agruparFacturaSecuencia").then(function (resultado) {

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
    G.Q.ninvoke(that.m_precios_productos, "insertAgruparFactura", parametro).then(function (resultado) {

        G.Q.nfcall(that.m_precios_productos.modificarEntregado, parametro).then(function (result) {

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

Precios_productos.prototype.listarFacturaEntregado = function (req, res) {
    var that = this;
    var args = req.body.data;

    G.Q.ninvoke(that.m_precios_productos, "listarFacturaEntregado").
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'lista de factura ok!!!!', 200, {listarFacturaEntregado: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al listar factura', 500, {listarFacturaEntregado: {}}));
            }).
            done();

};
Precios_productos.prototype.agregarFacturaEntregado = function (req, res) {
    var that = this;
    var args = req.body.data;
    var parametros = {
        numeroPrecios_productos: args.numeroPrecios_productos,
        numeroFactura: args.numeroFactura,
        factura_id: args.numeroFactura,
        sw_entregado: '1',
        usuario_id: req.session.user.usuario_id
    };

    G.Q.ninvoke(that.m_precios_productos, "agregarFacturaEntregado", parametros).
            then(function (resultado) {

                return G.Q.nfcall(that.m_precios_productos.modificarEntregado, parametros);

            }).
            then(function (resultado) {
                res.send(G.utils.r(req.url, 'Agregar factura ok!!!!', 200, {agregarFacturaEntregado: resultado}));
            }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al agregar factura', 500, {agregarFacturaEntregado: {}}));
            }).
            done();

};

Precios_productos.prototype.planillaPrecios_productos = function (req, res) {
    var that = this;
    var fecha = new Date();

    var args = req.body.data;


    var parametros = {
        relacion_id: args.relacion_id

    };
    G.Q.ninvoke(that.m_precios_productos, "modificarDescarga", parametros).
            then(function (result) {
                
                return G.Q.ninvoke(that.m_precios_productos, "listarItemReporte", parametros);
                
            }).then(function (resultado) {
        while (resultado.length < 14) {
            resultado.push({});

        }

     
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



//    G.Q.ninvoke(that.m_precios_productos, "planillaPrecios_productos", parametros).
//            then(function (resultado) {
//              }).
//                    then(function (resultado) {
//                         res.send(G.utils.r(req.url, 'Plantilla ok!!!!', 200, {planillaPrecios_productos: resultado}));
    }).
            fail(function (err) {
                res.send(G.utils.r(req.url, 'Error al consultar factura', 500, {planillaPrecios_productos: {}}));
            }).
            done();

};


function __generarPdf(datos, callback) {

    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Precios_productos/reports/planilla.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/Precios_productos/reports/javascripts/rotulos.js', 'utf8'),
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



Precios_productos.$inject = [
    "m_precios_productos",
    "m_usuarios"
];

module.exports = Precios_productos;