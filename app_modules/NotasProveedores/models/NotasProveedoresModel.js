/* global G */

var NotasProveedoresModel = function () {};

NotasProveedoresModel.prototype.TiposDoc = function (obj, callback) {
    console.log('In model "TiposDoc"');

    return callback(false, 'All fine!!!');
};

NotasProveedoresModel.prototype.TiposDoc = function(obj, callback){
    console.log('In Model "TiposDoc"');

    var resultado = ['CC', 'CE'];
    callback(false, resultado);
};

NotasProveedoresModel.prototype.listarNotasProveedor = function(obj, callback) {
    console.log('In model "listarNotas"' + '\n' + 'obj: ', obj);

    var query = G.knex.select([
            "c.tipo_id_tercero as documentoTipo",
            "c.tercero_id as documentoId",
            "c.nombre_tercero as proveedorNombre",
            "b.codigo_proveedor_id as proveedorId",
            "a.numero_factura as facturaNumero",
            "a.observaciones as facturaObservacion",
            G.knex.raw("TO_CHAR(a.fecha_registro, 'DD-MM-YYY') as fecha"),
            "a.valor_factura as facturaValor",
            "a.saldo as facturaSaldo"
        ])
        .from('inv_facturas_proveedores as a')
        .leftJoin('terceros_proveedores as b', 'a.codigo_proveedor_id', 'b.codigo_proveedor_id')
        .leftJoin('terceros as c', function() {
            this.on('b.tipo_id_tercero', '=', 'c.tipo_id_tercero')
                .on('b.tercero_id', '=', 'c.tercero_id')
        })
        .where('a.saldo', '>', '0')
        .andWhere('a.empresa_id', obj.empresaId)
        .andWhere(function(){
            if(obj.tipo_documento !== undefined){
                this.where('c.tipo_id_tercero', obj.tipo_documento);
            }
            if(obj.numero_documento !== undefined){
                this.where('c.tercero_id', obj.numero_documento);
            }
            if(obj.nombre !== undefined){
                this.where("c.nombre_tercero", "ILIKE", "%"+obj.nombre+"%");
            }
            if(obj.factura !== undefined){
                this.where("a.numero_factura", "ILIKE", "%"+obj.factura+"%");
            }
        });
    console.log('Sql es: ', G.sqlformatter.format(query.toString()));

    query.then(function(response){
        callback(false, response);
    }).catch(function(err){
       callback(err);
    });
};

NotasProveedoresModel.prototype.GuardarTemporal_Detalle = function(obj, callback){
    if(obj.nota_mayor_valor === undefined){
        obj.nota_mayor_valor = '0';
    }

    if(obj.sube_baja_costo === undefined){
        obj.sube_baja_costo = '0';
    }
    /*$this->debug=true;*/
    //print_r($Datos);
    var query = G.knex('inv_notas_facturas_proveedor_d_tmp').insert({
        codigo_proveedor_id: obj.codigoProveedorId,
        numero_factura: obj.numeroFactura,
        empresa_id: obj.empresaId,
        usuario_id: obj.usuarioId,
        codigo_producto: obj.codigo_producto,
        cantidad: obj.cantidad,
        concepto: obj.codigo_concepto_general,
        concepto_especifico: obj.concepto_especifico,
        valor_concepto: obj.valor_concepto,
        observacion: obj.observacion,
        nota_mayor_valor: obj.nota_mayor_valor,
        valor: obj.valor,
        porc_iva: obj.porc_iva,
        sube_baja_costo: obj.sube_baja_costo,

    });
    $rst->Close();

    callback(false, {});
};

NotasProveedoresModel.$inject = [];
module.exports = NotasProveedoresModel;
