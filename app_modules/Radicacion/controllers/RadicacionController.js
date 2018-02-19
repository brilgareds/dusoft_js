
/* global G, $scope */

var Radicacion = function (radicacion, m_usuarios) {
    this.m_radicacion = radicacion;
    this.m_usuarios = m_usuarios;
};

Radicacion.prototype.listarConcepto = function (req, res) {
    console.log("AA222");
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


Radicacion.prototype.subirArchivo = function(req, res){
    var that = this;
    var args = req.body.data;
    
    //Notificacion de la subida del archivo plano
    var notificacionArchivoPlano =  function(index, longitud){
        var porcentaje = (index * 100) / longitud;
        that.e_radicacion.onNotificarProgresoArchivo(req.session.user.usuario_id, porcentaje);
    };
    
    G.Q.nfcall(G.utils.subirArchivo, req.files, false).then(function(resultado){
       return resultado;
    }).then(function(resultado){
        res.send(G.utils.r(req.url, 'Archivo cargado correctamente', 200, {data:resultado}));
    }).fail(function(err){
    console.log('el errror',err); 
        console.log("se ha generado un error ", err);
        res.send(G.utils.r(req.url, err, 500, {ordenes_compras: []}));
    });
    
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

    if (args.bodegaId === undefined || args.bodegaId === "") {
        res.send(G.utils.r(req.url, 'Debe selecccionar la farmacia', 404, {}));
        return;
    }

    if (args.precio === undefined || args.precio === "") {
        res.send(G.utils.r(req.url, 'Debe digitar el precio', 404, {}));
        return;
    }


    /*  if (args.ruta === undefined || args.ruta === ""){
     res.send(G.utils.r(req.url, 'Debe Digitar la ruta', 404, {}));
     return;
     } */


    if (args.fechaVencimiento === undefined || args.fechaVencimiento === "") {
        res.send(G.utils.r(req.url, 'Debe digitar la fecha de vencimiento', 404, {}));
        return;
    }


    var obj = {numeroFactura: args.numeroFactura,
        concepto_radicacion_id: args.conceptoRadicacionId,
        sw_entregado: args.swEntregado,
        bodega_id: args.bodegaId,
        precio: args.precio,
        ruta: args.ruta,
        fechaVencimiento: args.fechaVencimiento,
        usuario_id: req.session.user.usuario_id
    };


    G.Q.ninvoke(that.m_radicacion, "factura", obj).then(function (resultado) {
        res.send(G.utils.r(req.url, 'factura ok!!!!', 200, {factura: resultado}));
    }).fail(function (err) {
        console.log("error", err);
        res.send(G.utils.r(req.url, 'Error de factura', 500, {factura: {error: err}}));
    }).
            done();

    





};


Radicacion.$inject = [
                          "m_radicacion", 
                          "m_usuarios"
                         ];

module.exports = Radicacion;