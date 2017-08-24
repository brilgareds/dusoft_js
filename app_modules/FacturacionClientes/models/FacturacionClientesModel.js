var FacturacionClientesModel = function (m_e008) {
    this.m_e008 = m_e008;
};
var logger = G.log.getLogger('facturacion_clientes');
/**
 * @fecha 2017/06/01
 * +Descripcion Metodo encargado de actualizar el estado de proceso de un pedido
 *              para que este no se tenga en cuenta cuando se desee facturar de nuevo
 *              por rango de fechas los pedidos de cosmitet
 * @author Cristian Ardila
 */
FacturacionClientesModel.prototype.actualizarEstadoProcesoPedido = function(obj, callback){
    
    var query = G.knex("ventas_ordenes_pedidos")
        .where(function(){
            this.andWhere("pedido_cliente_id",obj.pedido_cliente_id)
        }).update({estado_proceso: '1'});
             
    query.then(function(resultado){       
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarEstadoProcesoPedido]: ", err);        
        callback({err:err, msj: "Error al actualizar el estado de proceso del pedido"});
    });    
};

/**
 * @fecha 2017/06/01
 * +Descripcion Metodo encargado de actualizar el estado de proceso de la factura
 *              cuando el contrab ya se ha ejecutado
 * @author Cristian Ardila
 */
FacturacionClientesModel.prototype.actualizarEstadoProcesoFacturacion = function(obj, callback){
    
    var parametros = {estado: obj.estado, fecha_creacion: 'now()'};
        
    if(obj.estado === '3'){
        parametros = {estado: obj.estado, 
            fecha_creacion: 'now()', 
            factura_fiscal: obj.factura_fiscal,
            prefijo: obj.prefijo
        };
    }
    var query = G.knex("proceso_facturacion")
        .where(function(){
            this.andWhere("id",obj.id)
        }).update(parametros);
             
    query.then(function(resultado){                   
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarEstadoProcesoFacturacion]: ", err);        
        callback({err:err, msj: "Error al actualizar el estado de proceso de la factura"});
    });    
};

/**
 * @author Cristian Ardila
 * @fecha 31/05/2016
 * +Descripcion Modelo encargado consultar la factura en estado de proceso
 * @controller FacturacionClientes.prototype.generarFacturasAgrupadas
 */
FacturacionClientesModel.prototype.procesosFacturacion = function (obj,callback) {
    
    var columnas = [G.knex.raw("a.*"),
        G.knex.raw("case when a.estado=1 then 'Procesando' \
        when a.estado=2 then 'Error'\
        when a.estado=3 then 'Terminado'  \
        when a.estado=4 then 'Facturando' end as descripcion_estado_facturacion"),
        G.knex.raw("(SELECT e.razon_social FROM empresas as e WHERE e.empresa_id = a.empresa_id) as nombre_empresa"),
        G.knex.raw("(SELECT s.nombre FROM system_usuarios as s WHERE s.usuario_id = a.usuario_id) as nombre_usuario")
        
    ];
    var query = G.knex.select(columnas)
        .from('proceso_facturacion as a')
        .where(function(){
            if(obj.filtro === '0'){
                this.andWhere("estado",'1')      
            }
            if(obj.filtro === '1'){
                this.andWhere("factura_fiscal",obj.factura_fiscal)  
                    .andWhere("prefijo",obj.prefijo)
            }
            if(obj.filtro === '2'){
                this.andWhere(G.knex.raw("a.fecha_creacion >= TO_CHAR(now(),'yyyy-mm-dd') or a.fecha_creacion is null"));

            }
        });
        if(obj.filtro !== '2'){
             query.limit(1)
        }
        query.then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [procesosFacturacion]:", err);
        callback({err:err, msj: "Error al consultar los parametros de retencion"});   
    });

};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar el detalle de lo que se facturara
 * @controller FacturacionClientes.prototype.generarFacturasAgrupadas
 */
FacturacionClientesModel.prototype.procesosDetalleFacturacion = function (obj,callback) {

    var query = G.knex.select('*')
        .from('proceso_facturacion_detalle')
        .where(function(){
            this.andWhere("id_proceso",obj.id)
        });
        
        query.then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarParametrosRetencion]:", err);
        callback({err:err, msj: "Error al consultar los parametros de retencion"});   
    });

};

function __consultaDetalleFacturaGenerada(parametros,tabla1,tabla2, campo) {
    
    var columnas = [
        "a.empresa_id",
        "a.prefijo",
        "a.factura_fiscal",
        "a.codigo_producto",
        G.knex.raw("(SELECT codigo_cum FROM inventarios_productos WHERE codigo_producto = a.codigo_producto) AS codigo_cum"),
        G.knex.raw("(SELECT codigo_invima FROM inventarios_productos WHERE codigo_producto = a.codigo_producto) AS codigo_invima"),
        G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion"),
        G.knex.raw("(a.cantidad) as cantidad"),
        G.knex.raw("TO_CHAR(a.fecha_vencimiento,'yyyy-mm-dd') AS fecha_vencimiento"),
        "a.lote",                                      
        G.knex.raw("(f.costo * a.cantidad ) as costo"),
        G.knex.raw("to_char(round(a.valor_unitario,2),'LFM9,999,999.00') as valor_unitario"),
        G.knex.raw("a.valor_unitario as valor_unitario2"),
        G.knex.raw("round(a.porc_iva,2) as porc_iva"),
        G.knex.raw("to_char(round((a.valor_unitario * a.cantidad),2),'LFM9,999,999.00') as subtotal"),
        G.knex.raw("(a.valor_unitario * a.cantidad) as subtotal2"),
        G.knex.raw("(a.valor_unitario * a.cantidad) as subtotal_factura"),
        G.knex.raw("to_char((a.valor_unitario*(a.porc_iva/100)),'LFM9,999,999.00') as iva"),
        G.knex.raw("((a.valor_unitario * (a.porc_iva/100))* a.cantidad) as iva_total"),         
        G.knex.raw("to_char((a.valor_unitario+(a.valor_unitario*(a.porc_iva/100))),'LFM9,999,999.00') as valor_unitario_iva"),
        G.knex.raw("to_char((((a.cantidad))*(a.valor_unitario+(a.valor_unitario*(a.porc_iva/100)))),'LFM9,999,999.00') as total"),
        "c.observacion",
        "e.sw_medicamento",
        "e.sw_insumos", 
        G.knex.raw(campo)
    ];
    var consulta = G.knex.select(columnas)
        .from(tabla1)
        .join(tabla2, function () {
            this.on("b.factura_fiscal", "a.factura_fiscal")
                .on("b.prefijo", "a.prefijo")
                .on("b.empresa_id","a.empresa_id")
        }).join('ventas_ordenes_pedidos as c', function () {
            this.on("c.pedido_cliente_id", campo === "1" ? "b.pedido_cliente_id" : "a.pedido_cliente_id")
            .on("c.empresa_id","b.empresa_id")
        }).innerJoin('inventarios_productos as d', function () {
            this.on("a.codigo_producto", "d.codigo_producto")

        }).innerJoin('inv_grupos_inventarios as e', function () {
            this.on("d.grupo_id","e.grupo_id")

        }).innerJoin('inventarios as f', function () {
            this.on("d.codigo_producto","f.codigo_producto")
                    .on("a.empresa_id","f.empresa_id")

        }).where(function () {

            this.andWhere('a.empresa_id', parametros.empresa_id)
                .andWhere('a.factura_fiscal', parametros.factura_fiscal)
                .andWhere('a.prefijo', parametros.prefijo) 


        });
        if(campo === "1"){
                consulta.as("a");
        }
    return consulta;

};

/**
 * +Descripcion Modelo encargado de consultar el detalle de la factura generada
 * @author Cristian Ardila
 * @fecha 19/05/2017
 */
FacturacionClientesModel.prototype.consultaDetalleFacturaGenerada = function (obj,totalizar,callback) {
     
    var colQuery = [G.knex.raw("a.*")];   
    
    if(totalizar === 1){
        
        colQuery = [
            "codigo_producto", 
            "descripcion", 
            "lote",  
            "fecha_vencimiento",
            "codigo_cum",
            "codigo_invima",       
            G.knex.raw("sum(cantidad) as cantidad"),                                           
            G.knex.raw("to_char(round(sum(valor_unitario2),2),'LFM9,999,999.00') as valor_unitario"),
            G.knex.raw("to_char(round(sum(subtotal2),2),'LFM9,999,999.00') as subtotal"),
            G.knex.raw("sum(porc_iva) as porc_iva")
        ]; 
        
    }
    var queryA = __consultaDetalleFacturaGenerada(obj,
        "inv_facturas_despacho as b",
        'inv_facturas_despacho_d as a',
        "1")
        .unionAll(__consultaDetalleFacturaGenerada(obj,
        "inv_facturas_agrupadas_despacho as b",
        'inv_facturas_agrupadas_despacho_d as a',
        "2")
    );
  
    var query = G.knex.column(colQuery)
        .from(queryA) 
        if(totalizar === 1){
            query.groupBy("codigo_producto", 
                "descripcion", 
                "lote",  
                "fecha_vencimiento",
                "codigo_cum",
                "codigo_invima"
            )
        }
    
    
    query.then(function(resultado){          
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultaDetalleFacturaGenerada]: ", err);     
        callback({err:err, msj: "Error al consultar los productos de la factura generada]"});   
    });  
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.listarTiposTerceros = function (callback) {

    G.knex.column('tipo_id_tercero as id', 'descripcion')
        .select()
        .from('tipo_id_terceros')
        .orderBy('tipo_id_tercero', 'asc')
        .then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
            console.log("err [listarTipoDocumento]:", err);
            callback({err:err, msj: "Error al consultar la lista de los tipos de terceros"});   
        });
};

/**
 * +Descripcion Metodo encargado de obtener los pedidos agrupados en una sola
 *              factura
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.consultarPedidosFacturaAgrupada = function(parametros, callback){
    
    var query = G.knex.distinct('pedido_cliente_id')
        .select()
        .from('inv_facturas_agrupadas_despacho_d')
        .where(parametros);     
 
    query.then(function(resultado){    
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultarPedidosFacturaAgrupada]: ", err);     
        callback({err:err, msj: "Error al consultar los pedidos de la factura agrupada]"});   
    }); 
};

/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los prefijos de las facturas
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.listarPrefijosFacturas = function (obj,callback) {

    G.knex.column([G.knex.raw('prefijo as id'),
        G.knex.raw('prefijo as descripcion'),
        "empresa_id",
        "numeracion",
        "documento_id"
        ])      
        .select()
        .from('documentos')
        .where(function () {
            this.andWhere("tipo_doc_general_id",'FV01')
            if(obj.estado ===0){
                this.andWhere("empresa_id", obj.empresaId);
            }else{
                this.andWhere("documento_id", obj.documentoId);
            }
        }).then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
            console.log("err [listarPrefijosFacturas]:", err);
            callback({err:err, msj: "Error al consultar la lista de los prefijos"});   
        });

};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.listarClientes = function (obj, callback) {

    var columnas = [G.knex.raw("DISTINCT a.tipo_id_tercero as tipo_id_tercero"),
        "a.tercero_id",
        "a.direccion",
        "a.telefono",
        "a.email",
        "a.nombre_tercero",
        "a.tipo_bloqueo_id",
        "f.departamento",
        "g.pais",
        "municipio",
        G.knex.raw("COALESCE(cntrtos.contrato_cliente_id,(SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')) as contrato_cliente_id")
    ];

    var query = G.knex.select(columnas)
        .from('terceros as a')
        .innerJoin('terceros_clientes as b', function () {
            this.on("a.tipo_id_tercero", "b.tipo_id_tercero")
                    .on("a.tercero_id", "b.tercero_id")
        }).leftJoin('inv_tipos_bloqueos as c', function () {
            this.on("a.tipo_bloqueo_id", "c.tipo_bloqueo_id")

        }).leftJoin('vnts_contratos_clientes as cntrtos', function () {
            this.on("a.tipo_id_tercero", "cntrtos.tipo_id_tercero")
                .on("a.tercero_id", "cntrtos.tercero_id")
                .on('cntrtos.empresa_id', "b.empresa_id")
                 
        }).join('inv_bodegas_movimiento_despachos_clientes as d', function () {
            this.on("a.tipo_id_tercero", "b.tipo_id_tercero")
                .on("a.tercero_id", "d.tercero_id")
        }).leftJoin('tipo_mpios as e', function () {
            this.on("a.tipo_pais_id", "e.tipo_pais_id")
                .on("a.tipo_dpto_id", "e.tipo_dpto_id")
                .on("a.tipo_mpio_id", "e.tipo_mpio_id")
        }).leftJoin('tipo_dptos as f', function () {
            this.on("e.tipo_pais_id", "f.tipo_pais_id")
                .on("e.tipo_dpto_id", "f.tipo_dpto_id")

        }).leftJoin('tipo_pais as g', function () {
            this.on("f.tipo_pais_id", "g.tipo_pais_id")
        }).groupBy("a.tipo_id_tercero",
            "a.tercero_id", "a.direccion", "a.telefono",
            "a.email", "a.nombre_tercero", "a.tipo_bloqueo_id",
            "c.descripcion", "g.pais", "f.departamento", "municipio","contrato_cliente_id"
        ).orderBy("a.nombre_tercero")
        .where(function () {

            if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !== "") {
                this.andWhere(G.knex.raw("a.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
            }
            if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
                this.andWhere(G.knex.raw("a.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
            }
        }).andWhere('b.empresa_id', obj.empresaId)
          .andWhere("cntrtos.estado",1)

    query.limit(G.settings.limit).
        offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {
        console.log("resultado [listarClientes]:", resultado);
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarClientes]:", err);
       callback({err:err, msj: "Error al consultar la lista de los clientes"});   
    });

};

/**
 * +Descripcion Campos en comun para la consulta que tiene dos union
 *              para listar las facturas generadas
 * @fecha 17/05/2017
 * @author Cristian Ardila
 */
function __camposListaFacturasGeneradas() {

    var colSubQuery2 = [
        "a.empresa_id",
        "a.factura_fiscal",
        "a.prefijo",
        "a.documento_id",
        "i.descripcion",
        "i.texto1",
        "i.texto2",
        "i.texto3",
        "i.mensaje",
        "a.tipo_id_tercero",
        "a.tercero_id",
        "c.nombre_tercero",
        "c.direccion",
        "c.telefono",
        G.knex.raw("h.pais||'-'||g.departamento ||'-'||f.municipio as ubicacion"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'yyyy-mm-dd hh:mm:ss') AS fecha_registro"),
        "a.usuario_id",
        "a.valor_total",
        "a.saldo",
        "a.observaciones",
        G.knex.raw("TO_CHAR(a.fecha_vencimiento_factura,'YYYY-MM-DD') AS fecha_vencimiento_factura"),
        "a.porcentaje_rtf",
        "a.porcentaje_ica",
        "a.porcentaje_reteiva",
        "e.razon_social",
        "e.tipo_id_tercero as tipo_id_empresa",
        "e.id",
        G.knex.raw("e.direccion as direccion_empresa"),
        G.knex.raw("e.telefonos as telefono_empresa"),
        "e.digito_verificacion",
        G.knex.raw("l.pais as pais_empresa"),
        G.knex.raw("k.departamento as departamento_empresa"),
        G.knex.raw("j.municipio as municipio_empresa"),
        G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY') as anio_factura"),
        "m.subtotal",
        "m.iva_total",
    ];

    return colSubQuery2;
};

/**
 * +Descripcion Consulta que se reutilizara para una consulta mayor con dos
 *              uniones
 * @author Cristian Ardila
 * @fecha 17/05/2017
 */
function __consultaAgrupada(tabla1, estado, columna, query, filtro) {
 
    var consulta = G.knex.select(columna)
        .from(tabla1)
        .join('terceros as c', function () {
            this.on("a.tipo_id_tercero", "c.tipo_id_tercero")
                    .on("a.tercero_id", "c.tercero_id")
        }).join('system_usuarios as d', function () {
            this.on("a.usuario_id", "d.usuario_id")
        }).join('empresas as e', function () {
            this.on("a.empresa_id", "e.empresa_id")
        }).join('tipo_mpios as f', function () {
            this.on("c.tipo_pais_id", "f.tipo_pais_id")
            .on("c.tipo_dpto_id", "f.tipo_dpto_id")
            .on("c.tipo_mpio_id", "f.tipo_mpio_id")
        }).join('tipo_dptos as g', function () {
            this.on("f.tipo_pais_id", "g.tipo_pais_id")
            .on("f.tipo_dpto_id", "g.tipo_dpto_id")
        }).join('tipo_pais as h', function () {
            this.on("g.tipo_pais_id", "h.tipo_pais_id")
        }).join('tipo_mpios as j', function () {
            this.on("e.tipo_pais_id ", "j.tipo_pais_id")
            .on("e.tipo_dpto_id", "j.tipo_dpto_id")
            .on("e.tipo_mpio_id", "j.tipo_mpio_id")
        }).join('tipo_dptos as k', function () {
            this.on("j.tipo_pais_id", "k.tipo_pais_id")
            .on("j.tipo_dpto_id", "k.tipo_dpto_id")
        }).join('tipo_pais as l', function () {
            this.on("k.tipo_pais_id", "l.tipo_pais_id")
        }).join(query, function () {
            this.on("m.empresa_id", "a.empresa_id")
            .on("m.prefijo", "a.prefijo")
            .on("m.factura_fiscal", "a.factura_fiscal")
        }).join('documentos as i', function () {
            this.on("a.empresa_id", "i.empresa_id")
            .on("a.documento_id", "i.documento_id")
        }).where(function () {
            this.andWhere('a.empresa_id', filtro.empresa_id)
            .andWhere('c.nombre_tercero', G.constants.db().LIKE, "%" + filtro.nombreTercero + "%")
            .andWhere('a.tercero_id', G.constants.db().LIKE, "%" + filtro.terceroId + "%");//
            if (filtro.factura_fiscal !== "") {
                this.andWhere('a.factura_fiscal', filtro.factura_fiscal);
            }
            if (filtro.prefijo !== "") {
                this.andWhere('a.prefijo', filtro.prefijo);
            }
            if (filtro.tipoIdTercero !== "") {
                this.andWhere('a.tipo_id_tercero', filtro.tipoIdTercero)
            }
            if (filtro.pedidoClienteId !== "") {
                this.andWhere('a.pedido_cliente_id', filtro.pedidoClienteId);
            }
        });
       
    if (estado === 0) {

        consulta.join('vnts_vendedores as b', function () {
            this.on("a.tipo_id_vendedor", "b.tipo_id_vendedor")
            .on("a.vendedor_id", "b.vendedor_id")
        });

        consulta.join('ventas_ordenes_pedidos as pedi', function () {
            this.on("pedi.empresa_id", "a.empresa_id")
            .on("pedi.pedido_cliente_id", "a.pedido_cliente_id")
            .on("pedi.tercero_id", "a.tercero_id")
            .on("pedi.tipo_id_tercero", "a.tipo_id_tercero")

        }).as("a");

    }
    return consulta;
};

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.listarFacturasGeneradas = function (filtro, callback) {
    
    var colQuery = [G.knex.raw("a.*"),
        "b.estado",
        G.knex.raw("case when b.estado=0 then 'Sincronizado' else 'NO sincronizado' end as descripcion_estado"),
        "b.mensaje"
    ];

    var colSubQuery2 = __camposListaFacturasGeneradas();
    colSubQuery2.push(G.knex.raw("'0' as factura_agrupada"));
    colSubQuery2.push("a.tipo_id_vendedor");
    colSubQuery2.push("a.vendedor_id");
    colSubQuery2.push("b.nombre");
    colSubQuery2.push("pedi.observacion");
    colSubQuery2.push("a.pedido_cliente_id");

    var colSubQuery2B = __camposListaFacturasGeneradas();
    colSubQuery2B.push(G.knex.raw("'1' as factura_agrupada"));
    colSubQuery2B.push(G.knex.raw("(SELECT bb.tipo_id_vendedor\
        FROM inv_facturas_agrupadas_despacho_d bb \
        WHERE  bb.empresa_id = a.empresa_id and bb.prefijo = a.prefijo \
        AND bb.factura_fiscal = a.factura_fiscal limit 1 ) as tipo_id_vendedor"));
    colSubQuery2B.push(G.knex.raw("(SELECT cc.vendedor_id \
        FROM inv_facturas_agrupadas_despacho_d cc \
        WHERE cc.empresa_id = a.empresa_id \
        AND cc.prefijo = a.prefijo \n\
        AND cc.factura_fiscal = a.factura_fiscal limit 1 ) as vendedor_id"));
    colSubQuery2B.push(G.knex.raw("(SELECT ee.nombre\
        FROM inv_facturas_agrupadas_despacho_d dd\
        INNER JOIN vnts_vendedores ee on dd.tipo_id_vendedor = ee.tipo_id_vendedor and dd.vendedor_id = ee.vendedor_id\
        WHERE dd.empresa_id = a.empresa_id and dd.prefijo = a.prefijo and dd.factura_fiscal = a.factura_fiscal limit 1 ) as nombre"));
    colSubQuery2B.push(G.knex.raw("'' as observacion"));
    colSubQuery2B.push(G.knex.raw("0 as pedido_cliente_id"));

    var colSubQuery1 = ["a.empresa_id",
        "a.prefijo",
        "a.factura_fiscal",
        G.knex.raw("SUM((valor_unitario*cantidad)) as subtotal"),
        G.knex.raw("SUM(((valor_unitario*cantidad)*(porc_iva/100))) as iva_total")
    ];
 
    var subQuery1 = G.knex.column(colSubQuery1).select().from("inv_facturas_despacho_d as a").groupBy("a.empresa_id", "a.prefijo", "a.factura_fiscal").as("m");

    var subQuery1B = G.knex.column(colSubQuery1).select().from("inv_facturas_agrupadas_despacho_d as a").groupBy("a.empresa_id", "a.prefijo", "a.factura_fiscal").as("m");
 
    var subQuery2 = __consultaAgrupada("inv_facturas_despacho as a",
        0,
        colSubQuery2,
        subQuery1,
        filtro)
        .union(__consultaAgrupada("inv_facturas_agrupadas_despacho as a",
            1,
            colSubQuery2B,
            subQuery1B,
            filtro)
        );

    var query = G.knex.column(colQuery)
        .from(subQuery2)
        .leftJoin("logs_facturacion_clientes_ws_fi as b ", function () {
            this.on("a.prefijo", "b.prefijo")
                .on("a.factura_fiscal", "b.factura_fiscal")
                .on(G.knex.raw("b.prefijo_nota IS NULL"))
        }).orderBy("fecha_registro", "desc");

    query.limit(G.settings.limit).
            offset((filtro.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarFacturasGeneradas] ", err);
        callback({err:err, msj: "Error al consultar la lista de las facturas generadas"});   
    });
};



/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.consultarDocumentosPedidos = function(obj,callback) {
   
    var campos = [G.knex.raw(" x.pedido_cliente_id"),  "x.numero", "x.prefijo", "x.empresa_id"];
    if(obj.estado ===1){
        campos = [G.knex.raw(" x.pedido_cliente_id as bodegas_doc_id"),  "x.numero", "x.prefijo", G.knex.raw("x.empresa_id as empresa")];
    }
    
    var query = G.knex.column(campos)
        .select().from("inv_bodegas_movimiento_despachos_clientes as x")
        .where("x.factura_gener",'0')
        .andWhere("x.empresa_id",obj.empresaId)
        .andWhere("x.pedido_cliente_id",obj.pedidoClienteId)
        .as("b");                        
   
        query.then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarDocumentosPedidos]:", err);
        callback({err:err, msj: "Error al consultar la lista de documentos"});   
    });
                  
};





/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los pedidos para generar la factura
 *              correspondiente
 * @fecha 2017-10-05
 */
FacturacionClientesModel.prototype.listarPedidosClientes = function (obj, callback) {
      
    var formato = 'YYYY-MM-DD';
      
    var columnQuery = [
        "a.tipo_id_tercero",
        "a.tercero_id",
        "c.nombre_tercero",
        "c.direccion",
        "a.pedido_cliente_id",
        "a.fecha_registro",
        "a.tipo_id_vendedor",
        "a.vendedor_id",
        "a.empresa_id",
        "d.nombre",
        "a.observacion",
        "c.telefono",
        "a.seleccionado"
   ];
   
    var subQuery1 = G.knex.column([G.knex.raw("DISTINCT x.pedido_cliente_id")/*,  "x.numero", "x.prefijo"*/ ])
        .select().from("inv_bodegas_movimiento_despachos_clientes as x")
        .where(function(){
            this.andWhere("x.factura_gener",'0')
            .andWhere("x.empresa_id",obj.empresaId)
            if(obj.pedidoClienteId !== "") {
                this.andWhere('x.pedido_cliente_id', obj.pedidoClienteId);
            }
        }).as("b"); 
           
    var query = G.knex.select(columnQuery)
        .from("ventas_ordenes_pedidos as a")
        .join(subQuery1, function () {
            this.on("a.pedido_cliente_id","b.pedido_cliente_id")
        })
        .join("terceros as c", function(){      
            this.on("a.tipo_id_tercero","c.tipo_id_tercero")
                .on("a.tercero_id","c.tercero_id")
        })
        .join("vnts_vendedores as d", function(){
            this.on("a.tipo_id_vendedor","d.tipo_id_vendedor")
                .on("a.vendedor_id","d.vendedor_id")
        })
        .where(function () {
            if(obj.tipoIdTercero !== ""){
                this.andWhere('a.tipo_id_tercero', obj.tipoIdTercero)
                .andWhere('a.tercero_id',obj.terceroId); 
            }
            this.andWhere('a.pedido_multiple_farmacia', obj.pedidoMultipleFarmacia);
            if(obj.pedidoMultipleFarmacia === '1'){
                var fechaFinal = G.moment(obj.fechaFinal).format(formato);
                var _fechaFinal = G.moment(fechaFinal).add(1, 'day').format(formato);
                this.where(G.knex.raw("a.fecha_registro between '"+ obj.fechaInicial + "' and '"+ _fechaFinal +"'"))
                .andWhere("estado_proceso",obj.estadoProcesoPedido)
            }
        }).orderBy("a.fecha_registro",'desc')
     
    if(obj.procesoFacturacion === 1){
        query.limit(G.settings.limit).offset((obj.paginaActual - 1) * G.settings.limit)
    }
    
    console.log("query ", query.toSQL());
    
    query.then(function (resultado) {      
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarPedidosClientes] ", err);
        callback({err:err, msj: "Error al consultar la lista de los pedidos"});   
    });
};
 
 
/**
 * @author Eduar Garcia
 * +Descripcion Listar documentos sin facturar
 * @fecha 2017-24-07
 */
FacturacionClientesModel.prototype.listarDocumentosPorFacturar = function (obj, callback) {
    
    var columnQuery = [
        "a.prefijo",
        "a.numero",
        "b.tipo_id_tercero",
        "b.tercero_id",
        "b.fecha_registro",
        "b.pedido_cliente_id",
        "b.empresa_id"
    ];
             
    var query = G.knex.select(columnQuery).
    from("inv_bodegas_movimiento_despachos_clientes as a").
    join("ventas_ordenes_pedidos as b", function () {
        this.on("a.pedido_cliente_id","b.pedido_cliente_id");
    }).
    where("a.numero",G.constants.db().LIKE, "%" + obj.numeroDocumento + "%" ).
    andWhere("b.tipo_id_tercero", obj.tipoTerceroId).
    andWhere("b.tercero_id", obj.terceroId).
    andWhere("a.factura_gener", "0").
    orderBy("a.fecha_registro",'desc').
    then(function (resultado) {      
        callback(false, resultado);
    }).catch(function (err) {
        console.log("err [listarPedidosClientes] ", err);
        callback({err:err, msj: "Error al consultar la lista de los pedidos"});   
    });
};

/**
 * @author Eduar Garcia
 * @fecha  26/07/2017
 * +Descripcion Permite traer el documento con datos de facturacion de consumo
 */
FacturacionClientesModel.prototype.obtenerDetallePorFacturar = function(obj, callback){
     
    var parametros = [];
    
    var parametrosGrup = ["a.codigo_producto", 
                "a.fecha_vencimiento", 
                "a.lote",
                "a.prefijo", 
                "a.numero",            
                "c.porc_iva"];
    
    if(obj.estado === 1){
        parametros.push(G.knex.raw("distinct on (a.codigo_producto, a.fecha_vencimiento, a.lote, a.valor_unitario) a.prefijo"))
        parametros.push(G.knex.raw("round(sum(a.cantidad))::integer as cantidad_despachada")),
        parametros.push(G.knex.raw("round(sum(a.cantidad_pendiente_por_facturar))::integer as cantidad_pendiente_por_facturar")),
        parametros.push(G.knex.raw("split_part(coalesce(fc_precio_producto_contrato_cliente('"+obj.contratoClienteId+"', a.codigo_producto, '"+obj.empresa_id+"' ),'0'), '@', 1) as valor_unitario")),       
        parametros.push(G.knex.raw("coalesce((SELECT sum(cantidad_despachada)\
            FROM inv_facturas_xconsumo_tmp_d as tmp\
            WHERE tmp.codigo_producto = a.codigo_producto AND tmp.lote = a.lote\
            AND tmp.empresa_id = '" + obj.empresa_id + "'\
            AND tmp.prefijo = '"+obj.prefijo_documento +"'\
            AND tmp.factura_fiscal = " + obj.numero_documento + "), 0)::integer as cantidad_tmp_despachada"));

        parametrosGrup.push("cantidad_tmp_despachada");
        parametrosGrup.push("a.valor_unitario");
    }
    
    parametros.push("a.numero"),
    parametros.push("a.codigo_producto"),
    parametros.push(G.knex.raw("fc_descripcion_producto(a.codigo_producto) as descripcion")),
    parametros.push("a.lote"),
    parametros.push(G.knex.raw("TO_CHAR(a.fecha_vencimiento,'yyyy-mm-dd') as fecha_vencimiento")),
    parametros.push("c.porc_iva")

    if(obj.estado === 0){
       parametros.push(G.knex.raw("(round(a.cantidad) - a.cantidad_facturada) as cantidad"));
       parametros.push("a.numero_caja");
       parametros.push("a.movimiento_id");
       parametros.push("a.prefijo");
    }
    
    var query = G.knex.column(parametros).from("inv_bodegas_movimiento_d as a").
        innerJoin("inv_bodegas_movimiento_despachos_clientes as b", function (){
            this.on("a.numero","b.numero").
            on("a.prefijo", "b.prefijo");
    }).innerJoin("inventarios_productos as c", function (){
            this.on("c.codigo_producto","a.codigo_producto")
    }).where(function(){
        this.andWhere("a.empresa_id", obj.empresa_id)
            .andWhere("a.prefijo", obj.prefijo_documento)
            .andWhere("a.numero", obj.numero_documento);
        if(obj.estado === 0){
             this.andWhere(G.knex.raw("round(a.cantidad) > a.cantidad_facturada"))
        }
    }).as("a")
    
    if(obj.estado === 1){
        query.groupBy(parametrosGrup);
    }
    
    
    var query2 = G.knex.select(G.knex.raw("a.*")).from(query)
        
    if(obj.estado === 0){
        query2.orderBy("a.cantidad","desc");
    } 
    
    if(obj.estado === 1){
        query2 = G.knex.select(G.knex.raw(["a.*", 
        G.knex.raw("case when  a.cantidad_pendiente_por_facturar = 0 then 0 else 1 end as estado_entrega") ])).from(query)
         
    }
    query2.then(function(resultado){
        console.log("resultado >>>>>> ", resultado);
        callback(false, resultado);   
    }).catch(function(err) { 
        console.log("err ", err);
        callback({status:err.status || 500, msj:err.msj || "Ha ocurrido un error"});
    });        
};

/**
 * 
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.consultarTerceroContrato = function (obj, callback) {
  
   var columnQuery = [
        "a.tipo_id_tercero",
        "a.tercero_id",
        "e.nombre_tercero",
        "e.direccion",
        "e.telefono",
        "a.observacion",
        "a.tipo_cliente",
        "a.cuenta_contable",
        G.knex.raw("CASE WHEN a.sw_rtf = '1' THEN a.porcentaje_rtf ELSE 0 END as porcentaje_rtf"),
        G.knex.raw("CASE  WHEN a.sw_ica = '1' THEN a.porcentaje_ica ELSE 0 END as porcentaje_ica"),
        G.knex.raw("CASE WHEN a.sw_reteiva = '1' THEN a.porcentaje_reteiva ELSE 0 END as porcentaje_reteiva"),
        G.knex.raw("CASE WHEN a.sw_cree = '1' THEN a.porcentaje_cree ELSE 0 END as porcentaje_cree"),
        G.knex.raw("CASE WHEN c.condiciones_cliente IS NOT NULL THEN c.condiciones_cliente WHEN d.condiciones_cliente IS NOT NULL THEN d.condiciones_cliente\
        ELSE (SELECT condiciones_cliente FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1' ) END as condiciones_cliente"),
        G.knex.raw("CASE WHEN c.contrato_cliente_id IS NOT NULL THEN c.contrato_cliente_id WHEN d.contrato_cliente_id IS NOT NULL THEN d.contrato_cliente_id\
        ELSE (SELECT contrato_cliente_id FROM vnts_contratos_clientes WHERE estado = '1' and contrato_generico = '1')  END as contrato"),        
        G.knex.raw("CASE WHEN c.contrato_cliente_id IS NOT NULL THEN 'Contrato: <b>TERCERO - CLIENTE</b>' WHEN d.contrato_cliente_id IS NOT NULL\
        THEN 'Contrato: UNIDAD DE NEGOCIO: <b>'||b.descripcion||'</b>' ELSE 'Contrato: <b>GENERICO</b>' END as tipo_contrato"),
        G.knex.raw("CASE WHEN c.vendedor_id IS NOT NULL THEN c.tipo_id_vendedor||'@'||c.vendedor_id WHEN d.vendedor_id IS NOT NULL\
        THEN d.tipo_id_vendedor||'@'||d.vendedor_id END as vendedor_id"),        
        "c.facturar_iva"
   ];
    
   var query = G.knex.select(columnQuery)
        .from("terceros_clientes as a")
          .leftJoin("unidades_negocio as b", function () {
            this.on("a.codigo_unidad_negocio","b.codigo_unidad_negocio")
        }).leftJoin("vnts_contratos_clientes as c", function () {
            this.on("a.tipo_id_tercero","c.tipo_id_tercero")
            .on("a.tercero_id","c.tercero_id")
            .on(G.knex.raw("a.empresa_id = '"+obj.empresaId+"' "))// + obj.empresaId
            .on(G.knex.raw("c.estado = '1'"))
        }).leftJoin("vnts_contratos_clientes as d", function () {
            this.on("a.codigo_unidad_negocio","d.codigo_unidad_negocio")
            .on(G.knex.raw("d.empresa_id = '"+obj.empresaId+"' "))//+ obj.empresaId
            .on(G.knex.raw("d.estado = '1'"))
        }).join("terceros as e", function(){
            this.on("a.tipo_id_tercero","e.tipo_id_tercero")
            .on(G.knex.raw("a.empresa_id = '"+obj.empresaId+"' "))//
            .on("a.tercero_id","e.tercero_id")
        }).where(function(){
            this.andWhere("a.tipo_id_tercero", obj.tipoIdTercero)
            .andWhere("a.tercero_id", obj.terceroId)
        });

   query.then(function(resultado) {      
        callback(false, resultado);
    }).catch(function (err) {
        console.log("__________________ ");
        console.log(query.toSQL());
	console.log("__________________ ");
        console.log("err [consultarTerceroContrato] ", err);
        callback({err:err, msj: "Error al consultar el contrato de terceros"});   
    });
   
};


/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar las retenciones segun la empresa
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.consultarParametrosRetencion = function (obj,callback) {

    G.knex.select('*')
        .from('vnts_bases_retenciones')
        .where(function(){
            this.andWhere("estado",'1')
            .andWhere(G.knex.raw("anio = TO_CHAR(NOW(),'YYYY')"))
            .andWhere("empresa_id", obj.empresaId)
        })
        .then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarParametrosRetencion]:", err);
        callback({err:err, msj: "Error al consultar los parametros de retencion"});   
    });

};

 
/**
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de consultar la factura agrupada
 * @controller FacturacionClientes.prototype.generarFacturaAgrupada
 */
FacturacionClientesModel.prototype.consultarFacturaAgrupada = function (obj,callback) {

    G.knex.select('*')
        .from('inv_facturas_agrupadas_despacho')
        .where(function(){
            this.andWhere("empresa_id",obj.empresa_id)
            .andWhere("prefijo", obj.id)
            .andWhere("factura_fiscal", obj.numeracion)
        })
        .then(function (resultado) {
            callback(false, resultado)
        }).catch(function (err) {
        console.log("err [consultarFacturaAgrupada]:", err);
        callback({err:err, msj: "Error al consultar la factura agrupada"});   
    });

};

/**
 * +Descripcion Funcion encarhada de consultar la ip autorizada para generar
 *              facturas
 * @fecha 2017-05-08
 * @author Cristian Ardila
 */
FacturacionClientesModel.prototype.consultarDireccionIp = function(obj, callback){
 console.log("obj.direccionIp",obj.direccionIp);
    G.knex.select('*')
    .from('pc_crea_facturacion')
    .where("ip", obj.direccionIp)
    .then(function (resultado) {
         callback(false, resultado)
    }).catch(function (err) {
        console.log("err [consultarDireccionIp]:", err);
    callback({err:err, msj: "Error al consultar la direccion Ip"});   
    });


};

/**
 * +Descripcion Metodo encargado de registrar la direccion ip en el 
 * @param {type} obj
 * @param {type} transaccion
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.insertarPcFactura = function(obj,transaccion, callback){
   
    var parametros = {ip: obj.parametros.parametros.direccion_ip.replace("::ffff:", ""),
        prefijo: obj.parametros.documento_facturacion[0].id,
        factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
        sw_tipo_factura : obj.swTipoFactura,
        fecha_registro: G.knex.raw('now()'),
        empresa_id: obj.parametros.documento_facturacion[0].empresa_id
    };
        
    var query = G.knex('pc_factura_clientes').insert(parametros);
    
    if(transaccion)
    query.transacting(transaccion);     
    query.then(function(resultado){   
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarPcFactura]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    });
};

/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura
 *              agrupada
 * @author Cristian Manuel Ardila Troches
 * @fecha  2017-05-08
 */
FacturacionClientesModel.prototype.insertarFacturaAgrupada = function(estado,obj,transaccion, callback){
    var parametros;
    
    if(estado === 0){
         parametros = {empresa_id: obj.parametros.documento_facturacion[0].empresa_id,
            tipo_id_tercero: obj.parametros.consultar_tercero_contrato[0].tipo_id_tercero,
            tercero_id: obj.parametros.consultar_tercero_contrato[0].tercero_id,
            factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
            prefijo: obj.parametros.documento_facturacion[0].id,
            documento_id: obj.parametros.documento_facturacion[0].documento_id,
            usuario_id: obj.usuario,
            observaciones: obj.parametros.consultar_tercero_contrato[0].condiciones_cliente,
            porcentaje_rtf: obj.porcentaje_rtf,
            porcentaje_ica: obj.porcentaje_ica,
            porcentaje_reteiva: obj.porcentaje_reteiva,
            porcentaje_cree: obj.porcentaje_cree,
            tipo_pago_id: obj.tipoPago,
            facturacion_cosmitet: obj.facturacion_cosmitet
        };   
    }
    
    if(estado === 1){
        parametros = obj;
    }
    
    var query = G.knex('inv_facturas_agrupadas_despacho').insert(parametros);     
    
    if(transaccion) query.transacting(transaccion);
    query.then(function(resultado){     
        console.log("resultado [insertarFacturaAgrupada]: ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaAgrupada]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    });
};


/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura
 *              agrupada
 * @author Cristian Manuel Ardila Troches
 * @fecha  2017-05-08
 */
FacturacionClientesModel.prototype.insertarFacturaIndividual = function(obj,transaccion, callback){
     
   var parametros = {empresa_id: obj.parametros.documento_facturacion[0].empresa_id,
        tipo_id_tercero: obj.parametros.consultar_tercero_contrato[0].tipo_id_tercero,
        tercero_id: obj.parametros.consultar_tercero_contrato[0].tercero_id,
        factura_fiscal: obj.parametros.documento_facturacion[0].numeracion,
        prefijo: obj.parametros.documento_facturacion[0].id,
        documento_id: obj.parametros.documento_facturacion[0].documento_id,
        usuario_id: obj.usuario,
        tipo_id_vendedor:obj.parametros.parametros.pedido.pedidos[0].vendedor[0].tipo_id_tercero, 
        vendedor_id: obj.parametros.parametros.pedido.pedidos[0].vendedor[0].id, 
        pedido_cliente_id: obj.parametros.parametros.pedido.pedidos[0].numero_cotizacion, 
        observaciones: obj.parametros.consultar_tercero_contrato[0].condiciones_cliente,
        porcentaje_rtf: obj.porcentaje_rtf,
        porcentaje_ica: obj.porcentaje_ica,
        porcentaje_reteiva: obj.porcentaje_reteiva,
        porcentaje_cree: obj.porcentaje_cree,
        tipo_pago_id: obj.tipoPago,
        facturacion_cosmitet: obj.facturacion_cosmitet
    };
     
    var query = G.knex('inv_facturas_despacho').insert(parametros);     
    
    if(transaccion) query.transacting(transaccion);     
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaIndividual]: ", err);     
        callback({err:err, msj: "Error al guardar la factura individual]"});   
    });
};

/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de almacenar los pedidos en proceso de
 *              facturacion
 * @fecha 2017/06/02
 */
FacturacionClientesModel.prototype.insertarFacturaEnProceso = function(obj, callback){
       
     var parametros = {
        id: G.knex.raw('DEFAULT'),
        usuario_id: obj.usuario,
        fecha_inicial: obj.fechaInicial,
        fecha_final: obj.fechaFinal,                       
        estado: '1',
        empresa_id: obj.empresaId,
        tipo_id_cliente:obj.tipoIdTercero,
        cliente_id: obj.terceroId,
        tipo_pago_id:obj.tipoPago,
        ip:obj.direccion_ip
    }; 
       
    var query = G.knex("proceso_facturacion").returning(['id']).insert(parametros);     
      
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaEnProceso]: ", err);     
        callback({err:err, msj: "Error al guardar la factura en proceso]"});   
    }); 
};
/**
 * @author Cristian Ardila
 * +Descripcion Modelo encargado de almacenar los pedidos en proceso de
 *              facturacion
 * @fecha 2017/06/02
 */
FacturacionClientesModel.prototype.insertarFacturaEnProcesoDetalle = function(obj, callback){
       
    var parametros = {
        id: G.knex.raw('DEFAULT'),
        id_proceso: obj.idProceso,
        pedido: obj.pedido_cliente_id,
        tercero_id: obj.vendedor_id,                       
        tipo_id_tercero: obj.tipo_id_vendedor
    }; 
    
    var query = G.knex("proceso_facturacion_detalle").insert(parametros);     
      
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaEnProcesoDetalle]: ", err);     
        callback({err:err, msj: "Error al guardar el detalle de la factura en proceso]"});   
    }); 
};
/**
 * +Descripcion Metodo encargado de insertar el detalle de la factura 
 *              individual
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
function __insertarFacturaIndividualDetalle(obj,transaccion, callback){
      
    var parametros = {
        item_id: G.knex.raw('DEFAULT'),
        prefijo: obj.prefijo,
        factura_fiscal: obj.numeracion,
        observacion: '', 
        codigo_producto: obj.codigo_producto,
        cantidad: parseInt(obj.cantidad),
        fecha_vencimiento: obj.fecha_vencimiento,
        lote: obj.lote,
        valor_unitario: parseInt(obj.valor_unitario),
        empresa_id: obj.empresa_id,
        cantidad_devuelta:parseInt(0),
        porc_iva: obj.porcentaje_gravamen
    };
    
    var query = G.knex('inv_facturas_despacho_d').insert(parametros);     
       
    if(transaccion) query.transacting(transaccion);     
    query.then(function(resultado){
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaIndividualDetalle]: ", err);     
        callback({err:err, msj: "Error al guardar la factura individual]"});   
    }); 
};

/**
 * +Descripcion Metodo encargado de insertar el detalle de las facturas 
 *              que se agruparan
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.insertarFacturaAgrupadaDetalle = function(obj,tabla,transaccion, callback){
     
    var parametros = {
        item_id: G.knex.raw('DEFAULT'),
        tipo_id_vendedor: obj.tipo_id_vendedor,
        vendedor_id: obj.vendedor_id,
        pedido_cliente_id: obj.pedido_cliente_id, 
        empresa_id: obj.empresa_id,
        factura_fiscal: obj.factura_fiscal,
        prefijo: obj.prefijo,
        codigo_producto: obj.codigo_producto,
        cantidad: parseInt(obj.cantidad),
        valor_unitario: obj.valor_unitario,
        lote:obj.lote,
        fecha_vencimiento:obj.fecha_vencimiento,
        porc_iva: obj.porc_iva,
        prefijo_documento: obj.prefijo_documento,
        numeracion_documento: obj.numeracion_documento
    }; 
    
    var query = G.knex(tabla).insert(parametros);     
     
   if(transaccion) query.transacting(transaccion);     
    query.then(function(resultado){
        console.log("resultado [__insertarFacturaAgrupadaDetalle]-->", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaAgrupadaDetalle]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    }); 
};



/**
 * +Descripcion Metodo encargado de actualizar la numeracion del documento
 * @author Cristian Ardila
 * @fecha 2017-09-05
 */
FacturacionClientesModel.prototype.actualizarNumeracion = function(obj,transaccion, callback){
    
    var parametros = {empresa_id:obj.empresa_id,
        documento_id:obj.documento_id,
        tipo_doc_general_id: 'FV01'
    };
    var query = G.knex('documentos').where(parametros).increment('numeracion', '1' );         
    if(transaccion) query.transacting(transaccion);    
    query.then(function(resultado){    
        console.log("resultado [actualizarNumeracion]:", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [actualizarNumeracion]: ", err);       
        callback({err:err, msj: "Error al actualizar la numeracion del documento"});   
    });  
};

/**
 * +Descripcion Funcion encargada de actualizar en la tabla donde se almacenan
 *	        los pedidos el campo estado_factura_fiscal en 1 para identificar
 *		que el pedido ya ha sido facturado
 * @author Cristian Ardila
 * @fecha 2017-09-05
 */
FacturacionClientesModel.prototype.actualizarEstadoFacturaPedido = function(obj,transaccion, callback){
    
    var parametros = { 
        pedido_cliente_id: obj.pedido_cliente_id/*, 
        tipo_id_tercero: obj.tipo_id_tercero,
        tercero_id: obj.tercero_id,
        tipo_id_vendedor:obj.tipo_id_vendedor, 
        vendedor_id: obj.vendedor_id*/   
        
    };
    
    var query = G.knex("ventas_ordenes_pedidos")
        .where(parametros)            
        .update({estado_factura_fiscal: '1'});
    
    if(transaccion) query.transacting(transaccion);    
    query.then(function(resultado){        
        console.log("resultado [actualizarEstadoFacturaPedido]: ", resultado); 
        callback(false, resultado);
    }).catch(function(err){   
        console.log("err (/catch) [actualizarEstadoFacturaPedido]: ", err);        
        callback({err:err, msj: "Error al actualizar el estado de factura del pedido"});
    });    
};



/************************************GENERAR FACTURAS CONSUMO OK***************/

/**
 * +Descripcion Metodo encargado de consultar el temporal de la factura de
 *              consumo
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.consultarTemporalFacturaConsumo = function(parametros, callback){
    
    
    var query = G.knex.select()
        .from('inv_facturas_xconsumo_tmp')
        .where(parametros);     
 
    query.then(function(resultado){    
       
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultarTemporalFacturaConsumo]: ", err);     
        callback({err:err, msj: "Error al consultar el temporal de la factura de consumo]"});   
    }); 
};



/**
 * +Descripcion Metodo encargado de obtener los pedidos agrupados en una sola
 *              factura
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.consultarDetalleFacturaConsumo = function(obj, callback){
    
    var campos = [ G.knex.raw("sum(b.cantidad) as cantidad"),G.knex.raw("sum(b.cantidad) as cantidad2"),
            "b.tipo_id_vendedor",
            "b.vendedor_id",
            "b.pedido_cliente_id",
            "b.empresa_id", 
            "b.codigo_producto",
            G.knex.raw("to_char(b.fecha_vencimiento, 'yyyy-mm-dd') as fecha_vencimiento"),
            "b.lote",
            "b.prefijo_documento",
            "b.numeracion_documento"];
    var query = G.knex.column(campos)
        .select()
        .from('inv_facturas_agrupadas_despacho as a')             
        .innerJoin('inv_facturas_agrupadas_despacho_d as b',function(){
            this.on("a.prefijo", "b.prefijo")
                .on("a.factura_fiscal", "b.factura_fiscal")
        }).where(function(){
             this.andWhere("b.prefijo_documento", obj.prefijo)
                .andWhere("b.numeracion_documento", obj.numero)
                .andWhere("b.codigo_producto", obj.codigo_producto)
                .andWhere("b.lote", obj.lote)
                .andWhere("b.tipo_id_vendedor", obj.tipo_id_vendedor)
                .andWhere("b.vendedor_id", obj.vendedor_id)
                .andWhere("b.factura_fiscal", obj.factura_fiscal)
        })
        .groupBy("b.tipo_id_vendedor","b.vendedor_id","b.pedido_cliente_id","b.empresa_id",
        "b.codigo_producto","b.fecha_vencimiento","b.lote",
        "b.prefijo_documento","b.numeracion_documento");     
 
    query.then(function(resultado){   
       
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultarPedidosFacturaAgrupada]: ", err);     
        callback({err:err, msj: "Error al consultar los pedidos de la factura agrupada]"});   
    }); 
};
/**
 * +Descripcion Metodo encargado de consultar el detalle del temporal de la factura de
 *              consumo
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.consultarDetalleTemporalFacturaConsumo = function(obj, callback){
        
    var campos = [
        G.knex.raw("sum(b.cantidad_despachada) as cantidad_despachada"),
        "b.tipo_id_vendedor",
        "b.vendedor_id", 
        "b.empresa_id",
        "b.prefijo",
        "b.factura_fiscal",
        "b.observacion",
        "b.codigo_producto",
        G.knex.raw("to_char(b.fecha_vencimiento, 'yyyy-mm-dd') as fecha_vencimiento"),
        "b.lote",
        "b.porc_iva",
        "b.valor_unitario",
        "a.id_factura_xconsumo",
        "a.valor_total",
        "a.valor_sub_total",
        "a.valor_total_iva",
        "b.pedido_cliente_id"
        
    ];
    
    var query = G.knex.select(campos)
        .from('inv_facturas_xconsumo_tmp as a')
        .innerJoin('inv_facturas_xconsumo_tmp_d as b', function(){
            this.on("a.id_factura_xconsumo", "b.id_factura_xconsumo")
        })
        .where(function(){
            this.andWhere("a.tipo_id_tercero",obj.tipoIdTercero) 
            .andWhere("a.tercero_id", obj.terceroId)           
            .andWhere("b.empresa_id", obj.empresaId)
            .andWhere("a.sw_facturacion",0)
            
            if(obj.estado !== 2){
                this.andWhere("b.prefijo", obj.prefijo)
                .andWhere("b.factura_fiscal", obj.numero)
            }
            if(obj.estado === 1){
                this.andWhere("b.codigo_producto", obj.codigo_producto)
                .andWhere("b.lote",obj.lote)
            }
        })
        .groupBy("b.tipo_id_vendedor","b.vendedor_id","b.empresa_id",
        "b.prefijo", "b.factura_fiscal", "b.observacion",
        "b.codigo_producto","b.fecha_vencimiento","b.lote", "b.porc_iva","b.valor_unitario",
        "a.id_factura_xconsumo", "a.valor_total","a.valor_sub_total", "a.valor_total_iva", "b.pedido_cliente_id")
        
    query.then(function(resultado){  
        
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultarTemporalFacturaConsumo]: ", err);     
        callback({err:err, msj: "Error al consultar el temporal de la factura de consumo]"});   
    }); 
};


/**
 * +Descripcion Metodo encargado de obtener los pedidos agrupados en una sola
 *              factura
 * @author Cristian Ardila
 * @fecha 2017-15-05 YYYY-DD-MM
 */
FacturacionClientesModel.prototype.consultarEstadoPedido = function(obj, callback){
    
    var campos = [ 
        G.knex.raw("sum(cantidad_facturada)::integer as total_cantidad_facturada"),
        G.knex.raw("sum(cantidad)::integer as total_cantidad")
    ];
    var query = G.knex.column(campos)
        .select()
        .from('inv_bodegas_movimiento_d as a')             
        .where(function(){
            this.andWhere("prefijo ", obj.prefijo)
                .andWhere("numero", obj.numeracion)
                  
        }).as("a");                               
        
    var query2 = G.knex.select(G.knex.raw('CASE WHEN a.total_cantidad_facturada = a.total_cantidad THEN 1 ELSE 0 END as estado_pedido'))
        .from(query)

    query2.then(function(resultado){   
        console.log("resultado [consultarEstadoPedido]:: ", resultado)
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [consultarEstadoPedido]: ", err);     
        callback({err:err, msj: "Error al consultar los pedidos de la factura agrupada]"});   
    }); 
};

/*
 * @autor : Cristian Ardila
 * Descripcion : SQL encargado de actualizar la cantidad facturada hasta el momento
 *              y la cantidad que quedara pendiente
 * @fecha: 08/15/2015 2:43 pm 
 */
FacturacionClientesModel.prototype.actualizarCantidadFacturadaXConsumo = function(obj,callback) {
    
   var query = G.knex('inv_bodegas_movimiento_d')
        .where({prefijo: obj.prefijo, 
            numero: obj.numero,
            codigo_producto: obj.codigo_producto,
            lote: obj.lote,
            numero_caja: obj.numero_caja})
        .update({cantidad_facturada:
            G.knex.select([G.knex.raw('cantidad_facturada+'+obj.cantidad_facturada)]) 
            .from('inv_bodegas_movimiento_d')
            .where({prefijo: obj.prefijo, 
                numero: obj.numero,
                codigo_producto: obj.codigo_producto,
                lote: obj.lote,
                numero_caja: obj.numero_caja
            }),
            cantidad_pendiente_por_facturar: 
            G.knex.select([G.knex.raw('CASE WHEN cantidad_pendiente_por_facturar = 0\
            THEN cantidad-'+obj.cantidad_facturada+' ELSE\
            cantidad_pendiente_por_facturar-'+obj.cantidad_facturada+' END as cantidad_des')]) //cantidad-cantidad_facturada
            .from('inv_bodegas_movimiento_d')      
            .where({prefijo: obj.prefijo, 
                numero: obj.numero,
                codigo_producto: obj.codigo_producto,
                lote: obj.lote,
                numero_caja: obj.numero_caja
            }) 
        })  
     
    query.then(function(resultado){  
         
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [actualizarCantidadFacturadaXConsumo]: ", err);        
        callback({err:err, msj: "Error al actualizar la cantidad facturada en el movimiento"});   
    });  
};
/*
 * @autor : Cristian Ardila
 * Descripcion : SQL encargado de eliminar los productos que estan en temporal
 * @fecha: 08/06/2015 2:43 pm 
 */
FacturacionClientesModel.prototype.eliminarProductoTemporalFacturaConsumo = function(obj,callback) {
    
   var query = G.knex('inv_facturas_xconsumo_tmp_d')
        .where(obj)
        .del();    
      
    query.then(function(resultado){                
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [eliminarProductoTemporalFacturaConsumo]: ", err);        
        callback({err:err, msj: "Error al eliminar los temporales"});   
    });  
};


/*
 * @autor : Cristian Ardila
 * Descripcion : SQL encargado de actualiza el valor total y sub total del temporal de facturacion por consumo
 * @fecha: 08/11/2015 2:43 pm 
 */
FacturacionClientesModel.prototype.actualizarValorTotalTemporalFacturaConsumo = function(obj,callback) {
   
    var parametros = {valor_total:obj.valor_total,
                valor_sub_total: obj.valor_sub_total,
                valor_total_iva: obj.valor_total_iva};
    
    if(obj.estado === 1){
        parametros = {sw_facturacion: obj.sw_facturacion}
    }
    
    var query = G.knex('inv_facturas_xconsumo_tmp')
        .where({id_factura_xconsumo: obj.id_factura_xconsumo})
        .update(parametros);    
      
    query.then(function(resultado){ 
        console.log("actualizarValorTotalTemporalFacturaConsumo ", resultado);
        callback(false, resultado);
   }).catch(function(err){
        console.log("err (/catch) [actualizarValorTotalTemporalFacturaConsumo]: ", err);        
        callback({err:err, msj: "Error al actualizar el valor total y sub total del temporal de facturacion por consumo"});   
    });  
};
/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura temporal
 *              de consumo
 * @author Cristian Ardila
 * @fecha 2017-08-09 YYYY-MM-DD
 */
FacturacionClientesModel.prototype.insertarFacturaConsumo = function(obj, callback){
             
    var parametros = {empresa_id: obj.parametros.documento_facturacion[0].empresa_id,
        tipo_id_tercero: obj.parametros.consultar_tercero_contrato[0].tipo_id_tercero,
        tercero_id: obj.parametros.consultar_tercero_contrato[0].tercero_id,
        usuario_id: obj.usuario,
        observaciones: obj.parametros.consultar_tercero_contrato[0].condiciones_cliente + " - " + obj.parametros.parametros.observacion,
        fecha_corte: obj.parametros.parametros.fechaCorte,
        porcentaje_rtf: obj.porcentaje_rtf,
        porcentaje_ica: obj.porcentaje_ica,
        porcentaje_reteiva: obj.porcentaje_reteiva,
        porcentaje_cree: obj.porcentaje_cree,
        tipo_pago_id: obj.tipoPago 
    };
    
    
    console.log("parametros ", obj.parametros.parametros.pedidos);
    var query = G.knex('inv_facturas_xconsumo_tmp').insert(parametros).returning(['id_factura_xconsumo']);     
     
    query.then(function(resultado){      
        console.log("resultado [insertarFacturaConsumo]::>>  ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarFacturaConsumo]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    }); 
};

/**
 * +Descripcion Metodo encargado de registrar la cabecera de la factura temporal
 *              de consumo
 * @author Cristian Ardila
 * @fecha 2017-08-09 YYYY-MM-DD
 */
FacturacionClientesModel.prototype.insertarDetalleFacturaConsumo = function(parametros, callback){
    
    var query = G.knex('inv_facturas_xconsumo_tmp_d').insert(parametros);     
     
    query.then(function(resultado){      
        
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [insertarDetalleFacturaConsumo]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    }); 
    
};

/*
 * @autor : Cristian Ardila
 * +Descripcion : Transaccion para almacenar los temporales de la formula
 *                que vendrian siendo los lotes
 * @fecha: 05/07/2015
 */
FacturacionClientesModel.prototype.generarFacturaXConsumo = function(obj, callback)
{   
    var that = this;
    var def = G.Q.defer();
    //console.log("obj ", obj);
    G.knex.transaction(function(transaccion) {
        
        G.Q.ninvoke(that,'insertarFacturaAgrupada',1,obj.parametrosCabecera,transaccion).then(function(){ 
             
            return G.Q.nfcall(__insertarFacturaAgrupadaDetalle,that,0,obj.datosDocumentosXConsumo,"inv_facturas_agrupadas_despacho_d",1,transaccion);  
                
        }).then(function(resultado){
            
           return G.Q.ninvoke(that,'actualizarNumeracion',{
                empresa_id: obj.datosDocumentosXConsumo.cabecera[0].empresa_id,
                documento_id: obj.datosDocumentosXConsumo.cabecera[0].documento_id
                }, transaccion); 
                
        }).then(function(resultado){   
           
           transaccion.commit();         
        }).fail(function(err){   
           console.log("err [generarFacturaXConsumo]: ", err)
           transaccion.rollback(err);
        }).done();
    }).then(function(){     
            callback(false);
    }).catch(function(err){       
            callback(err);       
    }).done(); 
    
};


/**
 * +Descripcion Metodo encargado de generar las facturas agrupadas 
 *              mediante la transaccion la cual ejecuta varios querys
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.generarTemporalFacturaConsumo = function(obj, callback){   
    console.log("*********FacturacionClientesModel.prototype.generarTemporalFacturaConsumo***************");  
    console.log("*********FacturacionClientesModel.prototype.generarTemporalFacturaConsumo***************");  
    console.log("*********FacturacionClientesModel.prototype.generarTemporalFacturaConsumo***************");
   
    var that = this;
    var def = G.Q.defer();
    var porcentajeRtf = '0';
    var porcentajeIca = '0';
    var porcentajeReteiva = '0';
    var porcentajeCree = obj.consultar_tercero_contrato[0].porcentaje_cree;    
    var parametrosFacturasAgrupadas;
    datosAdicionalesAgrupados = [];
    parametrosActualizarEstadoFactura = [];
    parametrosInsertaFacturaAgrupadaDetalle = [];
     
    if (obj.consultar_parametros_retencion.sw_rtf === '1' || obj.consultar_parametros_retencion.sw_rtf === '3')
        porcentajeRtf = obj.consultar_tercero_contrato[0].porcentaje_rtf;
    if (obj.consultar_parametros_retencion.sw_ica === '1' || obj.consultar_parametros_retencion.sw_ica === '3')
        porcentajeIca = obj.consultar_tercero_contrato[0].porcentaje_ica;
    if (obj.consultar_parametros_retencion.sw_reteiva === '1' || obj.consultar_parametros_retencion.sw_reteiva === '3')
        porcentajeReteiva = obj.consultar_tercero_contrato[0].porcentaje_reteiva;
  
    G.Q.ninvoke(that,'insertarFacturaConsumo',
    {parametros:obj, porcentaje_rtf:porcentajeRtf, porcentaje_ica: porcentajeIca, 
    porcentaje_reteiva: porcentajeReteiva, porcentaje_cree: porcentajeCree, usuario: obj.parametros.usuario, 
    tipoPago: obj.parametros.tipoPago

    }).then(function(resultado){         

        callback(false, resultado);
        
    }).catch(function(err){
        console.log("err (/catch) [generarTemporalFacturaConsumo]: ", err);     
        callback({err:err, msj: "Error al guardar la factura agrupada]"});   
    }); 
}

var parametrosActualizarEstadoFactura = [];
var datosAdicionalesAgrupados = [];
var parametrosInsertaFacturaAgrupadaDetalle = [];
/**
 * +Descripcion Metodo encargado de generar las facturas agrupadas 
 *              mediante la transaccion la cual ejecuta varios querys
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.transaccionGenerarFacturasAgrupadas = function(obj, callback)
{   
     
    var that = this;
    var def = G.Q.defer();
    var porcentajeRtf = '0';
    var porcentajeIca = '0';
    var porcentajeReteiva = '0';
    var porcentajeCree = obj.consultar_tercero_contrato[0].porcentaje_cree;    
    var parametrosFacturasAgrupadas;
    datosAdicionalesAgrupados = [];
    parametrosActualizarEstadoFactura = [];
    parametrosInsertaFacturaAgrupadaDetalle = [];
     
    if (obj.consultar_parametros_retencion.sw_rtf === '1' || obj.consultar_parametros_retencion.sw_rtf === '3')
        porcentajeRtf = obj.consultar_tercero_contrato[0].porcentaje_rtf;
    if (obj.consultar_parametros_retencion.sw_ica === '1' || obj.consultar_parametros_retencion.sw_ica === '3')
        porcentajeIca = obj.consultar_tercero_contrato[0].porcentaje_ica;
    if (obj.consultar_parametros_retencion.sw_reteiva === '1' || obj.consultar_parametros_retencion.sw_reteiva === '3')
        porcentajeReteiva = obj.consultar_tercero_contrato[0].porcentaje_reteiva;
        
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'insertarFacturaAgrupada',0,
        {parametros:obj,
         porcentaje_rtf:porcentajeRtf,
         porcentaje_ica: porcentajeIca,
         porcentaje_reteiva: porcentajeReteiva,
         porcentaje_cree: porcentajeCree,
         usuario: obj.parametros.usuario,
         tipoPago: obj.parametros.tipoPago,
         facturacion_cosmitet:obj.parametros.facturacionCosmitet
              
        },transaccion).then(function(){           
            
            return G.Q.ninvoke(that,'insertarPcFactura',{parametros:obj,swTipoFactura: '1'}, transaccion);    
            
        }).then(function(){
            
            return G.Q.nfcall(__detallePedidosClientes,that,0, obj.parametros.pedidos,transaccion);
                    
        }).then(function(){ 
            
            if(datosAdicionalesAgrupados.length > 0){

                obj.documento_facturacion.forEach(function(documento){                

                    datosAdicionalesAgrupados.forEach(function(rowDatosAdicionalesAgrupados){                    

                        rowDatosAdicionalesAgrupados.forEach(function(row){

                            row.datos_adicionales.forEach(function(rowDatosAdicionales){

                                row.detalle.forEach(function(rowDetalle){

                                    if(obj.consultar_tercero_contrato[0].facturar_iva === '0'){
                                        rowDetalle.porcentaje_gravamen = 0;
                                    }

                                    parametrosFacturasAgrupadas = {
                                        tipo_id_tercero: obj.parametros.tipoIdTercero,
                                        tercero_id: obj.parametros.terceroId,
                                        tipo_id_vendedor: row.vendedor.tipo_id_tercero,
                                        vendedor_id: row.vendedor.id,
                                        pedido_cliente_id : rowDatosAdicionales.numero_pedido,
                                        empresa_id:documento.empresa_id, 
                                        factura_fiscal:documento.numeracion,
                                        prefijo: documento.id,
                                        codigo_producto: rowDetalle.codigo_producto,
                                        cantidad: parseInt(rowDetalle.cantidad),
                                        valor_unitario: rowDetalle.valor_unitario,
                                        lote:rowDetalle.lote,
                                        fecha_vencimiento: rowDetalle.fecha_vencimiento,
                                        porcentaje_gravamen: rowDetalle.porcentaje_gravamen,
                                        prefijo_documento: null,
                                        numeracion_documento: null
                                    };                                                                
                                    parametrosInsertaFacturaAgrupadaDetalle.push(parametrosFacturasAgrupadas);                            
                                });
                            });                      
                        });                   
                        parametrosActualizarEstadoFactura.push(parametrosFacturasAgrupadas);
                    });                           
                });            
            }else{
                
                throw {msj:'No hay documentos seleccionados', status: 404};  
                
            }
                                      
        }).then(function(){
           
            return G.Q.nfcall(__insertarFacturaAgrupadaDetalle,that,0,parametrosInsertaFacturaAgrupadaDetalle,"inv_facturas_agrupadas_despacho_d",0,transaccion);
           
        }).then(function(){
                   
        
            return G.Q.ninvoke(that,'actualizarNumeracion',{
                empresa_id:obj.documento_facturacion[0].empresa_id,
                documento_id:obj.documento_facturacion[0].documento_id
                }, transaccion);
            
        }).then(function(){
 
            return G.Q.nfcall(__actualizarEstadoFacturaPedido,that,0,parametrosActualizarEstadoFactura, transaccion);
            
        }).then(function(){                           
           transaccion.commit(); 
        }).fail(function(err){
            /*logger.error("-----------------------------------");
            logger.error({"metodo":"FacturacionClientes.prototype.transaccionGenerarFacturasAgrupadas",
            "usuario_id": obj.parametros.usuario,
            "documento_facturacion: ": obj.documento_facturacion,
            "consultar_tercero_contrato: ": obj.consultar_tercero_contrato,
            "consultar_parametros_retencion: ": obj.consultar_parametros_retencion,
            "parametrosFacturasAgrupadas: ": parametrosFacturasAgrupadas,
            "datosAdicionalesAgrupados": datosAdicionalesAgrupados,
            "parametrosActualizarEstadoFactura": parametrosActualizarEstadoFactura,
            "parametrosInsertaFacturaAgrupadaDetalle": parametrosInsertaFacturaAgrupadaDetalle,
            "porcentajes":{ 
                "porcentajeRtf" :porcentajeRtf,
                "porcentajeIca":porcentajeIca,
                "porcentajeReteiva":porcentajeReteiva
            },
            "resultado: ":err});
            logger.error("-----------------------------------");*/
            console.log("err (/fail) [GenerarFacturasAgrupadas]: ", err);
            transaccion.rollback(err);
        }).done();

    }).then(function(){
       callback(false,obj.documento_facturacion[0]);
    }).catch(function(err){      
       callback(err);
    }).done(); 
    
};



function __actualizarEstadoFacturaPedido(that,index,datos,transaccion, callback){
    
    var dato = datos[index];
    if(!dato){
        
        callback(false);
        return;
    }
    
    index++;
    
    G.Q.ninvoke(that,'actualizarEstadoFacturaPedido',dato,transaccion).then(function(resultado){
         
    }).fail(function(err){
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
        transaccion.rollback(err);
    }).done();
    
    setTimeout(function() {
         
        __actualizarEstadoFacturaPedido(that,index,datos,transaccion, callback)
    
    }, 300);
    
}

/**
 * +Descripcion Metodo encargado de reccorrer el arreglo de los parametros que
 *              registrara el detalle de las facturas agrupadas
 * @fecha 2017-05-17
 */
function __insertarFacturaAgrupadaDetalle(that,index,datos,tabla,estado,transaccion, callback){
    
    var parametros;
    var dato = estado === 1 ? datos.detalle[index]: datos[index] ;   

    if(!dato){
        
        callback(false);
        return;
    }
    
   
    if(estado === 1){
        parametros = { 
            tipo_id_vendedor: dato.tipo_id_vendedor,
            vendedor_id: dato.vendedor_id,
            pedido_cliente_id: dato.pedido_cliente_id, 
            empresa_id: dato.empresa_id,
            factura_fiscal: datos.cabecera[0].factura_fiscal,
            prefijo: datos.cabecera[0].prefijo,
            codigo_producto: dato.codigo_producto,
            cantidad: dato.cantidad_despachada,
            valor_unitario: dato.valor_unitario,
            lote:dato.lote,
            fecha_vencimiento:dato.fecha_vencimiento,
            porc_iva: dato.porc_iva,
            prefijo_documento: dato.prefijo,
            numeracion_documento: dato.factura_fiscal
        };
    }
    index++;
   
    G.Q.ninvoke(that,'insertarFacturaAgrupadaDetalle',estado === 1 ? parametros: dato,tabla,transaccion).then(function(resultado){
         
    }).fail(function(err){
        console.log("err (/fail) [generarDispensacionFormulaPendientes]: ", err);
        transaccion.rollback(err);
    }).done();
    
     setTimeout(function() {
         
            __insertarFacturaAgrupadaDetalle(that,index,datos,tabla,estado,transaccion, callback)
    
    }, 300);
    
};
/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de actualizar el movimiento de despacho
 *              de  los clientes
 * @fecha 2017-09-05
 */
FacturacionClientesModel.prototype.actualizarDespacho = function(obj,transaccion,callback) {
     
    var parametros ={empresa_id:obj.empresa_id,
        prefijo:obj.prefijo,
        numero: obj.numero                   
    };            
     
    var query = G.knex('inv_bodegas_movimiento_despachos_clientes')
        .where(parametros).update({factura_gener: '1'});
 
    if(transaccion) query.transacting(transaccion);    
    query.then(function(resultado){ 
        console.log("resultado [__actualizarDespacho]: ", resultado);
        callback(false, resultado);
    }).catch(function(err){
        console.log("err (/catch) [__actualizarDespacho]: ", err);
        callback({err:err, msj: "Error al actualizar el movimiento del despacho del cliente"});   
    });  
};


/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de registrar los despachos agrupados
 * @fecha 2017-05-11
 */
function __detallePedidosClientes(that, index, pedidos,transaccion, callback) {
   
    var pedido = pedidos[index];   
    
    if (!pedido) {       
       
        callback(false);  
        return;                     
    }  
    
    index++;
     
    if(pedido.pedidos[0].documentoSeleccionado.length > 0){
       
        return G.Q.nfcall(__guardarDespachoIndividual,that,0, pedido.pedidos[0],[],transaccion).then(function(resultado){ 
         
            datosAdicionalesAgrupados.push(resultado)
       
            setTimeout(function() {
                __detallePedidosClientes(that, index, pedidos,transaccion, callback);
            }, 300);  
        
        
        }).fail(function(err){ 
            console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
            callback(err);            
        }).done();
    }
    
    setTimeout(function() {
            __detallePedidosClientes(that, index, pedidos,transaccion, callback);
    }, 300);
   
};

 


/**
 * @author Cristian Manuel Ardila
 * +Descripcion Metodo encargado de registrar los despachos agrupados
 * @fecha 2017-05-11
 */
function __guardarDespachoIndividual(that, index, documentos,consultaCompleta,transaccion,callback) {
    
    var documento = documentos.documentoSeleccionado === undefined ? documentos[index] : documentos.documentoSeleccionado[index];   
    var def = G.Q.defer();
    var retorno = {cabecera:'',datos_adicionales:'', detalle:'', vendedor:''};
    if (!documento) {                                             
        
        callback(false,consultaCompleta);                                   
        return;                                                        
    }  
    
    index++;
    var parametros = {empresa_id:documento.empresa,
        prefijo:documento.prefijo,
        numero: documento.numero
    };
    
    G.Q.ninvoke(that.m_e008,'obtenerDocumentoBodega', parametros).then(function(resultado){     
              
        if(resultado.length > 0){
           retorno.cabecera = resultado;
           retorno.vendedor = documentos.documentoSeleccionado === undefined ? '' : documentos.vendedor[0];
           return G.Q.ninvoke(that.m_e008,'consultarDatosAdicionales',parametros);
        }else{
            throw {msj:'El documento no existe', state:404};
        }
        
    }).then(function(resultado){
        
        if(resultado.length > 0){
            retorno.datos_adicionales = resultado;           
            return G.Q.ninvoke(that.m_e008,'obtenerTotalDetalleDespacho',{empresa:documento.empresa,prefijoDocumento:documento.prefijo,numeroDocumento: documento.numero});
        }else{
            throw {msj:'El documento no tiene datos adicionales', state:404};
        }
    }).then(function(resultado){
         
        if(resultado.length > 0){
            retorno.detalle = resultado;           
            consultaCompleta.push(retorno);
        }else{
            throw {msj:'El documento no tiene detalle', state:404};
        }
        
    }).then(function(resultado){
        
        return G.Q.ninvoke(that,"actualizarDespacho", {empresa_id:documento.empresa,prefijo:documento.prefijo,numero: documento.numero},transaccion);
    })
   .fail(function(err){    
        console.log("err (/fail) [__guardarBodegasDocumentosDetalle]: ", err);
        callback(err);            
    }).done();
    
    setTimeout(function() {
            __guardarDespachoIndividual(that, index, documentos,consultaCompleta,transaccion,callback);
    }, 300);
   
};

/**
 * +Descripcion Metodo encargado de generar las facturas agrupadas 
 *              mediante la transaccion la cual ejecuta varios querys
 * @author Cristian Ardila
 * @fecha 17/05/2017 DD/MM/YYYY
 */
FacturacionClientesModel.prototype.transaccionGenerarFacturaIndividual = function(obj, callback){   
   
    var that = this;
    var def = G.Q.defer();
    var porcentajeRtf = '0';
    var porcentajeIca = '0';
    var porcentajeReteiva = '0';
    var porcentajeCree = obj.consultar_tercero_contrato[0].porcentaje_cree;
    var parametrosInsertarFacturaInvidual;
    
    if (obj.consultar_parametros_retencion.sw_rtf === '1' || obj.consultar_parametros_retencion.sw_rtf === '3')
        porcentajeRtf = obj.consultar_tercero_contrato[0].porcentaje_rtf;
    if (obj.consultar_parametros_retencion.sw_ica === '1' || obj.consultar_parametros_retencion.sw_ica === '3')
        porcentajeIca = obj.consultar_tercero_contrato[0].porcentaje_ica;
    if (obj.consultar_parametros_retencion.sw_reteiva === '1' || obj.consultar_parametros_retencion.sw_reteiva === '3')
        porcentajeReteiva = obj.consultar_tercero_contrato[0].porcentaje_reteiva;
        
    G.knex.transaction(function(transaccion) {  
        
        G.Q.ninvoke(that,'insertarFacturaIndividual',
        {parametros:obj,
         porcentaje_rtf:porcentajeRtf,
         porcentaje_ica: porcentajeIca,
         porcentaje_reteiva: porcentajeReteiva,
         porcentaje_cree: porcentajeCree,
         usuario: obj.parametros.usuario,
         tipoPago: obj.parametros.tipoPago,
         facturacion_cosmitet:obj.parametros.facturacionCosmitet
        },transaccion).then(function(resultado){   
             
            return G.Q.ninvoke(that,'insertarPcFactura',{parametros:obj,swTipoFactura: '1'}, transaccion);                                  
        }).then(function(){
                                
            return G.Q.nfcall(__guardarDespachoIndividual,that,0, obj.parametros.documentos,[],transaccion);
            
        }).then(function(consultaCompleta){
            
            if(consultaCompleta.length > 0){
                
                obj.documento_facturacion.forEach(function(documento){

                    consultaCompleta.forEach(function(row){

                        row.detalle.forEach(function(rowDetalle){

                            if(obj.consultar_tercero_contrato[0].facturar_iva === '0'){
                                rowDetalle.porcentaje_gravamen = 0;
                            }
                                parametrosInsertarFacturaInvidual = {empresa_id:documento.empresa_id, 
                                    numeracion:documento.numeracion,
                                    prefijo: documento.id,
                                    codigo_producto: rowDetalle.codigo_producto,
                                    cantidad: rowDetalle.cantidad,
                                    valor_unitario: rowDetalle.valor_unitario,
                                    lote:rowDetalle.lote,
                                    fecha_vencimiento: rowDetalle.fecha_vencimiento,
                                    porcentaje_gravamen: rowDetalle.porcentaje_gravamen
                                };   
                           
                            return G.Q.nfcall(__insertarFacturaIndividualDetalle,parametrosInsertarFacturaInvidual,transaccion);
                        });    
                    });                 
                });
                                                       
            }else{
                throw {msj:'No hay documentos seleccionados', status: 404};  
                
            }
             
        }).then(function(){
            
            return G.Q.ninvoke(that,'actualizarNumeracion',{
                empresa_id:obj.documento_facturacion[0].empresa_id,
                documento_id:obj.documento_facturacion[0].documento_id
            }, transaccion);
            
        }).then(function(){
           
            var parametros = { 
                pedido_cliente_id: obj.parametros.pedido.pedidos[0].numero_cotizacion, 
                tipo_id_tercero: obj.consultar_tercero_contrato[0].tipo_id_tercero,
                tercero_id: obj.consultar_tercero_contrato[0].tercero_id,
                tipo_id_vendedor:obj.parametros.pedido.pedidos[0].vendedor[0].tipo_id_tercero, 
                vendedor_id: obj.parametros.pedido.pedidos[0].vendedor[0].id
            };
          
            return G.Q.ninvoke(that,'actualizarEstadoFacturaPedido',parametros, transaccion);
                                                                      
        }).then(function(){        
           transaccion.commit(); 
        }).fail(function(err){
            logger.error("-----------------------------------");
            logger.error({"metodo":"FacturacionClientes.prototype.transaccionGenerarFacturaIndividual",
            "usuario_id": obj.parametros.usuario,
            "documento_facturacion: ": obj.documento_facturacion,
            "consultar_tercero_contrato: ": obj.consultar_tercero_contrato,
            "consultar_parametros_retencion: ": obj.consultar_parametros_retencion,
            "parametrosInsertarFacturaInvidual: ": parametrosInsertarFacturaInvidual,
            "porcentajes":{ 
                "porcentajeRtf" :porcentajeRtf,
                "porcentajeIca":porcentajeIca,
                "porcentajeReteiva":porcentajeReteiva
            },
            "resultado: ":err});
            logger.error("-----------------------------------");
            console.log("err (/fail) [transaccionGenerarFacturaIndividual]: ", err);
            transaccion.rollback(err);
        }).done();

    }).then(function(){
        
       callback(false,parametrosInsertarFacturaInvidual);
    }).catch(function(err){     
        
       callback(err);
    }).done(); 
    
};

   
FacturacionClientesModel.$inject = ["m_e008"];


module.exports = FacturacionClientesModel;