
var Productos = function(productos, socket) {
    this.io = socket;
    this.m_productos = productos;
};

function __enviarNotificacion(that,usuario,response,socket){
    console.log('usuario es: ',usuario);
    G.auth.getSessionsUser(usuario, function(err, sessions) {
        if(sessions != undefined){
            //Se recorre cada una de las sesiones abiertas por el usuario
            sessions.forEach(function(session) {
                console.log('In Foreach!!');
                //Se envia la notificacion con los pedidos asignados a cada una de las sesiones del usuario.
                that.io.to(session.socket_id).emit(socket,response);
            });
        }
    });
}

Productos.prototype.actualizarUrlDocumento = function(parametros) {
    //var that = this;
    var that = parametros.that;
    var res = parametros.res;
    var req = parametros.req;
    //that.m_productos = productos;


};

function __generarReporteFactura(rows, callback) {
    var host = rows.host;
    var ajuste_precio_id = rows.ajuste_precio_id;
    var res = rows.res;
    var req = rows.req;
    //console.log('session en __generarReporteFactura es:', rows.session);
    var usuario = rows.usuario_id;


    G.jsreport.render({
        template: {
            content: G.fs.readFileSync('app_modules/Productos/reports/ajuste_sube_costo.html', 'utf8'),
            helpers: G.fs.readFileSync('app_modules/Productos/reports/javascripts/helpers.js', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender'
        },
        data: {
            style: G.dirname + "/public/stylesheets/bootstrap.min.css",
            cabecera: rows.cabecera,
            detalle: rows.detalle,
            valores: rows.valores,
            justificacion: rows.justificacion,
            fecha_actual: rows.fecha_actual,
            usuario_id: rows.usuario_id,
            usuario_nombre: rows.usuario_nombre,
            serverUrl: rows.serverUrl,
            valores: rows.valores,
            producto_id: rows.producto_id,
            empresa_id: rows.empresa_id,
            empresa_nombre: rows.empresa_nombre,
            documento_id: rows.documento_id,
            producto_cantidad: rows.producto_cantidad,
            producto_costo_anterior: rows.costo_anterior,
            producto_costo_nuevo: rows.costo_nuevo,
            producto_descripcion: rows.descripcion,
            total_diferencia: rows.total_diferencia,
            aprobacion: rows.aprobacion,
            nueva_numeracion: rows.nueva_numeracion,
            prefijo: rows.prefijo,
            titulo: rows.titulo
        }
    }, function(err, response) {
        //console.log('Entro en funcion PDF2');
        if(err){
            console.log('Error en funcion PDF', err);
            callback(true, err);
        }else{
            console.log('fine en funcion PDF');
            response.body(function(body) {
                console.log('fine2 en funcion PDF');
                var fecha_actual = new Date();
                var nombre_reporte = G.random.randomKey(2, 5) + "_" + fecha_actual.toFormat('DD-MM-YYYY') + ".pdf";
                var reporte = "/public/reports/" + nombre_reporte;
                var reporte_imprimir = "/reports/" + nombre_reporte;
                G.fs.writeFile(G.dirname + reporte, body, "binary", function(err) {
                    //console.log('fine3 en funcion PDF',err);
                    if (err) {
                        console.log('error2 en funcion PDF',err);
                        callback(true, err);
                    } else {
                        var that = this;
                        //console.log('fine4 en funcion PDF');
                        //var msj = 'All fine!';
                        //var status = 200;
                        //var result = reporte;
                        //usuario = 1350;
                        //var response = G.utils.r('onNotificarTodoPendienteFormula', msj, status, result);
                        //console.log('response es: ',response);
                        //__enviarNotificacion(that,usuario,response,"onNotificarTodoPendienteFormula");
                        //that.io.to(session.socket_id).emit(socket,response);
                        console.log('URL desde controlador: ',reporte_imprimir);
                        callback(false, reporte_imprimir);
                    }
                });
            });
        }
    });
};

Productos.prototype.subeCosto = function(req, res) {
    var that = this;
    var args = req.body.data;
    var session = req.body.session;
    var parametros = args;
    var ajuste_precio_id = 0;
    var url_documento = '';
    //console.log('Parametros en controlador son: ',parametros);

    parametros.usuario_id = session.usuario_id;
    parametros.empresa_id = session.empresaId;
    parametros.centro_id = session.centroUtilidad;
    parametros.bodega_id = session.bodega;
    parametros.fecha_actual = new Date().toFormat('YYYY/MM/DD HH24:MI:SS');
    parametros.fecha_actual2 = new Date().toFormat('DD/MM/YYYY HH24:MI:SS');
    parametros.total_diferencia = parseFloat(parametros.total_diferencia);
    console.log('Controlador Backend!!!');

    if(parametros.reimprimir != undefined && parametros.ajuste_precio_id != undefined){
        console.log('parametros en reimprimir son: ',parametros);
        var datos = {
            cabecera: '',
            impuestos: '',
            detalle: '',
            serverUrl: '',
            justificacion: parametros.justificacion,
            usuario_id: parametros.usuario_id,
            usuario_nombre: parametros.usuario_nombre,
            fecha_actual: parametros.fecha_actual2,
            producto_id: parametros.producto_id,
            empresa_id: parametros.empresa_id,
            empresa_nombre: parametros.empresa_nombre,
            documento_id: parametros.documento_id,
            producto_cantidad: parametros.producto_cantidad,
            costo_anterior: parametros.anterior_precio,
            costo_nuevo: parametros.nuevo_precio,
            total_diferencia: parametros.total_diferencia,
            aprobacion: parametros.aprobacion,
            descripcion: parametros.descripcion,
            nueva_numeracion: parametros.prefijo+'-'+parametros.numeracion,
            prefijo: parametros.prefijo,
            session: session,
            titulo: parametros.titulo,
            host: parametros.host
        };
        //console.log('Datos para PDF en Reimprimir son: ',datos);
        G.Q.nfcall(__generarReporteFactura, datos).then(function (url_documento){
            var parametro_actualizar_url = {
                ajuste_precio_id: parametros.ajuste_precio_id,
                url_documento: url_documento
            };
            var response = G.Q.ninvoke(that.m_productos, "subeCosto_UpdateUrlDocumento", parametro_actualizar_url);
            if(response){
                res.send(G.utils.r(req.url, req.body, 200, {listarAgrupar: url_documento}));
            }else{
                res.send(G.utils.r(req.url, req.body, 500, {listarAgrupar: ''}));
            }
        });
    }else {
        console.log('Entro en el Else, con parametros', parametros);
        //console.log('Obj en el controlador es: ', parametros);
        G.Q.ninvoke(that.m_productos, "subeCosto_UpdateInventary", parametros).then(function (resultado) {
            console.log('funcion 1');
            return G.Q.ninvoke(that.m_productos, "subeCosto_SelecInventario", parametros);
        }).then(function (resultado2) {
            parametros.descripcion = resultado2[0].descripcion;
            parametros.producto_cantidad = resultado2[0].existencia;
            console.log('funcion 2');
            return G.Q.ninvoke(that.m_productos, "subeCosto_SelectDocuments", parametros);
        }).then(function (resultado3) {
            parametros.nueva_numeracion = parseInt(resultado3[0].numeracion) + 1;
            parametros.documento_id = resultado3[0].documento_id;
            parametros.prefijo = resultado3[0].prefijo;
            console.log('resultado3: ',resultado3[0]);
            return G.Q.ninvoke(that.m_productos, "subeCosto_UpdateDocumentos", parametros);
        }).then(function (resultado4) {
            console.log('funcion 4');
            return G.Q.ninvoke(that.m_productos, "subeCosto_InsertInvBodAjusPrice", parametros);
        }).then(function (resultado5) {
            ajuste_precio_id = resultado5[0];
            console.log('resultado 5, ', ajuste_precio_id);
            //var date0 = new Date(resultado5[0].fecha);
            //parametros.fechaActual = date0.getFullYear() + '-' + ('0' + (date0.getMonth() + 1)).slice(-2) + '-' + ('0' + date0.getDate()).slice(-2) + ' '+('0' + date0.getHours()).slice(-2)+':'+('0' + date0.getMinutes()).slice(-2)+':'+('0' + date0.getSeconds()).slice(-2);
            //console.log('Fecha desde la base de datos es: ', parametros.fecha_actual);
            // return res.send(G.utils.r(req.url, req.body, 200, {listarAgrupar: true}));
            var datos = {
                cabecera: '',
                impuestos: '',
                detalle: '',
                serverUrl: '',
                justificacion: parametros.justificacion,
                usuario_id: parametros.usuario_id,
                usuario_nombre: parametros.usuario_nombre,
                fecha_actual: parametros.fecha_actual2,
                producto_id: parametros.producto_id,
                empresa_id: parametros.empresa_id,
                empresa_nombre: parametros.empresa_nombre,
                documento_id: parametros.documento_id,
                producto_cantidad: parametros.producto_cantidad,
                costo_anterior: parametros.anterior_precio,
                costo_nuevo: parametros.nuevo_precio,
                total_diferencia: parametros.total_diferencia,
                aprobacion: parametros.aprobacion,
                descripcion: parametros.descripcion,
                nueva_numeracion: parametros.prefijo+'-'+parametros.nueva_numeracion,
                prefijo: parametros.prefijo,
                session: session,
                titulo: parametros.titulo,
                host: parametros.host
            };
            //datos['serverUrl'] = parametros.protocol + '://' + parametros.host + "/";
            //console.log('Parametros son: ',parametros);
            //console.log('datos para funcion PDF son: ', datos);
            //console.log('session es: ', session);
            //console.log('Esto es "req": ',req);
            //console.log('Esto es "res": ',res);
            return G.Q.nfcall(__generarReporteFactura, datos);
        }).then(function (resultado6) {
            url_documento = resultado6;
            var parametro_actualizar_url = {
                ajuste_precio_id: ajuste_precio_id,
                url_documento: resultado6
            };
            return G.Q.ninvoke(that.m_productos, "subeCosto_UpdateUrlDocumento", parametro_actualizar_url);
        }).then(function (resultado7) {
            console.log('Url del documento actualizada!!');
            res.send(G.utils.r(req.url, req.body, 200, {listarAgrupar: url_documento}));
        }).fail(function (err) {
            //console.log('Antes de enviar el error!!!');
            res.send(G.utils.r(req.url, 'Error!! ' + err, 500, {listarAgrupar: {}}));
        }).done();
    }
};

Productos.prototype.bajeCosto = function(req, res) {

};


Productos.prototype.listar_productos = function(req, res) {
    var that = this;
    var args = req.body.data;

    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined || args.productos.termino_busqueda === undefined || args.productos.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id, termino_busqueda o  pagina_actual no estan definidos', 404, {}));
        return;
    }

    if (args.productos.empresa_id === '' || args.productos.centro_utilidad_id === '' || args.productos.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }
    
    if (args.productos.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var empresa_id = args.productos.empresa_id;
    var centro_utilidad_id = args.productos.centro_utilidad_id;
    var bodega_id = args.productos.bodega_id;
    var termino_busqueda = args.productos.termino_busqueda;
    var pagina_actual = args.productos.pagina_actual;

    /* Inicio - Modificación para Tipo Producto */
    var tipo_producto = '0';

    if(args.productos.tipo_producto !== undefined){
        tipo_producto = args.productos.tipo_producto;
    }
    /* Fin - Modificación para Tipo Producto */

    this.m_productos.buscar_productos(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina_actual, tipo_producto, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};

/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* +Descripcion: Permite consultar la homologacion de productos de medipol
*/
Productos.prototype.listarHomologacionProductos = function(req, res){
    
    var that = this;
    var args = req.body.data;
        
    if (!args.productos || (!args.productos.empresa_id || args.productos.empresa_id.length === 0) || 
        (!args.productos.pagina || args.productos.pagina.length === 0)) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    G.Q.ninvoke(that.m_productos,"listarHomologacionProductos", args.productos).then(function(existencias){
        res.send(G.utils.r(req.url, 'Lista Productos', 200, {lista_productos: existencias}));
    }).fail(function(err){
        console.log("listarHomologacionProductos ", err);
       res.send(G.utils.r(req.url, 'Error consultando los productos', 500, {lista_productos: {}}));
    });
};


/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* @Uso tablet, modulo de existencias
* +Descripcion: Permite consumir el servicio para consultar las existencias de un producto
*/
Productos.prototype.consultarExistenciasProducto = function(req, res) {

    var that = this;
    var args = req.body.data;

    if (!args.productos || !args.productos.empresa_id || !args.productos.codigo_producto || !args.productos.centro_utilidad_id || 
        !args.productos.bodega_id) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    var empresaId = args.productos.empresa_id;
    var codigoProducto = args.productos.codigo_producto;
    var centroUtilidad = args.productos.centro_utilidad_id;
    var bodega = args.productos.bodega_id;

    G.Q.ninvoke(that.m_productos,"consultar_existencias_producto", empresaId, codigoProducto, centroUtilidad, bodega, {}).then(function(existencias){
       
        res.send(G.utils.r(req.url, 'Lista Existencias Producto', 200, {existencias: existencias}));
    }).fail(function(err){
       res.send(G.utils.r(req.url, 'Error consultando las existencias', 500, {lista_productos: {}}));
    });
};

/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* @Uso tablet, modulo de existencias
* +Descripcion: Permite consumir el servicio para guardar una existencia(lote) de un producto
*/
Productos.prototype.guardarExistenciaBodega = function(req, res){
    var that = this;
    var args = req.body.data;

    if (!args.productos || !args.productos.empresa_id || !args.productos.codigo_producto || !args.productos.centro_utilidad_id || 
        !args.productos.bodega_id || !args.productos.fecha_vencimiento || !args.productos.codigo_lote) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    if(G.moment().isAfter(args.productos.fecha_vencimiento)){
        res.send(G.utils.r(req.url, 'La fecha de vencimiento no es válida', 403, {}));
        return;
    }
    
    var params = {};
    params.empresaId = args.productos.empresa_id;
    params.codigoProducto = args.productos.codigo_producto;
    params.centroUtilidad = args.productos.centro_utilidad_id;
    params.bodega = args.productos.bodega_id;
    params.fechaVencimiento = args.productos.fecha_vencimiento;
    params.codigoLote = args.productos.codigo_lote;

    G.Q.ninvoke(that.m_productos,"guardarExistenciaBodega", params).then(function(existencias){
        res.send(G.utils.r(req.url, 'Guardar existencia bodega', 200, {existencias: existencias}));
    }).fail(function(err){
       console.log("error generado ", err);
       res.send(G.utils.r(req.url, 'Error guardando la existencia del producto', 500, {lista_productos: {}}));
    });
};

/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* @Uso tablet, modulo de existencias
* +Descripcion: Permite actualizar las existencias de un producto
*/
Productos.prototype.actualizarExistenciasProducto = function(req, res){
    var that = this;
    var args = req.body.data;

    if (!args.productos || !args.productos.empresa_id || !args.productos.codigo_producto || !args.productos.centro_utilidad_id || 
        !args.productos.bodega_id || !args.productos.existencias || args.productos.existencias.length === 0) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    var params = {};
    params.empresaId = args.productos.empresa_id;
    params.codigoProducto = args.productos.codigo_producto;
    params.centroUtilidad = args.productos.centro_utilidad_id;
    params.bodega = args.productos.bodega_id;
    params.existencias = args.productos.existencias;

    G.Q.ninvoke(that.m_productos,"actualizarExistenciasProducto", params).then(function(existencias){
        res.send(G.utils.r(req.url, 'Guardar existencia bodega', 200, {existencias: existencias}));
    }).fail(function(err){
       var msj = "Error interno";
       var status = 500;
       if(err.status){
           msj = err.msj;
           status = err.status;
       }
       
       res.send(G.utils.r(req.url, msj, status, {}));
    });
};


Productos.prototype.listarTipoProductos = function(req, res) {
    
    var that = this;
    
    that.m_productos.listar_tipo_productos( function(err, tipo_productos) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de tipos de Producto', 500, {lista_tipo_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de tipos de Productos', 200, {lista_tipo_productos: tipo_productos}));
            return;
        }
    });
    
};



Productos.$inject = ["m_productos", "socket"];

module.exports = Productos;