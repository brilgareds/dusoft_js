
var Induccion = function(induccion,imprimir_productos) {

    this.m_induccion = induccion;
    this.m_imprimir_productos = imprimir_productos;

};
/*
* funcion para consultar empresas
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarEmpresas = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
     if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_induccion.getListarEmpresas(empresa,function(err, empresas ) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando las empresas', 500, {listar_empresas: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de empresas OK', 200, {listar_empresas: empresas}));
        }
    });
};
/*
* funcion para consultar CentroUtilidad
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarCentroUtilidad = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarCentroUtilidad.empresaId;
    
    if (empresaId === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, empresa_id no estan definidas', 404, {}));
        return;
    }
    
    that.m_induccion.getListarCentroUtilidad(empresaId,function(err, centroUtilidad ) { 

        if (err) {
            res.send(G.utils.r(req.url, 'Error listando centros de utilidad', 500, {listar_CentroUtilidad: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de centros de utilidad OK', 200, {listar_CentroUtilidad: centroUtilidad}));
        }
    });
};
/*
* funcion para consultar Bodega
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarBodega = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarBodegas.empresaId;
    var centroUtilidadId = args.listarBodegas.centroUtilidadId;
    
    if (empresaId === undefined || centroUtilidadId === undefined   ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    that.m_induccion.getListarBodega(empresaId,centroUtilidadId,function(err, bodega ) { //,centroUtilidad
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Bodegas', 500, {listar_Bodega: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Bodegas OK', 200, {listar_Bodega: bodega}));
        }
    });
};
/*
* funcion para Producto
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
Induccion.prototype.listarProducto = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaIds = args.listarProducto.empresaId;
    var centroUtilidadId = args.listarProducto.centroUtilidadId;
    var bodegaId = args.listarProducto.bodegaId;
    var nombreProducto = args.listarProducto.nombreProducto;
    var pagina = args.listarProducto.pagina;

    if (empresaIds === undefined || centroUtilidadId === undefined || bodegaId === undefined || nombreProducto === undefined  ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }                                                   
    that.m_induccion.getListarProducto(empresaIds,centroUtilidadId,nombreProducto,bodegaId,pagina,function(err, rows ) { 
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Producto', 500, {listar_Producto: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Producto OK', 200, {listar_Producto: rows}));
        }
    });
};




Induccion.prototype.imprimirRotulo = function(req, res) {

    var that = this;
    var args = req.body.data;
    var empresaIds = args.documento_temporal.empresaId;
    var centroUtilidadId = args.documento_temporal.centroUtilidadId;
    var bodegaId = args.documento_temporal.bodegaId;
    var nombreProducto = args.documento_temporal.nombreProducto;
    var pdf = args.documento_temporal.pdf;
    var pagina = args.documento_temporal.pagina;
  
    if (empresaIds === undefined || centroUtilidadId === undefined || bodegaId === undefined || nombreProducto === undefined  ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    } 


 that.m_induccion.getListarProducto(empresaIds,centroUtilidadId,nombreProducto,bodegaId,pagina,function(err, rows ) { 
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Producto', 500, {imprimir_productos: {}}));
            return;
        } 
        if (rows.length === 0) {
            res.send(G.utils.r(req.url, 'No se encontro la caja para el pedido', 404, {}));
            return;
        }
        
        var obj = {
            detalle : rows,
            serverUrl : req.protocol + '://' + req.get('host')+ "/"
        };
  
         _generarInforme(obj,pdf ,function(nombreTmp) {
            res.send(G.utils.r(req.url, 'Url reporte rotulo', 200, {imprimir_productos: {nombre_reporte: nombreTmp}}));
        });
    });
};

function _generarInforme(obj,pdf,callback) {
    var recips="";
    var extencion="";
    if(pdf==1){
        recips="phantom-pdf";
        extencion="pdf";
    }else if(pdf==0){
        recips="html-to-xlsx";
        extencion="csv";    
    }else{
        recips="text";
        extencion="txt";
    }
    
        G.jsreport.render({
            template: {
                content: G.fs.readFileSync('app_modules/Induccion/reports/rotulos.html', 'utf8'),
                helpers: G.fs.readFileSync('app_modules/Induccion/reports/javascripts/rotulos.js', 'utf8'),
                recipe: recips,
                engine: 'jsrender'
            },
            data: obj
        }, function (err, response) {            
            response.body(function (body) {
                var fecha = new Date();
              //  var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + ".pdf";
                var nombreTmp = G.random.randomKey(2, 5) + "_" + fecha.toFormat('DD-MM-YYYY') + "."+extencion;
                G.fs.writeFile(G.dirname + "/public/reports/" + nombreTmp, body, "binary", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        callback(nombreTmp);
                    }
                });


            });

        });
    }

Induccion.$inject = ["m_induccion"];

module.exports = Induccion;