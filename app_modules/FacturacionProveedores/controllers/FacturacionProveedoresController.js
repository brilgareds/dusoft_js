var FacturacionProveedores = function(m_facturacion_proveedores) {
    this.m_facturacion_proveedores = m_facturacion_proveedores;   
};


/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo encargado de obtener la lista de las ordenes de compra                                         
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.listarOrdenesCompraProveedor = function(req, res){
   
    var that = this;
    var args = req.body.data;
    var fechaFin='';
    var fechaInicio='';
    
    if (args.listar_clientes === undefined || args.listar_clientes.paginaActual === undefined) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
     
    if (args.listar_clientes.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la empresa', 404, {listar_clientes: []}));
        return;
    }

    if (args.listar_clientes.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }
    
    if (args.listar_clientes.terminoBusqueda === '') {
        res.send(G.utils.r(req.url, '', 404, {}));
        return;
    }
    
    if (!args.listar_clientes.filtro ) {
        res.send(G.utils.r(req.url, 'Error en la lista de filtros de busqueda', 404, {}));
        return;
    }
    
    var empresaId = args.listar_clientes.empresaId;
    var terminoBusqueda = args.listar_clientes.terminoBusqueda;
    var paginaActual = args.listar_clientes.paginaActual;
    var filtro = args.listar_clientes.filtro;
    var usuario = req.session.user.usuario_id;
    fechaInicio=args.listar_clientes.fechaInicio;
    fechaFin=args.listar_clientes.fechaFin;
    
   var parametros={ empresaId:empresaId,
                    terminoBusqueda: terminoBusqueda,
                    paginaActual:paginaActual,
                    filtro: filtro,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    usuarioId : usuario};
    console.log("parametros ", parametros);           
    G.Q.ninvoke(that.m_facturacion_proveedores,'consultarOrdenesCompraProveedor',parametros).then(function(resultado){
        
    if(resultado.length >0){
        res.send(G.utils.r(req.url, 'Consulta con formulas', 200, {listarOrdenesCompraProveedor:resultado}));
    }else{
        throw 'Consulta sin resultados';
    }
        
    }).fail(function(err){      
       res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de retornar toda la recepcion de la factura                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.detalleRecepcionParcial = function(req, res) {

    var that = this;
    var args = req.body.data;
    var recepcionDetalle=[];
    var recepcionDetalleTotal={};

    if (args.detalleRecepcionParcial.paginaActual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {detalleRecepcionParcial: []}));
        return;
    }

    if (args.detalleRecepcionParcial.recepcion_parcial_id === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la recepcion_parcial_id', 404, {detalleRecepcionParcial: []}));
        return;
    }


    var parametros = {
        paginaActual: args.detalleRecepcionParcial.paginaActual,
        recepcion_parcial_id: args.detalleRecepcionParcial.recepcion_parcial_id,
        empresa_id : args.detalleRecepcionParcial.empresa_id,
        porcentajeCree:args.detalleRecepcionParcial.porcentajeCree,
        porcentajeRtf:args.detalleRecepcionParcial.porcentajeRtf,
        porcentajeIca:args.detalleRecepcionParcial.porcentajeIca,
        porcentajeReteiva:args.detalleRecepcionParcial.porcentajeReteiva
    };
   
    G.Q.ninvoke(that.m_facturacion_proveedores, 'detalleRecepcionParcial', parametros).then(function(resultado) {
       
        if (resultado.length > 0) {
            recepcionDetalle=resultado;
            return G.Q.ninvoke(that.m_facturacion_proveedores, "listarParametrosRetencion", parametros);

        } else {
            throw 'Consulta sin resultados';
        }

    }).then(function(resultado) {
        var valores = {
                    Total    :0,   
                    porcIva  :0,
                    SubTotal :0,   
                    Iva      :0,
                    Cantidad :0,
                    _subTotal:0,
                    _iva     :0,
                    impuesto_cree : 0,
                    Cantidad:0

            };
            return G.Q.nfcall(__impuestos, that, 0, recepcionDetalle, resultado[0], valores, parametros);
        
    }).then(function(resultado) {
        console.log("resultado:: ",resultado);
        recepcionDetalleTotal[0]=resultado;
        recepcionDetalleTotal[1]=recepcionDetalle;
        res.send(G.utils.r(req.url, 'Consulta detalleRecepcionParcial', 200, {detalleRecepcionParcial: recepcionDetalleTotal}));

    }).fail(function(err) {
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo encargado de crear la factura sobre la recepcion                                                   
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
FacturacionProveedores.prototype.ingresarFactura = function(req, res) {
    var that = this;
    var args = req.body.data;
    var usuario = req.session.user.usuario_id;

    if (args.facturaProveedor.parmetros.numroFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el numero de Factura', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.empresaId === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el Id de la Empresa', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.empresaId === undefined || args.facturaProveedor.centroUtilidad === undefined || args.facturaProveedor.bodega === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la información de la Empresa', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.recepciones[0].proveedor === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere el Id del proveedor', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.descripcionFactura === undefined || args.facturaProveedor.parmetros.descripcionFija === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la observacion', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.fechaVencimeinto === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha Vencimiento', 404, {ingresarFactura: []}));
        return;
    }
    if (args.facturaProveedor.parmetros.fechaFactura === undefined) {
        res.send(G.utils.r(req.url, 'Se requiere la fecha Factura', 404, {ingresarFactura: []}));
        return;
    }

    var parametros = {
        numero_factura: args.facturaProveedor.parmetros.numroFactura,
        empresa_id: args.facturaProveedor.empresaId,
        centro_utilidad: args.facturaProveedor.centroUtilidad,
        bodega: args.facturaProveedor.bodega,
        codigo_proveedor_id: args.facturaProveedor.parmetros.recepciones[0].proveedor,
        observaciones: args.facturaProveedor.parmetros.descripcionFactura + '' + args.facturaProveedor.parmetros.descripcionFija,
        valor_descuento: args.facturaProveedor.parmetros.totalDescuento,
        fecha_factura: args.facturaProveedor.parmetros.fechaVencimeinto,
        fecha_radicacion_factura: args.facturaProveedor.parmetros.fechaFactura,
        usuario_id: usuario
    };

    G.Q.ninvoke(that.m_facturacion_proveedores, 'listarParametrosRetencion', parametros).then(function(resultado) {

        return G.Q.nfcall(__impuestoProveedor, resultado[0], args.facturaProveedor.parmetros.recepciones[0], {});

    }).then(function(resultado) {

        parametros.porc_ica = resultado.ica;
        parametros.porc_rtf = resultado.rtf;
        parametros.porc_rtiva = resultado.iva;

        return G.Q.ninvoke(that.m_facturacion_proveedores, 'ingresarFacturaCabecera', parametros);

    }).then(function(resultado) {

        return G.Q.nfcall(__ingresarFacturaDetalle, that, 0, args.facturaProveedor.parmetros.recepciones, parametros);

    }).then(function(resultado) {

        res.send(G.utils.r(req.url, 'ingresarFactura ok', 200, {ingresarFactura: []}));

    }).fail(function(err) {
        console.log("Error ingresarFactura ", err);
        G.Q.nfcall(__eliminarFactura, that, parametros);
        res.send(G.utils.r(req.url, err, 500, {}));
    }).done();

};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo recursivo privado encargado de iterar la recepciones parciales                                                    
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __ingresarFacturaDetalle(that, index, detalle, parametros, callback) {

    var producto = detalle[index];

    if (!producto) {
        callback(false);
        return;
    }
    
    producto.recepcion_parcial_id = producto.recepcion_parcial;

    G.Q.ninvoke(that.m_facturacion_proveedores, 'detalleRecepcionParcial', producto).then(function(resultado) {

        return G.Q.nfcall(__insertarDetalle, that, 0, resultado, parametros);

    }).then(function(resultado) {
        
        return G.Q.ninvoke(that.m_facturacion_proveedores, 'updateEstadoRecepcionParcial', producto);
        
     }).then(function(resultado) {
         
        setTimeout(function() {
            index++;
            __ingresarFacturaDetalle(that, index, detalle, parametros, callback);
        }, 3);        
        
    }).fail(function(err) {
       G.Q.nfcall(__eliminarFactura, that, producto);       
       console.log("Error __ingresarFacturaDetalle ",err);
       callback(true);
       return;
    }).done();
}

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion Metodo privado encargado de eliminar las recepciones de una factura                                                  
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __eliminarFactura(that,parametros, callback){
  G.Q.ninvoke(that.m_facturacion_proveedores, 'eliminarFacturaDetalle', parametros).then(function(resultado) {  
     return  G.Q.ninvoke(that.m_facturacion_proveedores,'eliminarFactura',parametros);
   }).then(function(resultado) {
       callback(false);
       return;
   }).fail(function(err) {
      console.log("Error __eliminarFactura ",err);
      callback(true);
      return;
   }).done();
};

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo recursivo privado encargado de iterar el detalle de una recepcion                                               
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __insertarDetalle(that, index, productos, parametros, callback) {

    var producto = productos[index];

    if (!producto) {
        callback(false);
        return;
    }
    producto.numero_factura = parametros.numero_factura;
    producto.codigo_proveedor_id = parametros.codigo_proveedor_id;
    
    G.Q.ninvoke(that.m_facturacion_proveedores, 'ingresarFacturaDetalle', producto).then(function(resultado) {
       
        setTimeout(function() {
            index++;
            __insertarDetalle(that, index, productos, parametros, callback);
        }, 3);
        
    }).fail(function(err) {
        console.log("Error __insertarDetalle",err);
        callback(true);
        return;
    }).done();
}

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo privado encargado de obtener los impuestos de los proveedores                                             
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __impuestoProveedor(impuesto,impuestoProveedor,resultado, callback){
    resultado.rtf=0;
    resultado.ica=0;
    resultado.iva=0;
    if (impuesto.sw_rtf === '2' || impuesto.sw_rtf === '3')
        resultado.rtf=impuestoProveedor.porcentaje_rtf;
    if (impuesto.sw_ica === '2' || impuesto.sw_ica === '3')
        resultado.ica=impuestoProveedor.porcentaje_ica;
    if (impuesto.sw_reteiva === '2' || impuesto.sw_reteiva === '3')
        resultado.iva=impuestoProveedor.porcentaje_reteiva;
  callback(false, resultado);
  return;
}

/**
 * @author Andres Mauricio Gonzalez
 * +Descripcion  Metodo privado encargado de obtener los impuestos de los proveedores  y valores totales                                           
 * @fecha 2017-05-08 (YYYY-MM-DD)
 */
function __impuestos(that, index, productos, impuesto, resultado, cabecera, callback) {
 
    var producto = productos[index];
    if (!producto) {

        if (impuesto.sw_rtf === '2' || impuesto.sw_rtf === '3')
            if (resultado._subTotal >= parseInt(impuesto.base_rtf)) {
                resultado.valorRetFte = Math.round(resultado._subTotal * (cabecera.porcentajeRtf / 100));
            } else {
                resultado.valorRetFte = 0;
            }

        if (impuesto.sw_ica === '2' || impuesto.sw_ica === '3')
            if (resultado._subTotal >= parseInt(impuesto.base_ica)) {
                resultado.valorRetIca = Math.round(resultado._subTotal * (cabecera.porcentajeIca / 1000));
            } else {
                resultado.valorRetIca = 0;
            }
        if (impuesto.sw_reteiva === '2' || impuesto.sw_reteiva === '3')
            if (resultado.subtotal >= parseInt(impuesto.base_reteiva)) {
                resultado.valorRetIva = Math.round(resultado._iva* (cabecera.porcentajeReteiva / 100));
            } else {
                resultado.valorRetIva = 0;
            }
            
         if (cabecera.porcentajeCree > 0) {
             resultado.impuesto_cree = ((cabecera.porcentajeCree / 100) * resultado._subTotal);
          }else {
             resultado.impuesto_cree = 0;
          }
        resultado.total = (((((resultado._subTotal+ resultado._iva ) - resultado.valorRetFte) - resultado.valorRetIca) - resultado.valorRetIva) - resultado.impuesto_cree);

        callback(false, [resultado]);
        return;
    }

    index++;
   
    resultado.Total=resultado.Total+(producto.valor * parseInt(producto.cantidad));    
    resultado.porcIva = (producto.porc_iva / 100) + 1;
    resultado.SubTotal = (producto.valor * parseInt(producto.cantidad));    
    resultado.Iva = resultado.Iva + (resultado.SubTotal-(resultado.SubTotal/parseInt(resultado.porcIva)));
    resultado.Cantidad += parseInt(producto.cantidad);
    resultado._subTotal += (producto.valor * parseInt(producto.cantidad))/((producto.porc_iva / 100) + 1);
    resultado._iva += (producto.valor * parseInt(producto.cantidad))- (producto.valor * parseInt(producto.cantidad))/((producto.porc_iva / 100) + 1);

    setTimeout(function() {
        __impuestos(that, index, productos, impuesto, resultado, cabecera, callback);
    }, 3);

};



FacturacionProveedores.$inject = ["m_facturacion_proveedores"];
//, "e_facturacion_clientes", "m_usuarios"
module.exports = FacturacionProveedores;
