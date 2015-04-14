
var MovBodegasController = function(movimientos_bodegas) {

    this.m_movimientos_bodegas = movimientos_bodegas;
};

// Consultar Documentos Usuario
MovBodegasController.prototype.consultarDocumentosUsuario = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.centro_utilidad_id === undefined || args.movimientos_bodegas.bodega_id === undefined || args.movimientos_bodegas.tipo_documento === undefined) {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.centro_utilidad_id === '' || args.movimientos_bodegas.bodega_id === '') {
        res.send(G.utils.r(req.url, 'El centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }

    var usuario_id = req.session.user.usuario_id;
    var centro_utilidad_id = args.movimientos_bodegas.centro_utilidad_id;
    var bodega_id = args.movimientos_bodegas.bodega_id;
    var tipo_documento = args.movimientos_bodegas.tipo_documento;

    that.m_movimientos_bodegas.consultar_documentos_usuario(usuario_id, centro_utilidad_id, bodega_id, tipo_documento, function(err, lista_documentos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando los documentos del usuario', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Lista documentos del usuario', 200, {movimientos_bodegas: lista_documentos}));
        }
    });

};

// Actualizar bodegas_doc_id en documento temporal.
MovBodegasController.prototype.actualizarTipoDocumentoTemporal = function(req, res) {

    var that = this;

    var args = req.body.data;

    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.documento_temporal_id === undefined || args.movimientos_bodegas.usuario_id === undefined || args.movimientos_bodegas.bodegas_doc_id === undefined) {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id NO estan definidos', 404, {}));
        return;
    }

    if (args.movimientos_bodegas.documento_temporal_id === '' || args.movimientos_bodegas.usuario_id === '' || args.movimientos_bodegas.bodegas_doc_id === '') {
        res.send(G.utils.r(req.url, 'El documento_temporal_id, usuario_id o bodegas_doc_id estan vacíos', 404, {}));
        return;
    }
    
    var documento_temporal_id = args.movimientos_bodegas.documento_temporal_id;
    var usuario_id = args.movimientos_bodegas.usuario_id;
    var bodegas_doc_id = args.movimientos_bodegas.bodegas_doc_id;

    that.m_movimientos_bodegas.actualizar_tipo_documento_temporal(documento_temporal_id, usuario_id, bodegas_doc_id, function(err, rows) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Actualizando el documento Temporal', 500, {movimientos_bodegas: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Documento Temporal Actualizado Correctamete', 200, {movimientos_bodegas: {}}));
        }
    });

};

/*MovBodegasController.prototype.imprimirDocumentoDespacho = function(req, res){
    var that = this;
    var args = req.body.data;
    
    
    if (args.movimientos_bodegas === undefined || args.movimientos_bodegas.numero === undefined || args.movimientos_bodegas.prefijo === undefined
        || args.movimientos_bodegas.empresa === undefined) {
    
        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan definidos', 404, {}));
        return;
    }
    
    if (args.movimientos_bodegas.numero === "" || args.movimientos_bodegas.prefijo === "" || args.movimientos_bodegas.empresa === "") {
        res.send(G.utils.r(req.url, 'El numero, empresa o prefijo NO estan vacios', 404, {}));
        return;
    }
    
    var numero = args.movimientos_bodegas.numero;
    var prefijo = args.movimientos_bodegas.prefijo;
    var empresa = args.movimientos_bodegas.empresa;
    var datos_documento = {};
    
    that.m_movimientos_bodegas.obtenerEncabezadoDocumentoDespacho(numero, prefijo, empresa, req.session.user.usuario_id, function(err, rows){
        if (err || rows.length === 0) {

            res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
            return;
        }
        datos_documento.encabezado = rows[0];
        
        that.m_movimientos_bodegas.obtenerDetalleDocumentoDespacho(numero, prefijo, empresa, function(err, rows){
            if (err) {
                res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                return;
            }
            
            datos_documento.detalle = rows;
            that.m_movimientos_bodegas.obtenerDatosAdicionalesPorDocumento(numero, prefijo, empresa, datos_documento.encabezado.tipo_doc_bodega_id, function(err, rows){
                if (err || rows.length === 0 ) {
                    res.send(G.utils.r(req.url, 'Error consultando documento despacho', 500, {movimientos_bodegas: {}}));
                    return;
                }
                                
                datos_documento.adicionales = that.m_movimientos_bodegas.darFormatoTituloAdicionesDocumento(rows[0]);
                
                __generarPdfDespacho(datos_documento, function(nombre_pdf){
                    console.log("nombre generado ", nombre_pdf);
                    res.send(G.utils.r(req.url, 'Documento Generado Correctamete', 200, {movimientos_bodegas: {nombre_pdf:nombre_pdf}}));
                });

            });
            
            
        });
        
    });
    
};*/


/*function __generarPdfDespacho(datos, callback){
    G.jsreport.reporter.render({
        template: {
            content: G.fs.readFileSync('app_modules/MovimientosBodega/MovBodegas/reports/despacho.html', 'utf8'),
            recipe: "phantom-pdf",
            engine: 'jsrender',
            phantom: {
                margin: "10px",
                width:'700px'
            }
        },
        data: datos
    }).then(function(response) {

        var name = response.result.path;
        var nombreTmp = datos.encabezado.prefijo + "-" + datos.encabezado.numero + ".pdf";
        G.fs.copySync(name, G.dirname + "/public/reports/" + nombreTmp);

        callback(nombreTmp);
    });
}*/


MovBodegasController.$inject = ["m_movimientos_bodegas"];

module.exports = MovBodegasController;