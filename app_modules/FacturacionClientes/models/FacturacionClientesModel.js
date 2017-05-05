var FacturacionClientesModel = function () {};

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
 * @author Cristian Ardila
 * @fecha 20/05/2016
 * +Descripcion Modelo encargado de listar los tipos de terceros
 * @controller FacturacionClientes.prototype.listarTiposTerceros
 */
FacturacionClientesModel.prototype.listarPrefijosFacturas = function (obj,callback) {

    G.knex.column([G.knex.raw('prefijo as id'),
                G.knex.raw('prefijo as descripcion')])
            .select()
            .from('documentos')
            .where("tipo_doc_general_id",'FV01')
            .andWhere("empresa_id", obj.empresaId)
            .then(function (resultado) {

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
        "municipio"];

    var query = G.knex.select(columnas)
            .from('terceros as a')
            .innerJoin('terceros_clientes as b', function () {
                this.on("a.tipo_id_tercero", "b.tipo_id_tercero")
                        .on("a.tercero_id", "b.tercero_id")
            }).leftJoin('inv_tipos_bloqueos as c', function () {
        this.on("a.tipo_bloqueo_id", "c.tipo_bloqueo_id")

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
            "a.tercero_id",
            "a.direccion",
            "a.telefono",
            "a.email",
            "a.nombre_tercero",
            "a.tipo_bloqueo_id",
            "c.descripcion",
            "g.pais",
            "f.departamento",
            "municipio")
            .orderBy("a.nombre_tercero")
            .where(function () {

                if ((obj.filtro.tipo !== 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("a.tercero_id  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
                if ((obj.filtro.tipo === 'Nombre') && obj.terminoBusqueda !== "") {
                    this.andWhere(G.knex.raw("a.nombre_tercero  " + G.constants.db().LIKE + "'%" + obj.terminoBusqueda + "%'"))
                }
            }).andWhere('b.empresa_id', obj.empresaId);

    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {

        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarClientes]:", err);
       callback({err:err, msj: "Error al consultar la lista de los clientes"});   
    });

};

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
        "a.fecha_registro",
        //G.knex.raw("TO_CHAR(a.fecha_registro,'YYYY-MM-DD 00:00:00') AS fecha_registro"),
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
}
;


function __consultaAgrupada(tabla1, estado, columna, query, filtro) {
console.log("parametros2 filtro ", filtro)
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

        this.andWhere('a.empresa_id', filtro.empresaId)
            .andWhere('c.nombre_tercero', G.constants.db().LIKE, "%" + filtro.nombreTercero + "%")
            .andWhere('a.tercero_id', G.constants.db().LIKE, "%" + filtro.terceroId + "%");//
        if (filtro.numero !== "") {
            this.andWhere('a.factura_fiscal', filtro.numero);
        }
        if (filtro.prefijo !== "") {
            this.andWhere('a.prefijo', filtro.prefijo);
        }
        if (filtro.tipoIdTercero !== "") {
            this.andWhere('a.tipo_id_tercero', filtro.tipoIdTercero);
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

}
;

/**
 * @author Cristian Ardila
 * +Descripcion Metodo encargado de listar los clientes
 * @fecha 2017-02-05 YYYY-DD-MM
 * @param {type} obj
 * @param {type} callback
 * @returns {undefined}
 */
FacturacionClientesModel.prototype.listarFacturasGeneradas = function (filtro, callback) {

    var colQuery = [G.knex.raw("a.*"),
        "b.estado",
        G.knex.raw("case when b.estado=0 then 'Sincronizado' else 'NO sincronizado' end as descripcion_estado"),
        "b.mensaje"];

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
                    filtro));

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
       //console.log("resultado [query.toSQL()]:  ", query.toSQL());
        callback(false, resultado)
    }).catch(function (err) {
        //console.log("err [listarFacturasGeneradas] ", err);
        callback({err:err, msj: "Error al consultar la lista de las facturas generadas"});   
    });
};


FacturacionClientesModel.prototype.listarPedidosClientes = function (obj, callback) {
   
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
        "b.prefijo",
        G.knex.raw("b.numero as factura_fiscal"),
        G.knex.raw("true as seleccionado")
   ];
   
   
   
    var subQuery1 = G.knex.column([G.knex.raw("DISTINCT x.pedido_cliente_id"),  "x.numero", "x.prefijo" ])
           .select().from("inv_bodegas_movimiento_despachos_clientes as x")
           .where("x.factura_gener",'0')
           .andWhere("x.empresa_id",obj.empresaId).as("b"); //obj.empresaId
    
    var query = G.knex.select(columnQuery)
            .from("ventas_ordenes_pedidos as a")
            .join(subQuery1, function () {

                this.on("a.pedido_cliente_id","b.pedido_cliente_id")

            }).join("terceros as c", function(){      
                this.on("a.tipo_id_tercero","c.tipo_id_tercero")
                    .on("a.tercero_id","c.tercero_id")
            }).join("vnts_vendedores as d", function(){
                this.on("a.tipo_id_vendedor","d.tipo_id_vendedor")
                    .on("a.vendedor_id","d.vendedor_id")
            }).where(function () {

                this.andWhere('a.tipo_id_tercero', obj.tipoIdTercero)//obj.tipoIdTercero
                    .andWhere('a.tercero_id',obj.terceroId);//obj.terceroId
                if (obj.pedidoClienteId !== "") {
                    this.andWhere('a.pedido_cliente_id', obj.pedidoClienteId);
                }
                
            });
    
    query.limit(G.settings.limit).
            offset((obj.paginaActual - 1) * G.settings.limit)
    query.then(function (resultado) {
       
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [listarPedidosClientes] ", err);
        callback({err:err, msj: "Error al consultar la lista de los pedidos"});   
    });
};




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
                    .on("a.empresa_id", "'" + obj.empresaId + "'")
                    .on("c.estado",'1')
            }).leftJoin("vnts_contratos_clientes as d", function () {
                this.on("a.codigo_unidad_negocio","d.codigo_unidad_negocio")
                    .on("d.empresa_id", "'" + obj.empresaId + "'")
                    .on("d.estado",'1')
            }).join("terceros as e", function(){
                this.on("a.tipo_id_tercero","e.tipo_id_tercero")
                    .on("a.empresa_id", "'" + obj.empresaId + "'")
                    .on("a.tercero_id","e.tercero_id")
            }).where(function(){
                this.andWhere("a.tipo_id_tercero", "'"+obj.tipoIdTercero+"'")
                    .andWhere("a.tercero_id", "'"+obj.terceroId+"'")
            });
   
   
   query.then(function (resultado) {
       
        callback(false, resultado)
    }).catch(function (err) {
        console.log("err [consultarTerceroContrato] ", err);
         callback({err:err, msj: "Error al consultar el contrato de terceros"});   
    });
   
}
FacturacionClientesModel.$inject = [];


module.exports = FacturacionClientesModel;