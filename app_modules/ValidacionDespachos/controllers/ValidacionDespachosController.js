
var ValidacionDespachos = function(induccion,imprimir_productos) {

    this.m_ValidacionDespachos = induccion;
    this.m_imprimir_productos = imprimir_productos;

};




ValidacionDespachos.prototype.listarDespachosAprobados = function(req, res) {
    
    var that = this;

    var args = req.body.data;

  /*  if (args.planillas_despachos === undefined || 
        args.planillas_despachos.empresa_id === undefined || 
        args.planillas_despachos.prefijo === undefined    ||
        args.planillas_despachos.numero === undefined) {
        res.send(G.utils.r(req.url, 'planilla_id no esta definido', 404, {}));
        return;
    }

    if (args.planillas_despachos.empresa_id === '') {
        res.send(G.utils.r(req.url, 'El id de la empresa esta vacio', 404, {}));
        return;
    }
    
     if (args.planillas_despachos.prefijo === '') {
        res.send(G.utils.r(req.url, 'el numero de prefijo esta vacio', 404, {}));
        return;
    }
    
     if (args.planillas_despachos.numero === '') {
        res.send(G.utils.r(req.url, 'el numero esta vacio', 404, {}));
        return;
    }

    var empresa_id = args.planillas_despachos.empresa_id;
    var prefijo = args.planillas_despachos.prefijo;
    var numero = args.planillas_despachos.numero;*/
    
    var obj = {};
   
     G.Q.ninvoke(that.m_ValidacionDespachos,'listarDespachosAprobados', obj).then(function(resultado){ 
       
         return res.send(G.utils.r(req.url, 'Lista de despachos aprobados por seguridad', 200, {validacionDespachos: resultado}));
         
     }).fail(function(err){ 
         
         console.log("err ", err);
         res.send(G.utils.r(req.url, 'Error consultado las de despachos', 500, {validacionDespachos: {}}));
       
    }).done();
   
};


/*
* funcion para consultar empresas
* @param {type} req
* @param {type} res
* @returns {datos de consulta}
*/
ValidacionDespachos.prototype.listarEmpresas = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresa = args.listar_empresas.empresaName;
     if (empresa === undefined) {
        res.send(G.utils.r(req.url, 'empresa, No esta definida', 404, {}));
        return;
    }
    that.m_ValidacionDespachos.getListarEmpresas(empresa,function(err, empresas ) {

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
ValidacionDespachos.prototype.listarCentroUtilidad = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarCentroUtilidad.empresaId;
    
    if (empresaId === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, empresa_id no estan definidas', 404, {}));
        return;
    }
    
    that.m_ValidacionDespachos.getListarCentroUtilidad(empresaId,function(err, centroUtilidad ) { 

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
ValidacionDespachos.prototype.listarBodega = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaId = args.listarBodegas.empresaId;
    var centroUtilidadId = args.listarBodegas.centroUtilidadId;
    
    if (empresaId === undefined || centroUtilidadId === undefined   ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    that.m_ValidacionDespachos.getListarBodega(empresaId,centroUtilidadId,function(err, bodega ) { //,centroUtilidad
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
ValidacionDespachos.prototype.listarProducto = function(req, res) {
    
    var that = this;
    var args = req.body.data;
    var empresaIds = args.listarProducto.empresaId;
    var centroUtilidadId = args.listarProducto.centroUtilidadId;
    var bodegaId = args.listarProducto.bodegaId;
    var nombreProducto = args.listarProducto.nombreProducto;
    var pagina = args.listarProducto.pagina;
    console.log("paginaactual",args.listarProducto);
    if (empresaIds === undefined || centroUtilidadId === undefined || bodegaId === undefined || nombreProducto === undefined  ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }                                                   
    that.m_ValidacionDespachos.getListarProducto(empresaIds,centroUtilidadId,nombreProducto,bodegaId,pagina,function(err, rows ) { 
        if (err) {
            res.send(G.utils.r(req.url, 'Error listando Producto', 500, {listar_Producto: err}));
        } else {
            res.send(G.utils.r(req.url, 'Lista de Producto OK', 200, {listar_Producto: rows}));
        }
    });
};




ValidacionDespachos.prototype.imprimirRotulo = function(req, res) {

    var that = this;
    var args = req.body.data;
    var empresaIds = args.documento_temporal.empresaId;
    var centroUtilidadId = args.documento_temporal.centroUtilidadId;
    var bodegaId = args.documento_temporal.bodegaId;
    var nombreProducto = args.documento_temporal.nombreProducto;
    var pdf = args.documento_temporal.pdf;
    var pagina = args.documento_temporal.pagina;
    console.log("paginaactual",args.documento_temporal);
    if (empresaIds === undefined || centroUtilidadId === undefined || bodegaId === undefined || nombreProducto === undefined  ) { 
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    } 


 that.m_ValidacionDespachos.getListarProducto(empresaIds,centroUtilidadId,nombreProducto,bodegaId,pagina,function(err, rows ) { 
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
        console.log(pdf);
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
    console.log("_generarInforme: "+pdf)
        G.jsreport.render({
            template: {
                content: G.fs.readFileSync('app_modules/ValidacionDespachos/reports/rotulos.html', 'utf8'),
                helpers: G.fs.readFileSync('app_modules/ValidacionDespachos/reports/javascripts/rotulos.js', 'utf8'),
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

ValidacionDespachos.$inject = ["m_ValidacionDespachos"];

module.exports = ValidacionDespachos;